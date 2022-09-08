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

export const FormatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
}
