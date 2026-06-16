const TronWeb = require("tronweb");
const Web3 = require("web3");
const BigNumber = require("bignumber.js");

function contract_decimals(input = null) {
    let output = {
        6: "picoether",
        8: "customeight",
        9: "nanoether",
        12: "microether",
        15: "milliether",
        18: "ether",
        21: "kether",
        24: "mether",
        27: "gether",
        30: "tether",
    };
    if (input == null) {
        return output;
    } else {
        let result = "ether";
        if (output[input]) {
            result = output[input];
        }
        return result;
    }
}

function customDecimal(input) {
    let k = "";
    for (j = 1; j <= input; j++) {
        k = k + "0";
    }
    return 1 + k;
}

function customFromWei(amount, decimal) {
    // return convertCoinAmountFromInt(amount, decimal);
    let convertAmount;

    if (BigInt(amount) > BigInt("9007199254740991")) {
        // If amount is larger than JavaScript's safe integer limit, use BigInt for division
        let bigAmount = BigInt(amount);
        let divisor = BigInt(powerOfTen(Number(decimal)));

        // Perform division and extract integer & decimal parts manually
        let integerPart = bigAmount / divisor;
        let decimalPart = bigAmount % divisor; // Get remainder for decimal calculation

        // Convert decimal part to correct precision
        let decimalString = decimalPart.toString().padStart(Number(decimal), "0"); // Ensure correct padding

        // Remove unnecessary trailing zeros
        decimalString = decimalString.replace(/0+$/, "");

        // Combine integer and decimal part
        convertAmount = decimalString ? `${integerPart}.${decimalString}` : `${integerPart}`;
    } else {
        // For smaller numbers, use precise floating-point division
        convertAmount = (Number(amount) / powerOfTen(Number(decimal))).toFixed(decimal);
    }

    return String(convertAmount);
}

function customToWeiOld(amount, decimal) {
    // return (amount*powerOfTen(decimal)).toString()
    const isDecimal = !Number.isInteger(amount);
    if (isDecimal) {
        const tokenDecimals = new BigNumber(10).pow(decimal);
        // const tokenToSend = new BigNumber(amount).times(tokenDecimals);

        const tokenAmount = amount * tokenDecimals;
        const tokenAmountLocalAmount = tokenAmount.toLocaleString().replaceAll(",", "");
        const tokenAmountLength = tokenAmountLocalAmount.length;
        const tokenToSend = tokenAmount.toPrecision(tokenAmountLength);

        return tokenToSend.toString();
    } else {
        const amountData = Web3.utils.toBN(amount).mul(Web3.utils.toBN(10).pow(Web3.utils.toBN(decimal)));

        return amountData.toString();
    }
}

function customToWei(amount, decimal) {
    const tokenDecimals = Number(new BigNumber(10).pow(decimal));
    const tokenAmount = Number(amount) * tokenDecimals;

    return tokenAmount["noExponents"]();
}
function powerOfTen(x) {
    return Math.pow(10, Number(x));
}

function tronApiUrl(input = "") {
    const network = [
        "https://api.trongrid.io",
        "https://api.tronstack.io",
        "https://api.shasta.trongrid.io",
        "https://api.nileex.io",
        "https://nile.trongrid.io",
    ];

    let hasNetwork = network.includes(input.replace(/[/]$/g, ""));

    if (input && hasNetwork) {
        return true;
    }
    if (input && !hasNetwork) {
        return false;
    }
    return network;
}

function tronWebCall(req, res) {
    const rpcUrl = req.headers.chainlinks;
    const tronWeb = tronApiUrl(rpcUrl)
        ? new TronWeb({
              fullHost: rpcUrl,
              headers: {
                  "TRON-PRO-API-KEY": req.headers?.tron_grid_api_key ?? "",
              },
          })
        : new TronWeb({
              fullHost: rpcUrl,
          });
    return tronWeb;
}

async function checkTx(tronWeb, txId) {
    return true;
    let txObj = await fetchTx(tronWeb, txId);
    if (txObj.hasOwnProperty("Error")) throw Error(txObj.Error);
    while (!txObj.hasOwnProperty("receipt")) {
        await new Promise((resolve) => setTimeout(resolve, 45000)); //sleep in miliseconds
        txObj = await fetchTx(txId);
    }
    if (txObj.receipt.result == "SUCCESS") return true;
    else return false;
}

async function fetchTx(tronWeb, txId) {
    return await tronWeb.trx.getTransactionInfo(txId);
}
async function gasLimit(network) {
    const web3 = new Web3(network);
    const latestBlock = await web3.eth.getBlock("latest");

    let blockGasUsed = latestBlock.gasUsed;
    blockGasUsed = 100000;
    return blockGasUsed;
}

Number.prototype["noExponents"] = function () {
    const data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    let z = "";
    const sign = this < 0 ? "-" : "";
    const str = data[0].replace(".", "");
    let mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + "0.";
        while (mag++) z += "0";
        return z + str.replace(/^\-/, "");
    }
    mag -= str.length;
    while (mag--) z += "0";
    return str + z;
};

function responseData(status, message = "", data = {}) {
    message = !status && (!message || message.trim() === "") ? "Something went wrong! Please try again later" : message;
    return { status: status, message: message, data: data };
}

module.exports = {
    tronWebCall,
    contract_decimals,
    customDecimal,
    customFromWei,
    customToWei,
    powerOfTen,
    checkTx,
    gasLimit,
    tronApiUrl,
    responseData,
};
