import { AuthProxyClient } from '@itbuild/auth.proxy';
import { GetTransactionHistoryParams, HistoryTransaction, TrexWalletClient } from '@itbuild/trex.wallet';
import { objectToQueryParams } from './helpers/objectToQueryParams';
import {
  ApiResponse,
  ApiResponseExt,
  AppUsage,
  GetStatisticsParams,
  InvoiceParams,
  SubscribeFuncs,
  TxCode,
  NotifyMessType
} from './model';

export * from "./model";

export class TeleStoreClient {
  public readonly Auth: AuthProxyClient = null;
  public readonly Wallet: TrexWalletClient = null;

  private readonly BaseUrl: string;

  /**
   * Create new instance of `TeleStoreClient`
   * @param userKey - your user key
   * @param isDev - run dev mode on `true`
   */
  constructor(userKey: string, isDev: boolean = false) {
    this.BaseUrl = isDev
      ? "https://dev.tele.store:8081/"
      : "https://web.tele.store/";

    const authProxyClient = new AuthProxyClient(userKey, this.BaseUrl);

    this.Auth = authProxyClient;
    this.Wallet = new TrexWalletClient(authProxyClient);
  }

  /**
   * Create new session
   * @param force create session even if session is active
   * @returns `true` on success
   * @returns `false` on error
   */
  public async Connect(force: boolean = false): Promise<boolean> {
    return await this.Auth.Connect(force);
  }

  /**
   * Requests user's statistics
   * @param params - filtering params
   * @returns array of {@link AppUsage} on success
   * @returns object of {@link ErrorObject} on error
   */
  public async GetStatistics(params: GetStatisticsParams): Promise<ApiResponse<AppUsage[]>> {
    return await this.ApiRequest<AppUsage[]>(
      `api/v1/GetStatistics${objectToQueryParams(params)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
  }

  /**
   * Create new invoice
   * @param params - ivoice params
   * @param redirect - required to redirect user back to your app
   * @returns object of {@link TxCode} interface
   * @example link `https://web.tele.store/redirectPage.html?invoice=ISDW2JF3AFST0&redirect=true`
   */
  public async CreateInvoice(params: InvoiceParams, redirect: boolean = true): Promise<ApiResponse<TxCode>> {
    const response = await this.ApiRequest<TxCode>(
      `api/v1/create_invoice`,
      {
        method: "POST",
        body: JSON.stringify(params)
      }
    );

    if (response.error || !response.result) {
      return response;
    }

    return {
      result: {
        ...response.result,
        link: `${this.BaseUrl}redirectPage.html?invoice=${response.result.code}&redirect=${redirect}`
      }
    };
  }

  /**
   * Get transaction history
   * @param params history filters
   * @returns array of {@link HistoryTransaction}
   */
  public async GetTransactionHistory(params: GetTransactionHistoryParams): Promise<ApiResponse<HistoryTransaction[]>> {
    return await this.Wallet.GetTransactionHistory(params);
  }

  /**
   * Subscribe app to server EventSource.
   * Possible events {@link NotifyMessType}
   * @returns `true` on subscribe success
   * @returns `false` on error
   */
  public async StartMonitoring(params: SubscribeFuncs, lastInvoiceId: string = null): Promise<boolean> {
    if (lastInvoiceId !== null) {
      const isProcessed = await this.HandleLastInvoices(params, lastInvoiceId);

      if (!isProcessed) {
        console.log('Cannot process last invoices');
        return false;
      }
    }

    const messageHandler = async (message: unknown) => {
      await this.HandleMessage(message, params);
    }

    return this.Auth.Subscribe(messageHandler);
  }

  /**
   * Unsubscribes from EventSource
   * @returns — `true` on success
   * @returns — `false` on error
   */
  public StopMonitoring(): boolean {
    return this.Auth.Unsubscribe();
  }

  private async HandleLastInvoices(funcs: SubscribeFuncs, lastInvoiceId: string = null): Promise<boolean> {
    const response = await this.Wallet.GetTransactionHistory({
      limit: 100,
      tx_types: [13, 14],
      currencies: ["TeleUSD"],
      next_key: lastInvoiceId,
    });

    if (response.error) {
      console.log(`Error trying handle invoices after ${lastInvoiceId}`);
      return false;
    }

    const invoices = response.result;

    if (invoices.length === 0) {
      return true;
    }

    let invoice: HistoryTransaction = null;
    const hasMoreInvoices = invoices.length >= 100;

    const interval = setInterval(async () => {
      if (invoices.length === 0) {
        clearInterval(interval);
        return;
      }

      invoice = invoices.shift();

      // Is invoice marked as finished
      if (!(invoice.status & 1 << 7)) {
        return;
      }

      try {
        await funcs.handleInvoiceUpdate(invoice);
      } catch (error) {
        console.log("handleInvoice query error: ", JSON.stringify(error));
        return false;
      }
    }, 30000);

    return hasMoreInvoices
      ? this.HandleLastInvoices(funcs, invoice.next_key)
      : true;
  }

  private async HandleMessage(message: unknown, funcs: SubscribeFuncs): Promise<void> {
    if (!message) return;

    var object = message as { mess_type: number, obj: { txs: number[] } }

    switch (object?.mess_type) {
      case 6:
        const interval = setInterval(async () => {
          if (object.obj.txs.length === 0) {
            clearInterval(interval);
            return;
          }

          const txId = object.obj.txs.shift();
          const response = await this.Wallet.GetTransactionInfo({ id: txId });

          if (!response.error && response.result) {
            try {
              await funcs.handleInvoiceUpdate(response.result);
            } catch (error) {
              console.log("handleInvoice query error: ", JSON.stringify(error));
            }
          }
        }, 5000);

        break;
      default:
        console.log(`Do not support type ${JSON.stringify(message)}.`);
        return;
    }
  }

  private async ApiRequest<T>(url: string, init?: RequestInit): Promise<ApiResponseExt<T>> {
    const headers: Record<string, string> = {};
    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    try {
      const request = fetch(this.BaseUrl + url, {
        credentials: "include",
        ...init,
        headers: {
          ...defaultHeaders,
          ...init.headers,
          ...(this.Auth.GetSessionId() ? { Cookie: `sid=${this.Auth.GetSessionId()}` } : {})
        }
      });

      var response = await request;

      // Try to reconnect on 401
      if (response.status === 401) {
        await this.Connect(true);

        response = await request;
      }

      if (response.ok) {
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        return {
          ...(await response.json()) as ApiResponseExt<T>,
          headers
        }
      } else {
        return {
          error: { message: `Status: ${response.status}. ${response?.statusText}` },
          headers
        }
      }
    } catch (e) {
      return {
        error: { message: e?.message },
        headers: null
      };
    }
  };
}
