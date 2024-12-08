# Walrus-SDK

## What is Walrus-SDK?

Walrus-SDK is a TypeScript-based Software Development Kit (SDK) designed to simplify interaction with the Walrus decentralized storage network. It provides developers with an easy-to-use interface for uploading, retrieving, and managing files within decentralized environments.

By abstracting complex API calls, Walrus-SDK accelerates development, enhances consistency, and promotes the adoption of Walrus decentralized storage solution.

---

## What is Walrus?

Walrus is a decentralized storage and data availability protocol designed for large binary files, or blobs. It offers a robust solution for storing unstructured content across decentralized nodes, ensuring high availability and reliability even in the presence of faults. By integrating with the Sui blockchain, Walrus leverages its composability, expressivity, and security to provide a seamless storage experience.

For more information, visit the [Walrus website](https://www.walrus.xyz/) and consult the [Walrus documentation](https://docs.walrus.host/).

---

## Install the SDK

Install using npm:

```bash
npm i walrus-sdk
```

## Import the SDK

```javascript
const StorageSDK = require("walrus-sdk");
```

## Initialize the SDK

```javascript
const sdk = new StorageSDK({
  publisherUrl: "https://your-custom-publisher-url",
  aggregatorUrl: "https://your-custom-aggregator-url",
});
```

Both publisherUrl and aggregatorUrl are optional and default to the Walrus testnet URLs.

## ## Available Functions

### `storeFile(file: File, epochs: number = 5): Promise<any>`

Uploads a file to the Walrus network.

**Parameters**:

- `file` (File): The file to be uploaded.
- `epochs` (number): The number of epochs to store the file for. Default is 5.

**Returns**:

- A Promise resolving to the upload response.

**Example**:

```javascript
const file = new File(["Hello, Walrus!"], "test.txt", { type: "text/plain" });
const response = await sdk.storeFile(file, 10);
console.log(response);
```

### `storeFileWithEncryption(file: File, epochs: number = 5, password: string): Promise<any>`

Encrypts and uploads a file to the Walrus network.

**Parameters**:

- `file` (File): The file to be encrypted and uploaded.
- `epochs` (number): The number of epochs to store the file for. Default is 5.
- `password` (string): The password used for encryption.

**Returns**:

- A Promise resolving to the upload response.

**Example**:

```javascript
const password = "secure-password";
const response = await sdk.storeFileWithEncryption(file, 10, password);
console.log(response);
```

### `readFile(blobId: string): Promise<ReadableStream<Uint8Array>>`

Retrieves a file from the Walrus network.

**Parameters**:

- `blobId` (string): The ID of the file to retrieve.

**Returns**:

- A Promise resolving to a `ReadableStream` of the file content.

**Example**:

```javascript
const blobId = "your-blob-id";
const fileStream = await sdk.readFile(blobId);
console.log(fileStream);
```

### `readFileWithDecryption(blobId: string, password: string): Promise<Blob>`

Retrieves and decrypts a file from the Walrus network.

**Parameters**:

- `blobId` (string): The ID of the file to retrieve.
- `password` (string): The password used for decryption.

**Returns**:

- A Promise resolving to a `Blob` of the decrypted file content.

**Example**:

```javascript
const password = "secure-password";
const decryptedBlob = await sdk.readFileWithDecryption(blobId, password);

// Optional: Convert Blob content to string
const text = await decryptedBlob.text();
console.log(text);
```

## Error Handling

All methods throw errors if the operation fails, including:

- **HTTP Errors**: Issues with network or server response.
- **Encryption/Decryption Errors**: Invalid passwords or corrupted data.

Wrap calls in `try...catch` to handle errors gracefully:

```javascript
try {
  const response = await sdk.readFileWithDecryption(blobId, password);
  console.log(response);
} catch (error) {
  console.error("Error:", error.message);
}
```
