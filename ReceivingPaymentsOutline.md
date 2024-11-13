*v0.3, 2024-11-11*

The document outlines the process of receiving the payment from player.
### Authenticate to send API calls
First the project needs to authenticate.
The details of the process will be available separately.
### Create the invoice
Next the project needs to create the invoice. The invoice can be created in a form of a transaction code — the alphanumeric sequence encapsulating the details of the transaction.
```json
https://telestore.itbuild.app:8081/trex/v1/create_tx_code
```
In the response the project gets an alphanumeric sequence like this one:
```json
P77DOZF3ZK5IZ
```
This code encapsulates the details of the transaction and the project can save the data of the transaction along with any important information about a purchase, for example, internal player's ID and item ID that is being purchased.

The project can gather more data about the transaction with this API call:
```json
https://telestore.itbuild.app:8081/trex/v1/code_tx_info?code=P77DOZF3ZK5IZ
```
### Send the invoice (code)
The project then needs to send the code to the player so the player could apply the code and pay the invoice.

That can be done, for example, in a form of a link to a Telegram-bot:
```sh
https://t.me/Telestoregamebot?start=P77DOZF3ZK5IZ
```
or the direct link to a Telestore-wallet (the actual path is TBD):
```json
https://telestore.itbuild.app:8081?apply_code=P77DOZF3ZK5IZ
```
The player follows that link without leaving the Telestore platform and can pay the invoice.
### Check the invoice

The project can check the state of the invoice by examining the list of all pending invoices:
```json
https://telestore.itbuild.app:8081/trex/v1/list_tx_codes?currency=TeleUSD
```
or with aforementioned API for an individual code:
```json
https://telestore.itbuild.app:8081/trex/v1/code_tx_info?code=P77DOZF3ZK5IZ
```
### Cancel the invoice
The project can cancel invoice for any number of reasons if the invoice is still pending.

To do that the project calls:
```json
https://telestore.itbuild.app:8081/trex/v1/cancel_code?code=P77DOZF3ZK5IZ
```
The transaction will be cancelled and the synchronous transactional logic within the wallet will make sure that no double spending occurs on either side.
### Check the transaction
Once the invoice is paid the underlying transaction changes the state to `Finished`. The transaction will be available in the history with the call:
```json
https://telestore.itbuild.app:8081/trex/v1/wallet/get_history_transactions?currencies=TeleUSD&tx_types=13&start=2024-11-01&end=2024-11-02
```
The call with these filters will return all the transactions of the `InvoiceTx` type for the currency `TeleUSD` created between 2024-11-01 and 2024-11-02.

To identify the transaction the project examines the `tag` field in a transaction record from `get_history_transactions` which will contain the code (in our example — `P77DOZF3ZK5IZ`).

The following picture illustrates the whole process.

![alt text](https://github.com/telestore1/IntegrationSDK/blob/main/img/payment_rec.png?raw=true)
