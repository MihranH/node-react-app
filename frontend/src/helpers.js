// eslint-disable-next-line import/prefer-default-export
export const getBase64 = (file) => {
  const result = new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      res(reader.result);
    };
    reader.onerror = (error) => {
      rej(error);
    };
  });
  return result;
};
