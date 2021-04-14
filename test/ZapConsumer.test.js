const { accounts, contract, web3 } = require("@openzeppelin/test-environment");
const { expect } = require("chai");
const { BN, ether, constants } = require("@openzeppelin/test-helpers");

const tokenTransfers = require("truffle-token-test-utils");
tokenTransfers.setWeb3(web3);

const { getZapInData, userZapIn, toDecimal } = require("../api/ZapperAPI");

const IERC20 = contract.fromArtifact("IERC20");
const ZapConsumer = contract.fromArtifact("Zap_Consumer_V1");

describe("Zap Consumer", () => {
  const admin = accounts[0];
  const toWhomToIssue = accounts[1];

  const Sushiswap_DAI_WETH = "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f"; //DAI & WETH

  const Curve_alUSD = "0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c";

  before(async () => {
    this.zapConsumer = await ZapConsumer.new({ from: admin });
  });
  context.only("With Web3", () => {
    it("Should add liquidity to Sushiswap DAI/WETH pool with ETH", async () => {
      const data = await userZapIn({
        toWhomToIssue,
        sellToken: constants.ZERO_ADDRESS,
        sellAmount: ether("1"),
        poolAddress: Sushiswap_DAI_WETH,
        protocol: "sushiswap",
      });

      console.log({ ZapperApiData: data });

      const tokenInstance = await IERC20.at(Sushiswap_DAI_WETH);

      const initialBalance = await tokenInstance.balanceOf(toWhomToIssue);
      console.log({ initialBalance: initialBalance.toString() / 10 ** 18 });

      await web3.eth.sendTransaction(data);

      const finalBalance = await tokenInstance.balanceOf(toWhomToIssue);
      console.log({ finalBalance: finalBalance.toString() / 10 ** 18 });

      expect(finalBalance).to.be.bignumber.gt(initialBalance);
    });
  });
  context.only("With a Smart Contract", () => {
    it("Should add liquidity Curve alUSD ", async () => {
      // Assemble sETH Curve pool Zap In with USDC
      const data = await getZapInData({
        ownerAddress: this.zapConsumer.address,
        sellToken: constants.ZERO_ADDRESS,
        sellAmount: ether("1"),
        poolAddress: Curve_alUSD,
        protocol: "curve",
      });

      console.log({ ZapperApiData: data });

      tokenInstance = await IERC20.at(Curve_alUSD);

      const initialBalance = await tokenInstance.balanceOf(toWhomToIssue);
      console.log({ initialBalance: initialBalance.toString() / 10 ** 18 });


      const tx = await this.zapConsumer.Zap(
        data.sellTokenAddress,
        data.value,
        data.buyTokenAddress,
        data.to,
        data.data,
        { from: toWhomToIssue, value: ether("1") }
      );

      const finalBalance = await tokenInstance.balanceOf(toWhomToIssue);
      console.log({ finalBalance: finalBalance.toString() / 10 ** 18 });

      expect(finalBalance).to.be.bignumber.gt(initialBalance);
    });
  });
});
