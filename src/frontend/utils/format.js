import { ethers } from 'ethers';
import { formatUnits } from '@ethersproject/units/src.ts/index';

export const convertFromWei = (amount, digits = 1) => {
  if (!amount) {
    amount = 0;
  }
  return (+ethers.utils.formatEther(amount.toString())).toFixed(digits);
};

export const convertToWei = (amount) => {
  return ethers.utils.parseEther(amount.toString());
};

export const shortAccount = (address) => {
  return address.slice(0, 5) + '...' + address.slice(36, 42);
}

export const shortTx = (address) => {
  return address.slice(0, 7) + '...' + address.slice(35, 42);
}

export const transformDonate = (donateInfo, tokensList) => {
  const currencyDecimals = tokensList[parseInt(donateInfo.tokenId)].decimals;
  return {
    amount: (+ethers.utils.formatUnits(donateInfo.amount.toString(), currencyDecimals)).toFixed(2),
    investor: donateInfo.investor,
    isWithdrawn: donateInfo.isWithdrawn,
    timestamp: parseInt(donateInfo.timestamp),
    withdrawTimestamp: parseInt(donateInfo.withdrawTimestamp),
    tokenId: parseInt(donateInfo.tokenId),
    volunteerId: donateInfo.volunteerId,
  };
}

export const transformReport = (reportInfo) => {
  return {
    text: reportInfo.text,
    timestamp: parseInt(reportInfo.timestamp),
    exist: parseInt(reportInfo.timestamp) > 0,
    media: reportInfo.mediaUrl
  };
}
