const constants = require("@openzeppelin/test-helpers/src/constants");
const axios = require("axios");
require("dotenv").config();


const userZapIn = async ({
  toWhomToIssue,
  sellToken,
  sellAmount,
  poolAddress,
  protocol,
}) => {
  return await getZapInData({
    ownerAddress: toWhomToIssue,
    sellToken,
    sellAmount,
    poolAddress,
    protocol,
  }).then((data) => {
    return {
      ...data,
      gas: "6000000",
    };
  });
};

const getZapInData = async ({
  ownerAddress,
  sellToken,
  sellAmount,
  poolAddress,
  protocol,
  affiliateAddress = constants.ZERO_ADDRESS,
}) => {
  const params = {
    api_key: process.env.ZAPPER_API_KEY,
    ownerAddress,
    sellAmount: sellAmount.toString(),
    sellTokenAddress: sellToken,
    poolAddress: poolAddress.toLowerCase(),
    affiliateAddress,
    gasPrice: "250000000000",
    slippagePercentage: "0.05",
    skipGasEstimate: true,
  };

  const data = await axios
    .get(`http://api.zapper.fi/v1/zap-in/${protocol}/transaction`, { params })
    .then((r) => {
      return r.data;
    })
    .catch((error) => {
      console.log(error.response.data);
    });

  return data;
};

module.exports = {
  getZapInData,
  userZapIn,
};
