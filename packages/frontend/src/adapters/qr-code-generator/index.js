import QRCode from "qrcode";

export const createQRCodeGenerator = () => ({
  async generate({ restaurantId }) {
    return new Promise((resolve) => {
      QRCode.toDataURL(
        `${process.env.REACT_APP_BASE_URL}/form/${restaurantId}`,
        (err, dataURL) => resolve(dataURL)
      );
    });
  },
});
