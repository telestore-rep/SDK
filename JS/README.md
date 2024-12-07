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

const isConnected = teleStoreClient.Connect();
```

After that, you can use other requests.

## Wallet usage

### Create invoice

```ts
var response = await teleStoreClient.Wallet.CreateTransactionCode({
      amount: 10,
      currency: "USDT",
      timeLimit: true,
      typeTx: CodeTypeEnum.InvoiceTx,
      externalID: <YOUR_APP_ID>,
      partnerInfo: <YOUR_USER_ID>,
      tag: <YOUR_INFO>
    });

if (response.error) {
    throw; // Your error handling
}

var codeInfo = response.result;
```

### Get transaction history

```ts
var response = await teleStoreClient.Wallet.GetTransactionHistory();

if (response.error) {
    throw; // Your error handling
}

var transactions = response.result;
```
