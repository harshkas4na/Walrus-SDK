declare const _default: {
    uploadFile: (publisherUrl: string, file: any, epochs?: number) => Promise<Response>;
    uploadWithEncryption: (publisherUrl: string, file: any, epochs: number | undefined, password: string) => Promise<any>;
};
export default _default;
