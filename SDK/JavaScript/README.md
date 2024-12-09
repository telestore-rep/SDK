# Telestore SDK (JavaScript)

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

## Authorization

### Obtaining a new session

The `signInUserKey` function is used to obtain the cookie:

```ts
var teleStoreClient = new TeleStoreClient(<YOUR_USER_KEY>);

const isConnected: boolean = teleStoreClient.Connect();
```

After that, you can use other requests.

## Wallet usage

### Creating invoice for user example

```ts
const getNewInvoiceLink = async (amount: number, partnerInfo: number, tag: string) => {
  const response = await teleStoreClient.CreateInvoice({
    amount: amount,
    currency: "TeleUSD",
    externalID: <YOUR_APP_ID>,
    partnerInfo: partnerInfo,
    tag: tag
  });

  if (response.error || !response.result) {
      throw; // Your error handling
  }
  
  return respose.result.url;
}

const navigateUrl = await getNewInvoiceLink(20, <YOUR_USER_ID>, <BOUGHT_ITEM_INFO>);
```

Then, you need to navigate user to **link** from received object

### Invoice payment monitoring example

You need to create function, which will be process paid by user invoices and insert it into `Subscribe` function

```ts
const handleInvoiceFunction = async (invoice: HistoryTransaction) => {
  /* Your invoice handler code */
}

const lastProcessedId: string | null = null; /* Last proccessed by your app invoice */

const isSuccess = teleStoreClient.StartMonitoring({
  handleInvoiceUpdate: handleInvoiceFunction,
}, lastProcessedId);
```

### Attention: You should create new invoices only after successfully start of monitoring service

To stop monitoring service, simply use `StopMonitoring` function:

```ts
const isSuccess = teleStoreClient.StopMonitoring();
```
