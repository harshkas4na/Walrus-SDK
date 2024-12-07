export default {
  getFile: async (aggregatorUrl: string, blobId: string) => {
    const url = `${aggregatorUrl}/v1/${blobId}`;

    const response = await fetch(url);

    return response;
  },
};
