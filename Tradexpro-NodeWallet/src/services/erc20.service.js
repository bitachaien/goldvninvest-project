const Web3 = require("web3");
const { responseData } = require("../helpers/helper");

class Erc20Service {
    constructor(rpc) {
        this.web3 = new Web3(rpc);
    }

    async getNetworkId() {
        const response = Number(await this.web3.eth.getChainId());

        return responseData(true, "Success", { chainId: response });
    }
}

module.exports = {
    Erc20Service,
};
