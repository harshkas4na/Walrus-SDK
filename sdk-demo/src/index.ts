import get from "./getFile/getFile";
import upload from "./uploadFile/uploadFile";
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
}

module.exports = StorageSDK;
