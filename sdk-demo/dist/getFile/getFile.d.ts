declare const _default: {
    getFile: (aggregatorUrl: string, blobId: string) => Promise<Response>;
    getFileWithDecryption: (aggregatorUrl: string, blobId: string, password: string) => Promise<Blob>;
};
export default _default;
