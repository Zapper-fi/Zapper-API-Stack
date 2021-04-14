require("dotenv").config();

module.exports = {
  accounts: {
    amount: 20, // Number of unlocked accounts
    ether: 1e6,
  },

  node: {
    fork: process.env.NODE_URL,
    
  },
};
