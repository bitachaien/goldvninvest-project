const dotenv = require("dotenv");
const { customFromWei, powerOfTen, tronWebCall, customToWei } = require("../helpers/helper");
const trcToken = require("./TrcTokenController");
const { json } = require("express/lib/response");
const TronWeb = require("tronweb");
const tronABI  = require("../helpers/tronABI.json");

dotenv.config();

// create trx address account
async function createAccount(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const response = await tronWeb.createAccount();
    if (response) {
      res.json({
        status: true,
        message: "TRC Wallet created successfully",
        data: {
          address: response.address.base58,
          privateKey: response.privateKey,
          publicKey: response.publicKey,
        },
      });
    } else {
      res.json({
        status: false,
        message: "TRC Wallet create failed",
        data: {},
      });
    }
  } catch (err) {
    console.log('createAccount ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// get tron balance
async function getTronBalance(req, res) {
  try {
    const type = req.body.type;
    let netBalance = 0;
    let tokenBalance = 0;
    let message = "Balance get successfully";
    let success = true;
    const address = req.body.address;
    if (address) {
      if (type == 1) {
        let a = await getTrxBalance(req, res);
        if (a.status == true) {
          netBalance = a.data;
        } else {
          message = a.message;
          success = a.status;
        }
      } else if (type == 2) {
        let b = await trcToken.getTrc20TokenBalance(req, res);

        if (b.status == true) {
          tokenBalance = b.data;
        } else {
          message = b.message;
          success = b.status;
        }
      } else {
        let a = await getTrxBalance(req, res);
        if (a.status == true) {
          netBalance = a.data;
        } else {
          message = a.message;
          success = a.status;
        }
        let b = await trcToken.getTrc20TokenBalance(req, res);
        if (b.status == true) {
          tokenBalance = b.data;
        } else {
          message = b.message;
          success = b.status;
        }
      }

      const data = {
        net_balance: netBalance,
        token_balance: tokenBalance,
      };
      res.send({
        status: success,
        message: message,
        data: data,
      });
    } else {
      res.json({
        status: false,
        message: "Address is required",
        data: {},
      });
    }
  } catch (err) {
    console.log('getTronBalance ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// get TRX Balance
async function getTrxBalance(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const address = req.body.address;
    let balance = await tronWeb.trx.getBalance(address);
    balance = parseFloat(tronWeb.fromSun(balance));

    return {
      status: true,
      message: "Get TRX balance",
      data: balance,
    };
  } catch (err) {
    console.log('getTrxBalance ex', err);
    return {
      status: false,
      message: String(err),
      data: {},
    };
  }
}

// get account details by address
async function getTrxAccount(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const address = req.body.address;

    if (address) {
      const response = await tronWeb.trx.getAccount(address);

      if (response) {
        res.json({
          status: true,
          message: "TRC data get successfully",
          data: response,
        });
      } else {
        res.json({
          status: false,
          message: "Data get failed",
          data: {},
        });
      }
    } else {
      res.json({
        status: false,
        message: "Address is required",
        data: {},
      });
    }
  } catch (err) {
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// get address by private key
async function getTrxAddressByPk(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const key = req.body.contracts;
    if (key) {
      const response = await tronWeb.address.fromPrivateKey(key);

      if (response) {
        res.json({
          status: true,
          message: "TRC data get successfully",
          data: { address: response },
        });
      } else {
        res.json({
          status: false,
          message: "Data get failed",
          data: {},
        });
      }
    } else {
      res.json({
        status: false,
        message: "Pk is required",
        data: {},
      });
    }
  } catch (err) {
    console.log('getTrxAddressByPk ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// check trx address
async function checkTrxAddress(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const address = req.body.address;
    if (address) {
      const response = await tronWeb.isAddress(address);
      if (response) {
        res.json({
          status: true,
          message: "Address valid",
          data: response,
        });
      } else {
        res.json({
          status: false,
          message: "Address not found",
          data: false,
        });
      }
    } else {
      res.json({
        status: false,
        message: "Address is required",
        data: {},
      });
    }
  } catch (err) {
    console.log('checkTrxAddress ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// send trx process
async function sendTrxProcess(req, res) {
  console.log('sendTrxProcess','process start');
  try {
    const tronWeb = tronWebCall(req, res);
    const to = req.body.to_address;

    const amount = parseInt(tronWeb.toSun(req.body.amount_value));

    const key = req.body.contracts;

    const checkAddress = await tronWeb.isAddress(to);
    if (checkAddress) {
      const response = await tronWeb.trx.sendTransaction(to, amount, key);

      if (response && response.result == true) {
        res.json({
          status: true,
          message: "Send trx success",
          data: {
            hash: response.txid,
          },
        });
      } else {
        res.json({
          status: false,
          message: "Send trx failed",
          data: {},
        });
      }
    } else {
      res.json({
        status: false,
        message: "Invalid address",
        data: {},
      });
    }
  } catch (err) {
    console.log('sendTrxProcess ex',err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// get trx transaction by hash
async function getTrxTransaction(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const txId = req.body.transaction_hash;

    const response = await tronWeb.trx.getTransaction(txId);

    if (response) {
      res.json({
        status: true,
        message: "Get transaction success",
        data: {
          hash: response,
          gas_used: 0,
          txID: response.txId,
        },
      });
    } else {
      res.json({
        status: false,
        message: "Get transaction failed",
        data: {},
      });
    }
  } catch (err) {
    console.log('getTrxTransaction ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

const getTransactionDetailsData = async (tronWeb,transaction) => {
  let data = {};
  const rawData = transaction.raw_data;
  const contractType = rawData.contract[0].type;
  const rawTransactionData = rawData.contract[0].parameter;
  const valueData = rawTransactionData.value.data;
  const method = valueData.slice(0, 10);
  console.log("method", method);
  if (method === 'a9059cbb00') {
      const toAddress = '0x' + valueData.slice(32, 72); 
      let amountData = '0x' + valueData.slice(74);
      const amount = parseInt(amountData, 16);
      const convertData = await convertAddressAmount(
        tronWeb,
        rawTransactionData.value.owner_address,
        toAddress,
        amount,
        rawTransactionData.value.contract_address
      );
      const fromAddress = convertData.from_address;
      const to_address = convertData.to_address;
      const amountVal = convertData.amount;
      const contract_address = convertData.contract_address;

      data = {
          'tx_type': 'token',
          'fromAddress': fromAddress,
          'toAddress': to_address,
          'amount': amountVal,
          'transaction_id' : transaction.txID,
          'contract_address' : contract_address,
          'fee_limit': rawData.fee_limit ? rawData.fee_limit : 0
      }
  }
  return data;
}

const convertAddressAmount = async(tronWeb,fromAddress,toAddress,amountVal,contractAddress) => {
  try {
    const from_address = tronWeb.address.fromHex(fromAddress);
    let to_address = toAddress;
    let contract_address = '';
    let amount = 0;
    
    to_address = tronWeb.address.fromHex(tronWeb.address.toHex(toAddress))
    contract_address = tronWeb.address.fromHex(contractAddress);
    const contactData = await getContractDetails(tronWeb,contract_address);
    let decimal = contactData.data.decimal;
    amount = customFromWei(amountVal,decimal);
    
      
    return {
      from_address:from_address,
      to_address:to_address,
      contract_address:contract_address,
      amount:amount,
    }
  } catch (err) {
    console.log('ex err', err);
    return {
      from_address:0,
      to_address:0,
      contract_address:0,
      amount:0,
    }
  }
  
}

const getContractDetails = async (tronWeb, contact) => {
  try {
    if(!tronWeb.isAddress(contact)) return generateErrorResponse("Token contract address is invalid");

    tronWeb.setAddress(contact);
    const contract_interface = tronWeb.contract(tronABI.entrys,contact);
    const contractName    = await contract_interface.name().call();
    const contractSymbol  = await contract_interface.symbol().call();
    const contractDecimal = await contract_interface.decimals().call();
    let data = {
      name     : contractName,
      coin_type: contractSymbol,
      decimal  : contractDecimal
    };
    
    return {
      success: true,
      message: "Contact details get successfully",
      data: data ? data : {},
    };
  } catch (error) {
    console.error('getContractDetails Error:', error);
    return {
      success: false,
      message: error.message ?? "Something went wrong",
      data:{},
    };
  }
}

// get trx confirmed transaction by hash
async function getTrxConfirmedTransaction(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const txId = req.body.transaction_hash;

    const tronResponse = await tronWeb.trx.getTransaction(txId);
    response = await getTransactionDetailsData(tronWeb,tronResponse);
    if (response) {
      const contractAddress = req.body.contract_address;
      const contract = await tronWeb.contract().at(contractAddress);
      console.log("response", response,txId);
      res.json({
        status: true,
        message: "Get transaction success",
        data: {
          ...response,
          gas_used: parseFloat(tronWeb.fromSun(response.fee)),
          txID: response.transaction_id,
        },
      });
    } else {
      res.json({
        status: false,
        message: "Get transaction failed",
        data: {},
      });
    }
  } catch (err) {
    console.log('getTrxConfirmedTransaction ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

async function getTrxTransactionBlock(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const txId = req.body.transaction_hash ?? "trx_hash";
    const response = await tronWeb.getEventByTransactionID(txId);
    console.log('getTrxTransactionBlock re',response)
    if (typeof response == "object" && response.length > 0) {
      let transaction = response[0];
      let from = transaction.result.from;
      let to = transaction.result.to;
      transaction.result.from = tronWeb.address.fromHex(
        tronWeb.address.toHex(from)
      );
      transaction.result.to = tronWeb.address.fromHex(
        tronWeb.address.toHex(to)
      );
      console.log('transaction', transaction)
      res.json({
        status: true,
        message: "Transaction details get successfully",
        data: transaction,
      });
    } else {
      res.json({
        status: false,
        message: "Transaction details not found",
        data: {},
      });
    }
  } catch (err) {
    console.log('getTrxTransactionBlock ex', err);
    res.json({
      status: false,
      message: err.stack ?? "Something went wrong with node api",
      data: {},
    });
  }
}

async function getTrxEstimateGas(req, res) {
  try {
    const tronWeb = tronWebCall(req, res);
    const ownerWallet = req.body.from_wallet;
    const receiverWallet = req.body.to_wallet;
    const contractAddress = req.body.contract;
    const amount = req.body.amount;
    const _function = "transfer(address,uint256)";
    const options = {
      feeLimit: 1_000_000,
      callValue: 0,
    };
    const parameter = [
      {
        type: "address",
        value: receiverWallet,
      },
      {
        type: "uint256",
        value: customToWei(amount, 6),
      },
    ];
    const response = await tronWeb.transactionBuilder.triggerConstantContract(
      tronWeb.address.toHex(contractAddress),
      _function,
      {},
      parameter,
      tronWeb.address.toHex(ownerWallet)
    );

    if (typeof response == "object" && response.result.result) {
      let energy = response.energy_used;

      let gas = Number(TronWeb.fromSun(energy * 420));

      res.json({
        status: true,
        message: "Estimted energy found successfully",
        data: {
          gasLimit: 420,
          gasPrice: energy,
          estimateGasFees: gas,
        },
      });
    } else {
      res.json({
        status: false,
        message: "Estimted energy not found",
        data: {},
      });
    }
  } catch (err) {
    console.log('getTrxEstimateGas err', err);
    res.json({
      status: false,
      message: err.stack ?? "Something went wrong with node api",
      data: {},
    });
  }
}

module.exports = {
  createAccount,
  getTronBalance,
  getTrxBalance,
  getTrxAccount,
  getTrxAddressByPk,
  checkTrxAddress,
  sendTrxProcess,
  getTrxTransaction,
  getTrxConfirmedTransaction,
  getTrxTransactionBlock,
  getTrxEstimateGas,
};
