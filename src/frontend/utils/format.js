import { ethers } from 'ethers';

export const convertFromEther = (amount, digits = 1) => {
  if (!amount) {
    amount = 0;
  }
  return (+ethers.utils.formatEther(amount.toString())).toFixed(digits);
};

export const convertToEther = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};

export const isContractAddress = (address) => {
  return !/^0x0+$/.test(address);
}

export const shortAddress = (address) => {
  return address.slice(0, 5) + '...' + address.slice(38, 42);
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
}

export const mediaURL = (uri) => {
  return `https://ipfs.io/ipfs/${uri}`;
}

export const formatPrice = (price) => {
  const checkPrice = +ethers.utils.formatEther(price.toString());
  if (checkPrice < 1) {
    return convertFromEther(price, 4);
  } else if (checkPrice < 10) {
    return convertFromEther(price, 2);
  } else {
    return convertFromEther(price, 1);
  }
}

export const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat().format(date);
}
