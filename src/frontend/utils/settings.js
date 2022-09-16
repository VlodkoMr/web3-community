import { chain } from 'wagmi';

export const communityTypes = [
  "Animals",
  "Art",
  "Brand",
  "Business",
  "Education",
  "Environment",
  "Fashion",
  "Food",
  "Gaming",
  "Health",
  "Infrastructure",
  "Literature",
  "Music",
  "Photography",
  "Science",
  "Social",
  "Sports",
  "Technology",
  "Virtual Worlds",
  "Other"
];

export const getTokenName = (currentChain) => {
  let token = "ETH";
  switch (currentChain.id) {
    case chain.polygon.id:
    case chain.polygonMumbai.id:
      token = "MATIC";
      break;
    case chain.localhost.id:
    case chain.hardhat.id:
      token = "MATIC";
      break;
  }

  return token;
}
