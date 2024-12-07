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
};
