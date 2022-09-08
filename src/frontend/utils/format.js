import { ethers } from 'ethers';
//
// export const convertFromWei = (amount, digits = 1) => {
//   if (!amount) {
//     amount = 0;
//   }
//   return (+ethers.utils.formatEther(amount.toString())).toFixed(digits);
// };
//
// export const convertToWei = (amount) => {
//   return ethers.utils.parseEther(amount.toString());
// };
//
// export const shortAccount = (address) => {
//   return address.slice(0, 5) + '...' + address.slice(36, 42);
// }
//
// export const shortTx = (address) => {
//   return address.slice(0, 7) + '...' + address.slice(35, 42);
// }

export const isContractAddress = (address) => {
  return !/^0x0+$/.test(address);
}
