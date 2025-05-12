# Telestore SDK (JavaScript)

## Authorization

### Obtaining a new session

```ts
// First parameter - your user key from https://web.tele.store
// Second parameter - development mode, true or false
const teleStoreClient = new TeleStoreClient(`<YOUR_USER_KEY>`, true); 

const isConnected: boolean = await teleStoreClient.Connect();
```

## Wallet usage

### Receiveing transaction history

```ts
const txHistory = await teleStoreClient.GetTransactionHistory({
  currencies: ["TeleUSD"],
  
  // Date format: YYYY-MM-DD
  start: "2025-05-10", // Start date (without time) of UTC search, if not specified - then 90 days from end.
  end: "2024-05-10", // The final date (without time) of the UTC sample, if not specified, then the current one.

  limit: 10, // Number of transactions in the output, by default 10, but not more than 100
  next_key: null, // After what identifier (deep into history) to continue the selection (for lazy loading)
  tx_types: [13, 14] // Transacion type
});
```

### Creating invoice for user example

```ts
const getNewInvoiceLink = async (amount: number, partnerInfo: number, tag: string) => {
  const response = await teleStoreClient.CreateInvoice({
    amount: amount,
    currency: "TeleUSD",
    appId: <YOUR_APP_ID>,      // Your application ID from https://web.tele.store
    partnerInfo: partnerInfo,  // User ID from your app
    tag: tag                   // Info about bought item
  }, true); // By default, telestore will redirect user to your app after payment, if you want to avoid this, set to false

  if (response.error || !response.result) {
      throw response.error || !response.result; // Your error handling
  }

  return response.result.link;
}

// result example
// https://web.tele.store/redirect.html?invoice=ISDW2JF3AFSTP&redirect=true
const navigateUrl = await getNewInvoiceLink(20, `<YOUR_USER_ID>`, `<BOUGHT_ITEM_INFO>`);
```

Navigate user to **link** from received object

### Invoice payment monitoring example

```ts
const handleInvoiceFunction = async (invoice: HistoryTransaction) => {
  console.log(invoice);
}

const lastProcessedId: string | null = null; /* Last proccessed by your app invoice transaction */

const isSuccess = teleStoreClient.StartMonitoring({
  handleInvoiceUpdate: handleInvoiceFunction,
}, lastProcessedId); // lastProcessedId is required to process all unprocessed transactions, before monitoring begins.
```

**Сreate new invoices only after successfully start of monitoring service**

### Receiveng info about success payment

After the user makes a successful payment, he will be redirected to your application page with the parameter `successPayment=${transactionId}`, the link format is given below:

`https://your-game.link/?successPayment=1734526117729582`

## Response interface

Each return type from the SDK functions is wrapped in an ApiResponse<T> object:

```ts
export interface ApiResponse<T> {
  error?: ErrorObject | null;
  result?: T | null;
}

export interface ErrorObject {
  code: number; // Error code can be used to catch specific error codes
  readonly message: string | null; // Error description     
}
```
