const TronWeb = require("tronweb");
const { responseData } = require("../helpers/helper");
class Trc20Service {
    constructor(rpc) {
        this.tronWeb = new TronWeb({ fullHost: rpc });
    }

    async getNetworkId() {
        const nodeInfo = await this.tronWeb.trx.getNodeInfo();
        const response = Number(nodeInfo?.configNodeInfo?.p2pVersion);

        return responseData(true, "Success", { chainId: response });
    }
}

module.exports = {
    Trc20Service,
};
