import CryptoJS from "crypto-js";
export default {
  uploadFile: async (publisherUrl: string, file: any, epochs: number = 5) => {
    const url = `${publisherUrl}/v1/store?epochs=${epochs}`;

    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    return response;
  },

  uploadWithEncryption: async (
    publisherUrl: string,
    file: any,
    epochs: number = 5,
    password: string
  ) => {
    // Derive a key using SHA-256
    const key = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    const fileContent = await readFileAsArrayBuffer(file);
    const wordArray = CryptoJS.lib.WordArray.create(
      new Uint8Array(fileContent)
    );
    const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

    // Upload encrypted file
    const encryptedBytes = new Uint8Array(
      atob(encrypted)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    const blob = new Blob([encryptedBytes], {
      type: "application/octet-stream",
    });

    const response = await fetch(`${publisherUrl}/v1/store?epochs=5`, {
      method: "PUT",
      body: blob,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();

    return result;
  },
};

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};
