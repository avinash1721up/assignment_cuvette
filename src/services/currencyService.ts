import axios from "axios";

const BASE_URL = `https://v6.exchangerate-api.com/v6/b0aef8d76f0e63cbd465ecd6/latest/INR`;

export const fetchCurrencyData = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.conversion_rates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
