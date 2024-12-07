import crypto from "crypto";
import get from "./getFile/getFile";
import upload from "./uploadFile/uploadFile";
import { File } from "formdata-node";

interface StorageConfig {
  publisherUrl?: string;
  aggregatorUrl?: string;
}

class StorageSDK {
  private publisherUrl: string;
  private aggregatorUrl: string;

  constructor(config: StorageConfig = {}) {
    this.publisherUrl =
      config.publisherUrl ?? "https://publisher.walrus-testnet.walrus.space";
    this.aggregatorUrl =
      config.aggregatorUrl ?? "https://aggregator.walrus-testnet.walrus.space";
  }

  async storeFile(file: File, epochs: number = 5): Promise<any> {
    try {
      const response = await upload.uploadFile(this.publisherUrl, file, epochs);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Upload error: ${error.message}`);
    }
  }

  async readFile(blobId: string): Promise<ReadableStream<Uint8Array>> {
    try {
      const response = await get.getFile(this.aggregatorUrl, blobId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.body!;
    } catch (error: any) {
      throw new Error(`Read error: ${error.message}`);
    }
  }

  async encryptAndStoreFile(file: File, password: string, epochs: number = 5): Promise<any> {
    try {
      const key = crypto.createHash("sha256").update(password).digest();
      const iv = crypto.randomBytes(16); // Initialization vector
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

      // Encrypt file content
      const encryptedChunks: Buffer[] = [];
      encryptedChunks.push(Buffer.concat([cipher.update(Buffer.from(await file.arrayBuffer())), cipher.final()]));
      const encryptedFile = Buffer.concat(encryptedChunks);

      // Create a file object with the encrypted content
      const encryptedFileObj = new File([encryptedFile, iv], file.name, { type: "application/octet-stream" });

      // Store the encrypted file
      const response = await this.storeFile(encryptedFileObj, epochs);

      return response;
    } catch (error: any) {
      throw new Error(`Encryption and storage error: ${error.message}`);
    }
  }

  async readAndDecryptFile(blobId: string, password: string): Promise<string> {
    const key = crypto.createHash("sha256").update(password).digest();
  
    // Retrieve the encrypted file
    const fileStream = await this.readFile(blobId);
  
    // Convert ReadableStream to async iterable
    const reader = fileStream.getReader();
    const chunks: Uint8Array[] = [];
  
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } catch (error: any) {
      throw new Error(`Error reading stream: ${error.message}`);
    }
  
    const encryptedData = Buffer.concat(chunks);
  
    // Extract IV and encrypted content
    const iv = encryptedData.slice(encryptedData.length - 16);
    const encryptedContent = encryptedData.slice(0, encryptedData.length - 16);
  
    // Decrypt content
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decryptedChunks = [
      decipher.update(encryptedContent),
      decipher.final(),
    ];
    const decryptedContent = Buffer.concat(decryptedChunks).toString("utf-8");
  
    return decryptedContent;
  }
}

module.exports = StorageSDK;
