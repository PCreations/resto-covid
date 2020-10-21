import { renderHook } from "@testing-library/react-hooks";
import { createInMemoryRestaurantRepository } from "../../adapters/restaurant-repository";
import { createUseRestaurant } from "../use-restaurant";

describe("useRestaurant", () => {
  it("should first return that the restaurant is loading and there is no error", () => {
    const restaurantRepository = createInMemoryRestaurantRepository();
    const useRestaurant = createUseRestaurant({ restaurantRepository });
    const { result } = renderHook(useRestaurant);

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("eventually returns the restaurant", async () => {
    const restaurant = { id: "restaurant-id", name: "restaurant name" };
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurant.id]: restaurant,
    });
    const useRestaurant = createUseRestaurant({
      restaurantRepository,
      restaurantId: restaurant.id,
    });
    const { result, waitForValueToChange } = renderHook(useRestaurant);

    await waitForValueToChange(() => result.current.restaurant);

    expect(result.current.restaurant).toEqual(restaurant);
  });

  it("indicates there was an error retrieving the restaurant if an error occured and capture the exception", async () => {
    const restaurant = { id: "restaurant-id", name: "restaurant name" };
    const notFoundError = new Error();
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurant.id]: restaurant,
      notFoundErrorToBeThrown: notFoundError,
    });
    const captureException = jest.fn();
    const useRestaurant = createUseRestaurant({
      restaurantRepository,
      restaurantId: "not-existing-id",
      captureException,
    });
    const { result, waitForValueToChange } = renderHook(useRestaurant);

    await waitForValueToChange(() => result.current.error);

    expect(result.current.error).toEqual(true);
    expect(captureException).toHaveBeenCalledWith(notFoundError);
  });
});
