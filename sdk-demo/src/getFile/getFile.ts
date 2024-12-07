import CryptoJS from "crypto-js";

export default {
  getFile: async (aggregatorUrl: string, blobId: string) => {
    const url = `${aggregatorUrl}/v1/${blobId}`;

    const response = await fetch(url);

    return response;
  },

  getFileWithDecryption: async (
    aggregatorUrl: string,
    blobId: string,
    password: string
  ) => {
    const url = `${aggregatorUrl}/v1/${blobId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    // Process downloaded file
    const encryptedData = await response.arrayBuffer();
    const encryptedBase64 = await arrayBufferToBase64(encryptedData);

    // Decrypt file
    const key = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex); // Using fixed key for decryption
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key);

    // Process decryption in chunks
    const decryptedBytes = new Uint8Array(decrypted.sigBytes);
    const words = decrypted.words;

    for (let i = 0; i < decrypted.sigBytes; i += PROCESSING_CHUNK_SIZE) {
      const end = Math.min(i + PROCESSING_CHUNK_SIZE, decrypted.sigBytes);
      for (let j = i; j < end; j++) {
        decryptedBytes[j] = (words[j >>> 2] >>> (24 - (j % 4) * 8)) & 0xff;
      }
    }

    // Download decrypted file
    const mimeType = detectFileType(decryptedBytes);
    const blob = new Blob([decryptedBytes], { type: mimeType });

    return blob;
  },
};

const UPLOAD_CHUNK_SIZE = 64 * 1024;
const PROCESSING_CHUNK_SIZE = 32 * 1024;

const arrayBufferToBase64 = async (buffer: any) => {
  const chunks = chunkArrayBuffer(buffer, PROCESSING_CHUNK_SIZE);
  let base64 = "";

  for (let i = 0; i < chunks.length; i++) {
    const chunk = new Uint8Array(chunks[i]);
    const chunkStr = String.fromCharCode.apply(null, chunk as any);
    base64 += btoa(chunkStr);
  }

  return base64;
};

const chunkArrayBuffer = (arrayBuffer: ArrayBuffer, chunkSize: number) => {
  const chunks = [];
  const totalChunks = Math.ceil(arrayBuffer.byteLength / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, arrayBuffer.byteLength);
    chunks.push(arrayBuffer.slice(start, end));
  }

  return chunks;
};

const detectFileType = (bytes: any) => {
  if (!bytes || !bytes.length) {
    return "application/octet-stream";
  }

  try {
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return "image/jpeg";
    }
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return "image/png";
    }
    if (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46
    ) {
      return "application/pdf";
    }

    // Check if it might be a text file
    const isText = bytes.every(
      (byte: any) =>
        (byte >= 32 && byte <= 126) || // ASCII printable characters
        byte === 9 || // tab
        byte === 10 || // newline
        byte === 13 // carriage return
    );

    if (isText) {
      return "text/plain";
    }

    return "application/octet-stream";
  } catch (error) {
    console.error("Error detecting file type:", error);
    return "application/octet-stream";
  }
};
