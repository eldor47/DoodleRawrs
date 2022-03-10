const SmartContract = artifacts.require("DoodleRawrs");

module.exports = function (deployer) {
  deployer.deploy(SmartContract, "DoodleRawrs", "DRAWR", "https://");
};
