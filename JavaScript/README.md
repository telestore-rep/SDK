# Telestore SDK (JavaScript)

## Authorization

### Obtaining a new session

```ts
// First parameter - your user key from https://web.tele.store
// Second parameter - development mode, true or false
var teleStoreClient = new TeleStoreClient(<YOUR_USER_KEY>, true); 

const isConnected: boolean = teleStoreClient.Connect();
```

## Wallet usage

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
      throw; // Your error handling
  }

  return respose.result.url;
}

// result example
// https://web.tele.store/shop?invoice=ISDW2JF3AFSTP&redirect=true
const navigateUrl = await getNewInvoiceLink(20, <YOUR_USER_ID>, <BOUGHT_ITEM_INFO>);
```

Navigate user to **link** from received object

### Invoice payment monitoring example

```ts
const handleInvoiceFunction = async (invoice: HistoryTransaction) => {
  console.log(invoice);
}

const lastProcessedId: string | null = null; /* Last proccessed by your app invoice */

const isSuccess = teleStoreClient.StartMonitoring({
  handleInvoiceUpdate: handleInvoiceFunction,
}, lastProcessedId);
```

### Сreate new invoices after successfully start of monitoring service

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
