export const createSignUp = ({
  authenticationGateway,
  restaurantRepository,
  qrCodeGenerator,
}) => async ({ restaurantName, email, password, address, postalCode, city }) =>
  new Promise(async (resolve, reject) => {
    try {
      const restaurantId = await authenticationGateway.createRestaurantUser({
        restaurantName,
        email,
        password,
      });
      const qrCode = await qrCodeGenerator.generate({ restaurantId });
      const restaurant = {
        id: restaurantId,
        name: restaurantName,
        qrCode,
        address,
        postalCode,
        city,
      };
      await restaurantRepository.save(restaurant);
      resolve(restaurant);
    } catch (err) {
      reject(err);
    }
  });
