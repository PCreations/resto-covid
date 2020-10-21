import { useState, useEffect } from "react";

export const createUseRestaurant = ({
  restaurantRepository,
  restaurantId = "",
  captureException = () => {},
}) =>
  function useRestaurant() {
    const [restaurant, setRestaurant] = useState();
    const [error, setError] = useState(null);

    const handleError = (error) => {
      setError(true);
      captureException(error);
    };

    useEffect(() => {
      restaurantRepository
        .get({ restaurantId })
        .then(setRestaurant, handleError);
    }, [setRestaurant, setError]);

    return {
      restaurant,
      error,
      loading: !restaurant,
    };
  };
