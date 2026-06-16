const { publicDecrypt } = require("crypto");
const { response } = require("express");
const Web3 = require("web3");
const { contractJson } = require("../ContractAbiJson");
const { contract_decimals, customFromWei, customToWei, gasLimit, responseData } = require("../helpers/helper");
const trc20Token = require("./TrcTokenController");
const trxToken = require("./TrxController");
const abi = require("web3-eth-abi");
const { TRC20_TOKEN, ERC20_TOKEN } = require("../helpers/coreconstants");
const { Erc20Service } = require("../services/erc20.service");
const { Trc20Service } = require("../services/trc20.service");

// BALANCE_TYPE_BASE_COIN_BALANCE= 1
// BALANCE_TYPE_TOKEN_BALANCE= 2
// BALANCE_TYPE_BOTH_BALANCE= 3

function getData(req, res) {
    let tokenBalance = 100;
    let tokenBalance1 = Web3.utils.fromWei(tokenBalance.toString(), "picoether");
    let tokenBalance2 = Web3.utils.toWei(tokenBalance.toString(), "picoether");
    let dc = customFromWei(tokenBalance, 6);
    let dc2 = customToWei(tokenBalance, 6);
    res.send({
        status: true,
        message: "data successfully",
        data: {
            data: "exapmle data ",
            data0: tokenBalance,
            data1: tokenBalance1,
            data2: tokenBalance2,
            data3: dc,
            data4: dc2,
        },
    });
}

// get token decimal
async function getContractDecimal(contractInstance) {
    const decimal = await contractInstance.methods.decimals().call();
    return decimal;
}
/*{
    address: '0x33B380d0b8B1e5Bc3Efb364FCf4eaEA46834Eb96',
    privateKey: '0x32ddeae1c7302f484e35a53685edab78147a78757bba755d5094497f60307fce',
    signTransaction: [Function: signTransaction],
    sign: [Function: sign],
    encrypt: [Function: encrypt]
}*/

async function generateAddress(req, res) {
    //   console.log('generateAddress', 'start')
    try {
        const network = req.headers.chainlinks;
        const networkType = req.headers.networktype;

        if (network) {
            if (parseInt(networkType) == 6) {
                await trxToken.createAccount(req, res);
            } else {
                const connectWeb3 = new Web3(new Web3.providers.HttpProvider(network));

                let wallet = await connectWeb3.eth.accounts.create();
                if (wallet) {
                    res.json({
                        status: true,
                        message: "Wallet created successfully",
                        data: wallet,
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Wallet not generated",
                        data: {},
                    });
                }
            }
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        console.log("generateAddress ex", e);
        res.json({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

async function getWalletBalance(req, res) {
    try {
        const network = req.headers.chainlinks;
        const networkType = req.headers.networktype;
        let contractJsons = contractJson();
        let tokenDecimal = "";
        if (network) {
            const type = req.body.type;
            const address = req.body.address;
            let netBalance = 0;
            let tokenBalance = 0;

            if (parseInt(networkType) == 6) {
                await trxToken.getTronBalance(req, res);
            } else {
                const web3 = new Web3(network);
                if (type == 1) {
                    netBalance = await web3.eth.getBalance(address);
                    netBalance = Web3.utils.fromWei(netBalance.toString(), "ether");
                } else if (type == 2) {
                    const contractAddress = req.body.contract_address;
                    if (contractAddress) {
                        const contractInstance = new web3.eth.Contract(contractJsons, contractAddress);
                        tokenBalance = await contractInstance.methods.balanceOf(address).call();
                        tokenDecimal = await getContractDecimal(contractInstance);

                        tokenBalance = customFromWei(tokenBalance, tokenDecimal);
                    } else {
                        res.json({
                            status: false,
                            message: "Contract address required",
                            data: {},
                        });
                    }
                } else {
                    const contractAddress = req.body.contract_address;
                    if (contractAddress) {
                        netBalance = await web3.eth.getBalance(address);
                        netBalance = Web3.utils.fromWei(netBalance.toString(), "ether");

                        const contractInstance = new web3.eth.Contract(contractJsons, contractAddress);
                        tokenBalance = await contractInstance.methods.balanceOf(address).call();
                        tokenDecimal = await getContractDecimal(contractInstance);

                        tokenBalance = customFromWei(tokenBalance, tokenDecimal);
                    } else {
                        res.json({
                            status: false,
                            message: "Contract address required",
                            data: {},
                        });
                    }
                }
                const data = {
                    net_balance: netBalance,
                    token_balance: tokenBalance,
                };

                res.send({
                    status: true,
                    message: "process successfully",
                    data: data,
                });
            }
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        console.log("getWalletBalance ex", e);
        res.json({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

// calculate estimate gas fees
async function calculateEstimateGasFees(req, type) {
    console.log("calculateEstimateGasFees", "starting");
    let data = "";
    try {
        const network = req.headers.chainlinks;
        const web3 = new Web3(network);
        let amount = req.body.amount_value;
        let gasPrice = await web3.eth.getGasPrice();

        // gasPrice = Web3.utils.fromWei(gasPrice.toString(), 'gwei');

        const fromAddress = req.body.from_address;
        const receiverAddress = req.body.to_address;
        let usedGasLimit = req.body.gas_limit;
        let gasFees = 0;
        let finalGasFees = 0;

        if (type == 1) {
            const contractAddress = req.body.contract_address;
            let contractJsons = contractJson();
            const contract = new web3.eth.Contract(contractJsons, contractAddress);
            const contractDecimal = await getContractDecimal(contract);

            amount = customToWei(amount, contractDecimal);

            if (Number(usedGasLimit) > 0) {
                // gasFees = Number(usedGasLimit) * Number(gasPrice);
                const multiply = Number(usedGasLimit) * Number(gasPrice);

                const maxFee = customFromWei(Number(usedGasLimit) * Number(gasPrice), 18);
                const feeBalanceRequired = parseFloat(maxFee.toString()).toFixed(18);

                data = {
                    status: true,
                    message: "Calculate gas fees successfully!",
                    amount: amount,
                    tx: "ok",
                    gasLimit: usedGasLimit,
                    gasPrice: gasPrice,
                    estimateGasFees: feeBalanceRequired,
                };
            } else {
                let call = await contract.methods.transfer(receiverAddress, amount);
                const calGas = await call.estimateGas({ from: fromAddress });
                const estimatedFee = customFromWei((calGas, Number(gasPrice)), 18);
                const nowFees = parseFloat(estimatedFee.toString()).toFixed(18);

                data = {
                    status: true,
                    message: "Calculate gas fees successfully!",
                    amount: amount,
                    tx: "ok",
                    gasLimit: usedGasLimit,
                    gasPrice: gasPrice,
                    estimateGasFees: nowFees,
                };
            }
        } else {
            const chainId = req.body.chain_id;

            amount = Web3.utils.toWei(amount.toString(), "ether");
            if (usedGasLimit > 0) {
                gasFees = usedGasLimit * gasPrice;
            } else {
                let transaction = {
                    from: fromAddress,
                    to: receiverAddress,
                    value: amount,
                    chainId: chainId,
                };

                let estimateGas = await web3.eth.estimateGas(transaction);

                usedGasLimit = parseInt(estimateGas / 2) + estimateGas;

                gasFees = usedGasLimit * gasPrice;
            }

            finalGasFees = Web3.utils.fromWei(gasFees.toString(), "gwei");

            data = {
                status: true,
                message: "Calculate gas fees successfully!",
                amount: amount,
                tx: "ok",
                gasLimit: usedGasLimit,
                gasPrice: gasPrice,
                estimateGasFees: finalGasFees,
            };
        }
    } catch (e) {
        console.log("calculateEstimateGasFees ex", e);
        data = {
            status: false,
            message: e.message,
        };
    }

    return data;
}
async function checkEstimateGasFees(req, res) {
    try {
        const network = req.headers.chainlinks;
        let contractJsons = contractJson();
        if (network) {
            const usedGasLimit = req.body.gas_limit;
            const fromAddress = req.body.from_address;
            const contractAddress = req.body.contract_address;
            const receiverAddress = req.body.to_address;

            const data = await calculateEstimateGasFees(req, 1);

            if (data.status) {
                res.json({
                    status: true,
                    message: "Get Estimate gas successfully",
                    data: data,
                });
            } else {
                res.json({
                    status: false,
                    message: "Get Estimate gas failed",
                    data: {},
                });
            }
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        res.json({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

async function sendToken(req, res) {
    console.log("sendToken", "processing");
    try {
        const network = req.headers.chainlinks;
        let contractJsons = contractJson();
        const networkType = req.headers.networktype;
        let decimalValue = 18;
        if (network) {
            if (parseInt(networkType) == 6) {
                trc20Token.sendTrc20Token(req, res);
            } else {
                const fromAddress = req.body.from_address;
                const contractAddress = req.body.contract_address;
                const receiverAddress = req.body.to_address;

                const privateKey = req.body.contracts;
                let amount = req.body.amount_value;

                let checkValidAddress = new Web3().utils.isAddress(receiverAddress);

                if (checkValidAddress) {
                    const web3 = new Web3(network);
                    let gasPrice = await web3.eth.getGasPrice();
                    gasPrice = Web3.utils.fromWei(gasPrice.toString(), "ether");

                    const contract = new web3.eth.Contract(contractJsons, contractAddress);
                    decimalValue = await getContractDecimal(contract);

                    amount = customToWei(amount, decimalValue);

                    tokenBalance = await contract.methods.balanceOf(fromAddress).call();
                    if (!tokenBalance) {
                        return res.json({
                            status: false,
                            message: "Token balance not found",
                            data: {},
                        });
                    }

                    if (!(parseInt(tokenBalance) >= parseInt(amount))) {
                        return res.json({
                            status: false,
                            message: "Token has insufficient balance",
                            data: {},
                        });
                    }

                    const dataGas = await calculateEstimateGasFees(req, 1);
                    if (dataGas.status) {
                        let usedGasLimit = dataGas.gasLimit;

                        try {
                            const tx = {
                                from: fromAddress,
                                to: contractAddress,
                                // gas: Web3.utils.toHex(usedGasLimit),
                                gas: usedGasLimit,
                                data: contract.methods.transfer(receiverAddress, amount).encodeABI(),
                            };
                            const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
                            const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

                            res.json({
                                status: true,
                                message: "Token sent successfully",
                                data: {
                                    hash: receipt.transactionHash,
                                    used_gas: receipt.gasUsed * gasPrice,
                                    tx: receipt,
                                    used_gas_fees: dataGas.estimateGasFees,
                                    used_gas_limit: dataGas.gasLimit,
                                },
                            });
                        } catch (err) {
                            res.json({
                                status: false,
                                message: err.message,
                                data: {
                                    used_gas_fees: dataGas.estimateGasFees,
                                    used_gas_limit: dataGas.gasLimit,
                                },
                            });
                        }
                    } else {
                        res.json(dataGas);
                    }
                } else {
                    res.json({
                        status: false,
                        message: "Invalid address",
                        data: {},
                    });
                }
            }
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        console.log("sendToken ex", e);
        res.json({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

async function getNetworkId(req, res) {
    try {
        const rpcUrl = req.headers.chainlinks;
        const networkType = req.headers.networktype;

        let response = responseData(false);

        switch (parseInt(networkType)) {
            case ERC20_TOKEN:
                response = await new Erc20Service(rpcUrl).getNetworkId();
                break;
            case TRC20_TOKEN:
                response = await new Trc20Service(rpcUrl).getNetworkId();
                break;
        }
        res.send(response);
    } catch (e) {
        console.log("getNetworkId ex", e);
        res.send(responseData(false, e.message));
    }
}

async function getDataByTransactionHash(req, res) {
    try {
        const network = req.headers.chainlinks;
        const hash = req.body.transaction_hash;
        const networkType = req.headers.networktype;
        if (parseInt(networkType) == 6) {
            await trxToken.getTrxConfirmedTransaction(req, res);
        } else {
            const response = await getERC20tokenTransactionDetails(req);
            res.send({
                status: response.status,
                message: response.message,
                data: response.data,
            });
        }
    } catch (e) {
        console.log("getDataByTransactionHash ex", e);
        res.send({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

// get erc20 token transaction data
async function getERC20tokenTransactionDetails(req) {
    try {
        const network = req.headers.chainlinks;
        const hash = req.body.transaction_hash;
        const web3 = new Web3(network);

        const response = await web3.eth.getTransaction(hash);
        // console.log('tx: ', response);

        if (response) {
            let contractJsons = contractJson();
            let tokenAddress = req.body.contract_address;
            // console.log('token_address: ', tokenAddress);

            if (String(tokenAddress).toLowerCase() != String(response.to).toLowerCase()) {
                return {
                    status: false,
                    message: `Token Contract Address mismatch found`,
                    data: {
                        msg_for_user: true,
                    },
                };
            }

            // Decode the input data using the ERC20 token ABI
            const contract = new web3.eth.Contract(contractJsons, tokenAddress);
            const types = ["address", "uint256"];

            // Decode the input data using the types of the function arguments
            const input = web3.eth.abi.decodeParameters(types, response.input.substring(10));

            // The amount of tokens transferred is the second parameter
            let amount = input[1];
            let toAddress = input[0];
            const tokenDecimal = await getContractDecimal(contract);

            amount = customFromWei(amount, tokenDecimal);
            return {
                status: true,
                message: "Get transaction success",
                data: {
                    hash: response,
                    gas_used: response.gas / response.gasPrice,
                    txID: response.hash,
                    amount: amount,
                    toAddress: toAddress,
                    fromAddress: response.from,
                },
            };
        } else {
            return {
                status: false,
                message: "Get transaction failed",
                data: {},
            };
        }
    } catch (err) {
        console.log("getERC20tokenTransactionDetails ex", err);
        return {
            status: false,
            message: String(err),
            data: {},
        };
    }
}

async function getHashTransaction(network, hash) {
    try {
        const transactionHash = hash;
        if (network) {
            const web3 = new Web3(network);
            let gasPrice = await web3.eth.getGasPrice();
            gasPrice = Web3.utils.fromWei(gasPrice.toString(), "ether");
            const hash = await web3.eth.getTransactionReceipt(transactionHash);
            if (hash) {
                return {
                    status: true,
                    message: "get hash",
                    data: {
                        hash: hash,
                        gas_used: hash.gasUsed * gasPrice,
                        txID: hash.transactionHash,
                    },
                };
            } else {
                return {
                    status: false,
                    message: "not found",
                    data: {},
                };
            }
        } else {
            return {
                status: false,
                message: "No chain provided",
                data: {},
            };
        }
    } catch (e) {
        return {
            status: false,
            message: e.message,
            data: {},
        };
    }
}

async function sendEth(req, res) {
    console.log("sendEth", "process start");
    try {
        const network = req.headers.chainlinks;
        const networkType = req.headers.networktype;

        if (network) {
            let usedGasLimit = req.body.gas_limit;
            const fromAddress = req.body.from_address;
            const receiverAddress = req.body.to_address;
            const privateKey = req.body.contracts;
            const chainId = req.body.chain_id;
            let amount = req.body.amount_value;

            if (parseInt(networkType) == 6) {
                await trxToken.sendTrxProcess(req, res);
            } else {
                const web3 = new Web3(network);
                let checkValidAddress = new Web3().utils.isAddress(receiverAddress);

                if (checkValidAddress) {
                    amount = Web3.utils.toWei(amount.toString(), "ether");

                    let gasPrice = await web3.eth.getGasPrice();
                    let nonce = await web3.eth.getTransactionCount(fromAddress, "latest");
                    usedGasLimit = usedGasLimit > 0 ? usedGasLimit : 63000;
                    const checkNativeBalance = await checkNativeCoinBalance(req, res);

                    let transaction = {
                        from: fromAddress,
                        nonce: web3.utils.toHex(nonce),
                        gas: usedGasLimit,
                        to: receiverAddress,
                        value: amount,
                        chainId: chainId, //
                    };

                    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);

                    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
                        if (!error) {
                            res.json({
                                status: true,
                                message: "Coin sent successfully",
                                data: {
                                    hash: hash,
                                },
                            });
                        } else {
                            res.json({
                                status: false,
                                message: error.message,
                                data: {
                                    error,
                                },
                            });
                        }
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Invalid address",
                        data: {},
                    });
                }
            }
        } else {
            res.json({
                status: false,
                message: "No network provided",
                data: {},
            });
        }
    } catch (e) {
        console.log("sendEth ex", e);
        res.json({
            status: false,
            message: e.message,
        });
    }
}

// checking native coin balance
async function checkNativeCoinBalance(req, res) {
    try {
        const network = req.headers.chainlinks;
        const networkType = req.headers.networktype;
        const address = req.body.from_address;
        const web3 = new Web3(network);
        netBalance = await web3.eth.getBalance(address);
        netBalance = Web3.utils.fromWei(netBalance.toString(), "ether");
        return netBalance;
    } catch (err) {
        return 0;
    }
}

async function getTransactionByContractAddress(req, res) {
    try {
        const network = req.headers.chainlinks;
        let contractJsons = contractJson();

        if (network) {
            const contractAddress = req.body.contract_address;

            const web3 = new Web3(network);
            // const contract = new web3.eth.Contract(contractJsons, contractAddress);

            const getBlockNumber = await web3.eth.getBlockNumber();

            const block = await getBlockData(web3, getBlockNumber);
            // const tx = await getTransactionsByAccount(web3,contractAddress,getBlock, null);

            res.json({
                status: true,
                message: "get block",
                data: {
                    blockNumber: getBlockNumber,
                    block: block,
                },
            });
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        res.json({
            status: false,
            message: e.message,
        });
    }
}

async function getBlockData(web3, blockNumber) {
    try {
        const block = await web3.eth.getBlock(blockNumber);
        if (block) {
            return {
                status: true,
                message: "success",
                data: block,
            };
        } else {
            return {
                status: false,
                message: "failed",
                data: {},
            };
        }
    } catch (e) {
        console.log("getBlockData ex", e);
    }
}

async function getTransactionsByAccount(web3, myaccount, endBlockNumber, startBlockNumber) {
    try {
        if (startBlockNumber == null) {
            startBlockNumber = endBlockNumber - 5;
        }

        let tx = [];
        for (let i = startBlockNumber; i <= endBlockNumber; i++) {
            if (i % 1000 == 0) {
            }

            let block = await web3.eth.getBlock(i);

            if (block != null && block.transactions != null) {
                block.transactions.forEach(async function (e) {
                    let trx = await web3.eth.getTransactionReceipt(e);
                });
            }
        }
    } catch (err) {}
}

async function getLatestEvents(req, res) {
    try {
        const network = req.headers.chainlinks;
        const networkType = req.headers.networktype;
        let decimalValue = 18;
        if (network) {
            if (parseInt(networkType) == TRC20_TOKEN) {
                await trc20Token.getTrc20LatestEvent(req, res);
            } else {
                let contractJsons = contractJson();
                // let prevBlock = 1000;
                const contractAddress = req.body.contract_address;

                // const numberOfBlock = req.body.number_of_previous_block;
                const lastBlockNumber = req.body.last_block_number;
                const erc_block_number = Number(req.body?.erc_block_number);
                let to_block_number = Number(req.body?.to_block_number);
                let from_block_number = Number(req.body?.from_block_number);
                let fromBlockNumber = 0;
                const web3 = new Web3(new Web3.providers.HttpProvider(network));
                const contract = new web3.eth.Contract(contractJsons, contractAddress);
                decimalValue = await getContractDecimal(contract);

                const latestBlockNumber = await web3.eth.getBlockNumber();

                console.log("EVM block");
                console.log("latestBlockNumber", latestBlockNumber);
                console.log("erc_block_number", erc_block_number);

                if (!(to_block_number > 0) && !(from_block_number > 0)) {
                    to_block_number = latestBlockNumber;
                    from_block_number = latestBlockNumber - erc_block_number;
                } else {
                    let compeareBlock = latestBlockNumber - to_block_number;
                    from_block_number = to_block_number;
                    to_block_number = latestBlockNumber;

                    if (compeareBlock > erc_block_number) to_block_number = from_block_number + erc_block_number;
                }

                console.log("from_block_number", from_block_number);
                console.log("to_block_number", to_block_number);

                if (from_block_number <= to_block_number) {
                    const result = await getBlockDetails(contract, from_block_number, to_block_number);

                    if (result.status === true) {
                        let resultData = [];
                        result.data?.response?.forEach(function (res) {
                            let innerData = {
                                event: res.event,
                                signature: res.signature,
                                contract_address: res.address,
                                tx_hash: res.transactionHash,
                                block_hash: res.blockHash,
                                from_address: res.returnValues.from,
                                to_address: res.returnValues.to,
                                amount: customFromWei(res.returnValues.value, decimalValue),
                                block_number: res.blockNumber,
                                block_timestamp: 0,
                                // to_block_number: to_block_number,
                                // from_block_number: from_block_number,
                            };
                            resultData.push(innerData);
                        });
                        res.json({
                            status: true,
                            message: result.message,
                            data: {
                                result: resultData,
                                block: result.data.block,
                                latest: latestBlockNumber,
                            },
                        });
                    } else {
                        res.json({
                            status: false,
                            message: result.message,
                            data: {
                                result: [],
                                block: result.data?.block,
                                latest: latestBlockNumber,
                            },
                        });
                    }
                } else {
                    res.json({
                        status: false,
                        message: "From block number should not greater than to block",
                        data: {},
                    });
                }
            }
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        console.log("getLatestEvents ex", e);
        res.json({
            status: false,
            message: e.message,
        });
    }
}
async function getBlockDetails(contract, fromBlockNumber, toBlockNumber) {
    try {
        const blockData = {
            from_block_number: fromBlockNumber,
            to_block_number: toBlockNumber,
        };
        console.log("getPastEvents", "processing");
        const response = await contract.getPastEvents("Transfer", {
            fromBlock: fromBlockNumber,
            toBlock: toBlockNumber, // You can also specify 'latest'
        });

        if (response && response.length > 0) {
            return {
                status: true,
                message: "found block details",
                data: {
                    response: response,
                    block: blockData,
                },
            };
        } else {
            return {
                status: false,
                message: "nodatafound",
                data: {
                    response: [],
                    block: blockData,
                },
            };
        }
    } catch (e) {
        console.log("getBlockDetails ex", e);
        return {
            status: false,
            message: e.message,
            data: [],
        };
    }
}

async function checkEstimateGas() {}
async function getContractDetails(req, res) {
    try {
        const network = req.headers.chainlinks;
        let contractJsons = contractJson();

        if (network) {
            const contractAddress = req.body.contract_address;
            const address = req.body.address;

            let symbol = "";
            let name = "";
            let tokenBalance = 0;
            let tokenDecimal = 18;
            const web3 = new Web3(network);
            const netID = await web3.eth.net.getId();
            if (contractAddress) {
                const contractInstance = new web3.eth.Contract(contractJsons, contractAddress);
                symbol = await contractInstance.methods.symbol().call();
                name = await contractInstance.methods.name().call();
                tokenDecimal = await contractInstance.methods.decimals().call();

                if (address) {
                    tokenBalance = await contractInstance.methods.balanceOf(address).call();
                    tokenBalance = customFromWei(tokenBalance, tokenDecimal);
                }
            } else {
                res.json({
                    status: false,
                    message: "Contract address required",
                    data: {},
                });
            }

            const data = {
                chain_id: netID,
                symbol: symbol,
                name: name,
                token_balance: tokenBalance,
                token_decimal: tokenDecimal,
            };

            res.send({
                status: true,
                message: "process successfully",
                data: data,
            });
        } else {
            res.json({
                status: false,
                message: "No chain provided",
                data: {},
            });
        }
    } catch (e) {
        console.log("getContractDetails ex", e);
        res.json({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

async function getAddressFromPK(req, res) {
    try {
        const networkType = req.headers.networktype;

        if (parseInt(networkType) == 6) {
            await trxToken.getTrxAddressByPk(req, res);
        } else {
            const response = await getETHAddressFromPk(req);
            res.send({
                status: response.status,
                message: response.message,
                data: response.data,
            });
        }
    } catch (e) {
        console.log("getAddressFromPK ex", e);
        res.send({
            status: false,
            message: e.message,
            data: {},
        });
    }
}

// get erc20 address data
async function getETHAddressFromPk(req) {
    try {
        const network = req.headers.chainlinks;
        const pk = req.body.contracts;
        const web3 = new Web3(network);

        const response = await web3.eth.accounts.privateKeyToAccount(pk);
        if (response) {
            return {
                status: true,
                message: "Get address success",
                data: {
                    address: response.address,
                },
            };
        } else {
            return {
                status: false,
                message: "Get address failed",
                data: {},
            };
        }
    } catch (err) {
        console.log("getETHAddressFromPk ex", err);
        return {
            status: false,
            message: String(err),
            data: {},
        };
    }
}

async function testBitgo(req, res) {
    try {
        res.send("s");
    } catch (err) {
        return {
            status: false,
            message: String(err),
            data: {},
        };
    }
}

module.exports = {
    getData,
    generateAddress,
    getWalletBalance,
    sendEth,
    sendToken,
    checkEstimateGasFees,
    getTransactionByContractAddress,
    getDataByTransactionHash,
    getLatestEvents,
    getContractDetails,
    getAddressFromPK,
    testBitgo,
    getNetworkId,
};
