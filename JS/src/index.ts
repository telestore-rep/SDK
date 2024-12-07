import { AuthProxyClient } from '@itbuild/auth.proxy';
import { TrexWalletClient } from '@itbuild/trex.wallet';
import { ApiResponse, ApiResponseExt, AppUsage, GetStatisticsParams } from './model';
import { objectToQueryParams } from './helpers/objectToQueryParams';

export class TeleStoreClient {
  public readonly UserKey: string = null;
  public readonly Auth: AuthProxyClient = null;
  public readonly Wallet: TrexWalletClient = null;

  private readonly BaseUrl: string = "https://web.tele.store/";

  constructor(userKey: string) {
    this.UserKey = userKey;
    const authProxyClient = new AuthProxyClient(this.BaseUrl);

    this.Auth = authProxyClient;
    this.Wallet = new TrexWalletClient(authProxyClient);
  }

  /**
   * Requests user's statistics
   * @param params filtering params
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
   * Create new session
   * @returns `true` on success
   * @returns `false` on error
   */
  public async Connect(): Promise<boolean> {
    const response = await this.Auth.SignInUserKey(this.UserKey);

    return !!response.error || response.result !== 'Failure';
  }

  private async ApiRequest<T>(url: string, init?: RequestInit): Promise<ApiResponseExt<T>> {
    const headers: Record<string, string> = {};
    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch(this.BaseUrl + url, {
        credentials: "include",
        ...init,
        headers: {
          ...defaultHeaders,
          ...init.headers,
          ...(this.Auth.GetSessionId() ? { Cookie: `sid=${this.Auth.GetSessionId()}` } : {})
        }
      });

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
