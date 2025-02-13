import { GetTransactionHistoryParams, HistoryTransaction } from "@itbuild/trex.wallet";

export interface ErrorObject {
  code?: number;
  readonly message?: string | null;
}

export interface ApiResponse<T> {
  error?: ErrorObject | null;
  result?: T | null;
}

export interface ApiResponseExt<T> extends ApiResponse<T> {
  id?: number;
  headers?: Record<string, string> | null;
}

export type GetStatisticsParams = {
  /**
   * the number of last apps to list
   */
  lastAppsUsed?: number;
  /**
   * app ID, if present will return data for one app only
   */
  app?: number;
  /**
   * start of the period to include in the list, default — week ago
   */
  start?: string;
  /**
   * end of the period to include in the list, default — now
   */
  end?: string;
};

export interface InvoiceParams {
  amount: number;
  currency?: string;
  appId: number;
  partnerInfo?: string
  tag?: string
}

export enum CodeTypeEnum {
  None = 0,
  RoomKey = 1,
  AgentLink = 2,
  AgentPayLink = 3,
  ClientInvestPayLink = 4,
  ClientRegPayLink = 5,
  InternalTx = 11,
  InternalTxConfirm = 12,
  InvoiceTx = 13,
  InvoiceTxConfirm = 14,
  DiscountPoints = 15,
  DiscountPercent = 16,
  RaffleCode = 17
}

export interface TxCode {
  amount?: number;
  code?: string | null;
  currency?: string | null;
  dateCodeUTC?: string | null;
  dateTxUTC?: string;
  isOwner?: boolean;
  readonly state?: string | null;
  link?: string;
  stateCode?: number;
  typeTx?: CodeTypeEnum;
}

export interface AppUsage {
  app?: number;
  /** @nullable */
  date_use?: string | null;
  /** @nullable */
  game_link?: string | null;
  /** @nullable */
  large_img?: string | null;
  /** @nullable */
  medium_img?: string | null;
  /** @nullable */
  small_img?: string | null;
  teleuser?: number;
}

export enum OriginalStatusEnum {
  None = 0,
  Successful = 1,
  Rejected = 2,
  FailedReverted = 3,
  FailedOutOfEnergy = 4,
  Failed = 5,
  FailedOutOfGas = 6,
  COMPLETED = 100,
  HOLD = 101,
  PROCESSING = 102,
  BANK_CANCELLED = 103,
  INSUFFICIENT_FUNDS = 104,
  REFUND = 105,
  UNKNOWN = 106,
}

export enum AdrTxStateEnum {
  None = 0,
  Draft = 1,
  AmlConfirm = 2,
  SendedToModule = 4,
  SendedToNetwork = 8,
  NetworkIn = 16,
  NetworkConfirmed = 32,
  HasInnerTransaction = 64,
  Cancelation = 2048,
  Finished = 8192,
}

export interface SubscribeFuncs {
  handleInvoiceUpdate: (invoice: HistoryTransaction) => Promise<void>;
}

export interface AddressTxData {
  address_from?: string | null;
  address_to?: string | null;
  block_num?: number | null;
  original_state?: OriginalStatusEnum;
  state?: AdrTxStateEnum;
  token_network?: string | null;
  tx_hash?: string | null;
}

export enum TransactStateEnum {
  None = 0,
  WithdrawCreated = 1,
  NetworkConfirmed = 2,
  NetworkUnConfirmed = 4,
  FromNetwork = 6,
  AMLSent = 8,
  Blocked = 16,
  Canceled = 32,
  Failed = 64,
  Finished = 128,
}

export enum TransactTypeEnum {
  None = 0,
  InnerTransfer = 1,
  ExchangeToBroker = 2,
  Income = 3,
  Outcome = 4,
  FromBank = 5,
  ToBank = 6,
  CreateInvest = 7,
  CloseInvest = 8,
  EarlyCloseInvest = 9,
  PaymentInvest = 10,
  InternalTx = 11,
  InternalTxConfirm = 12,
  InvoiceTx = 13,
  InvoiceTxConfirm = 14,
  OrderReturnBalance = 15,
  OrderCreate = 16,
  AgentPayment = 17,
  RewardPayment = 18,
  ExchangeFromBroker = 20,
  CrossProjectSelfTransfer = 21,
}

export enum NotifyMessType
{
    None,
    // Simple message
    SimpleMess = 1,
    // New incoming transaction
    TxInWallet = 2,
    // A group of transactions (more than one) within a short time period for the same currency
    TxInWalletGroup = 3,
    // A group of transactions (more than one) within a short time period for different currencies
    TxInWalletGroupDiff = 4,
    // An unfinished incoming transaction changed its status
    TxIncomeChanged = 5,
    // An unfinished account transaction changed its status
    TxInvoiceChanged = 6,
    // An exchange order changed its status or the remaining amount
    OrderChanged = 7,
    // New messages in chats
    NewChatMessage = 10,

    // Security notification
    Security = 200,
}
