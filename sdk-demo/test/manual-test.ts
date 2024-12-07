import { File } from "formdata-node";
const StorageSDK = require("../src/index");

const main = async () => {
  const sdk = new StorageSDK();
  const file = new File(["Hello, Walrus!"], "test.txt", { type: "text/plain" });
  const password = "strong-password";

  console.log("Initialized SDK:", sdk);

  let blobId: string | undefined;

  // Upload Testing
  try {
    const uploadResponse = await sdk.storeFile(file, 5);
    console.log("Upload response:", uploadResponse);

    // Extract blobId from the nested response
    blobId = uploadResponse?.alreadyCertified?.blobId;
    if (!blobId) {
      throw new Error("Upload response does not contain a valid blobId.");
    }
  } catch (error) {
    console.error("Error during file upload:", error);
    return;
  }

  // Download Testing
  try {
    if (!blobId) {
      throw new Error("No blobId available for download test.");
    }

    const fileStream = await sdk.readFile(blobId);
    console.log("Download successful, file stream received.");

    // Optional: Convert the stream to a string for verification
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileStream) {
      chunks.push(chunk);
    }
    const downloadedFileContent = Buffer.concat(chunks).toString("utf-8");
    console.log("Downloaded file content:", downloadedFileContent);
  } catch (error) {
    console.error("Error during file download:", error);
  }

  try {
    // Encrypt and Store File
    const uploadResponse = await sdk.encryptAndStoreFile(file, password);
    console.log("Encrypted Upload Response:", uploadResponse);

    // Extract blobId from response
    const blobId = uploadResponse?.alreadyCertified?.blobId;

    // Read and Decrypt File
    if (blobId) {
      const decryptedContent = await sdk.readAndDecryptFile(blobId, password);
      console.log("Decrypted File Content:", decryptedContent);
    } else {
      console.error("No blobId found in upload response.");
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
};

main();
