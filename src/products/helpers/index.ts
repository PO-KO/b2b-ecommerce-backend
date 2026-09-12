import { PRICE_UNIT } from '../../constants/roles.constants.js';

export const priceToCents = (price: number) => {
  return price * PRICE_UNIT;
};

export const centsToPrice = (price: number) => {
  return price / PRICE_UNIT;
};
