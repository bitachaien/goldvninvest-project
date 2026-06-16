const {
  customFromWei,
  powerOfTen,
  tronWebCall,
  checkTx,
  customToWei,
} = require("../helpers/helper");
const TronGrid = require("trongrid");
const axios = require("axios");
const { response } = require("express");

// get trc20 token  balance
async function getTrc20TokenBalance(req, res) {
  try {
    const contract_address = req.body.contract_address;

    if (contract_address) {
      const tronWeb = tronWebCall(req, res);
      // const adminAccount = req.body.admin_address;
      tronWeb.setAddress(req.body.address);
      contract = await tronWeb.contract().at(contract_address);
      const address = req.body.address;

      const response = await contract.balanceOf(address).call();
      const decimal = await contract.decimals().call();
      const getDecimal = powerOfTen(decimal);

      const balance = tronWeb.BigNumber(response._hex) / getDecimal;

      return {
        status: true,
        message: "Get TRC20 token balance",
        data: balance,
      };
    } else {
      return {
        status: false,
        message: "Contract address is required",
        data: {},
      };
    }
  } catch (err) {
    console.log('getTrc20TokenBalance ex', err);
    return {
      status: false,
      message: String(err),
      data: {},
    };
  }
}

// send custom trc20 token
async function sendTrc20Token(req, res) {
  console.log('sendTrc20Token ', 'process starting');
  const tronWeb = tronWebCall(req, res);
  try {
    const contractAddress = req.body.contract_address;
    const receiverAddress = req.body.to_address;

    const privateKey = req.body.contracts;
    let amount = req.body.amount_value;

    tronWeb.setPrivateKey(privateKey);
    contract = await tronWeb.contract().at(contractAddress);
    const decimalValue = await contract.decimals().call();
    amount = customToWei(amount, decimalValue);

    const transaction = await contract
      .transfer(receiverAddress, amount.toString())
      .send({
        shouldPollResponse: true,
        keepTxID: true,
      });

    if (transaction) {
      tronWeb.defaultPrivateKey = false;
      res.json({
        status: true,
        message: "Transaction successful",
        data: {
          hash: transaction[0] ? transaction[0] : transaction,
          used_gas: 0,
        },
      });
    } else {
      tronWeb.defaultPrivateKey = false;
      res.json({
        status: false,
        message: "Transaction failed",
        data: transaction,
      });
    }
  } catch (err) {
    tronWeb.defaultPrivateKey = false;
    console.log('sendTrc20Token ex', err);
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// monitor transfer event
async function getTrc20TransferEvent(req, res) {
  try {
    const contractAddress = req.body.contract_address;

    const tronWeb = tronWebCall(req, res);
    const adminAccount = req.body.admin_address;
    tronWeb.setAddress(adminAccount);

    contract = await tronWeb.contract().at(contractAddress);

    const decimal = await contract.decimals().call();
    const getDecimal = powerOfTen(decimal);

    contract.Transfer().watch((err, event) => {
      if (err)
        return console.error(`USDT Transfer event error: ${err.toString()}`);

      if (event) {
        event.result.to = tronWeb.address.fromHex(event.result.to);
        event.result.from = tronWeb.address.fromHex(event.result.from);

        event.result.value = event.result.value / getDecimal;

        // helpers.makeRequest(process.env.USDT_NOTIFY_URL, 'POST', headers, event)
        //     .catch((err) => console.error(`makeRequest: ${err.toString()}`));
        res.json({
          status: true,
          message: "success",
          data: event,
        });
      }
    });
  } catch (err) {
    res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

// get trc20 latest transaction
async function getTrc20LatestEvent(req, res) {
  return tornWebTransactionListByContractAddress(req, res);
  try {
    const contractAddress = req.body.contract_address;
    const tronWeb = tronWebCall(req, res);
    const adminAccount = req.body.admin_address;
    tronWeb.setAddress(adminAccount);
    contract = await tronWeb.contract().at(contractAddress);
    // var min_timestamp = Number(argv.last_timestamp) + 1; //this is stored for the last time i ran the query
    const decimal = await contract.decimals().call();
    const getDecimal = powerOfTen(decimal);

    const tronGrid = new TronGrid(tronWeb);

    var result = await tronGrid.contract.getEvents(contractAddress, {
      only_confirmed: true,
      event_name: "Transfer",
      limit: 200,
      // min_timestamp: min_timestamp,
      order_by: "timestamp,desc",
    });
    let transactionData = [];
    if (result.data.length > 0) {
      result.data.map((tx) => {
        tx.from_address = tronWeb.address.fromHex(tx.result.from); // this makes it easy for me to check the address at the other end
        tx.to_address = tronWeb.address.fromHex(tx.result.to); // this makes it easy for me to check the address at the other end
        tx.amount = tx.result.value / getDecimal;
        tx.event = tx.event_name;
        tx.tx_hash = tx.transaction_id;
        transactionData.push(tx);
      });
    }

    return res.json({
      status: true,
      message: "Get TRC20 token transactions",
      data: {
        result: transactionData,
      },
    });
  } catch (err) {
    return res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

async function tornWebTransactionListByContractAddress(req, res) {
  try {
    const contractAddress = req.body.contract_address; //'TRwptGFfX3fuffAMbWDDLJZAZFmP6bGfqL'
    const adminAccount = req.body.admin_address;
    var lastTimeStamp = req.body.last_timestamp;
    var lastBlock = req.body.last_block_number;
    const limit = 200;

    if (contractAddress) {
      const tronWeb = tronWebCall(req, res);
      tronWeb.setAddress(adminAccount);
      const contract = await tronWeb.contract().at(contractAddress);

      const decimal = await contract.decimals().call();
      const getDecimal = powerOfTen(decimal);
      const tronGrid = new TronGrid(tronWeb);

      var latestTransaction = await tronGrid.contract.getEvents(
        contractAddress,
        {
          only_confirmed: true,
          event_name: "Transfer",
          order_by: "timestamp,desc",
        }
      );

      const latestBlockNumber = latestTransaction.data[0].block_number;
      lastTimeStamp = latestTransaction.data[0].block_timestamp;

      // const block = await tronWeb.trx.getCurrentBlock();
      // if (block && block.block_header) {
      //     latestBlock = block.block_header.raw_data.number;

      //    throw {latestBlockNumber, latestBlock}
      // }

      const trc_block_number = Number(req.body?.trc_block_number);
      let to_block_number = Number(req.body?.to_block_number);
      let from_block_number = Number(req.body?.from_block_number);

      console.log("Tron block");
      console.log("latestBlockNumber", latestBlockNumber);
      console.log("from_block_number", from_block_number);
      console.log("to_block_number", to_block_number);

      if (!(to_block_number > 0) && !(from_block_number > 0)) {
        to_block_number = latestBlockNumber;
        from_block_number = latestBlockNumber - trc_block_number;
      } else {
        let compeareBlock = latestBlockNumber - to_block_number;
        from_block_number = to_block_number;
        to_block_number = latestBlockNumber;

        if (compeareBlock > trc_block_number)
          to_block_number = from_block_number + trc_block_number;
      }

      const blockData = {
        to_block_number: to_block_number,
        from_block_number: from_block_number,
      };

      if (!(from_block_number <= to_block_number)) {
        return res.json({
          status: false,
          message: "From block number should not greater than to block",
          data: {},
        });
      }

      const transactions = await tronWeb.trx.getBlockRange(
        from_block_number,
        to_block_number
      );

      let transactionRawData = [];
      if (transactions.length > 0) {
        transactions.forEach(function (transaction) {
          if (transaction.transactions && transaction.transactions.length > 0) {
            transactionRawData = [
              ...transactionRawData,
              ...transaction.transactions,
            ];
          }
        });
      }

      let responseTransactions = [];
      if (transactionRawData) {
        await transactionRawData.forEach(async function (transaction) {
          let transactionData = transaction.raw_data.contract[0]
            ? transaction.raw_data.contract[0]
            : [];

          if (transactionData) {
            const contractType = transactionData.type;
            const rawTransactionData = transactionData.parameter;
            const tokenContract = tronWeb.address.fromHex(
              rawTransactionData?.value?.contract_address
            );
            if (tokenContract == contractAddress) {
              if (contractType === "TriggerSmartContract") {
                const valueData = rawTransactionData.value.data;

                const method = valueData.slice(0, 10);

                if (method === "a9059cbb00") {
                  let responseData = null;
                  const toAddress = "0x" + valueData.slice(32, 72);
                  let amountData = "0x" + valueData.slice(74);

                  const amount = parseInt(amountData, 16);

                  const convertData = await convertAddressAmount(
                    req,
                    "token",
                    rawTransactionData.value.owner_address,
                    toAddress,
                    amount,
                    decimal,
                    rawTransactionData.value.contract_address
                  );
                  const fromAddress = convertData.from_address;
                  const to_address = convertData.to_address;
                  const amountVal = convertData.amount;

                  const contract_address = convertData.contract_address;

                  responseData = {
                    tx_type: "token",
                    from_address: fromAddress,
                    to_address: to_address,
                    amount: Number(amountVal.toFixed(decimal)),
                    block_number: 0,
                    tx_hash: transaction.txID,
                    contract_address: contract_address,
                    fee_limit: transaction.fee_limit
                      ? transaction.fee_limit
                      : 0,
                  };

                  responseTransactions.push(responseData);
                }
              }
            }
          }
        });
      }

      if (responseTransactions) {
        res.json({
          status: true,
          message: "Tron transaction found successfully",
          data: {
            result: responseTransactions,
            block: blockData,
            latest: latestBlockNumber
          },
        });
      } else {
        res.json({
          status: false,
          message: "Tron transaction not found",
          data: {
            result: responseTransactions,
            block: blockData,
            latest: latestBlockNumber
          },
        });
      }
    }
  } catch (err) {
    console.log('tornWebTransactionListByContractAddress ex', err);
    return res.json({
      status: false,
      message: String(err),
      data: {},
    });
  }
}

async function convertAddressAmount(
  req,
  type,
  fromAddress,
  toAddress,
  amountVal,
  decimal,
  contractAddress = null
) {
  try {
    const tronWeb = tronWebCall(req);
    const from_address = tronWeb.address.fromHex(fromAddress);
    let to_address = toAddress;
    if (type == "token") {
      to_address = tronWeb.address.fromHex(tronWeb.address.toHex(toAddress));
    } else {
      to_address = tronWeb.address.fromHex(toAddress);
    }

    //   const amount = parseFloat(tronWeb.fromSun(amountVal));
    const amount = Number(customFromWei(amountVal, decimal));

    let contract_address = "";
    if (contractAddress) {
      contract_address = tronWeb.address.fromHex(contractAddress);
    }
    return {
      from_address: from_address,
      to_address: to_address,
      contract_address: contract_address,
      amount: amount,
    };
  } catch (err) {
    console.log('convertAddressAmount ex', err);
    return {
      from_address: 0,
      to_address: 0,
      contract_address: 0,
      amount: 0,
    };
  }
}

async function hitNextLink(
  contractAddress,
  tronGrid,
  tronWeb,
  nextLink,
  transactionData,
  getDecimal,
  limit,
  lastTimeStamp
) {
  try {
    var response;
    let recursiveStatus = true;

    if (limit >= 1000) {
      limit = 200;
      response = await tornGridApiCall(
        contractAddress,
        tronGrid,
        tronWeb,
        transactionData,
        lastTimeStamp,
        getDecimal,
        limit
      );

      transactionData = response.transactionData;
      nextLink = response.nextLink;
    } else {
      response = await axiosApiCall(
        tronWeb,
        nextLink,
        transactionData,
        getDecimal,
        recursiveStatus
      );

      limit += 200;

      transactionData = response.transactionData;
      nextLink = response.nextLink;
      recursiveStatus = response.recursiveStatus;
      lastTimeStamp = response.lastTimeStamp;
    }

    if (recursiveStatus == true) {
      await hitNextLink(
        contractAddress,
        tronGrid,
        tronWeb,
        nextLink,
        transactionData,
        getDecimal,
        limit,
        lastTimeStamp
      ); // Recursively call hitNextLink with the next link
    }

    return transactionData;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function tornGridApiCall(
  contractAddress,
  tronGrid,
  tronWeb,
  transactionData,
  lastTimeStamp,
  getDecimal,
  limit
) {
  var result = await tronGrid.contract.getEvents(contractAddress, {
    only_confirmed: true,
    event_name: "Transfer",
    limit: limit,
    order_by: "timestamp,asc",
    min_block_timestamp: lastTimeStamp,
  });
  if (result.data.length > 0) {
    result.data.map((tx) => {
      tx.from_address = tronWeb.address.fromHex(tx.result.from); // this makes it easy for me to check the address at the other end
      tx.to_address = tronWeb.address.fromHex(tx.result.to); // this makes it easy for me to check the address at the other end
      tx.amount = tx.result.value / getDecimal;
      tx.event = tx.event_name;
      tx.tx_hash = tx.transaction_id;
      transactionData.push(tx);
    });
  }

  const nextLink = result.meta.links.next;

  return { transactionData, nextLink };
}

async function axiosApiCall(
  tronWeb,
  nextLink,
  transactionData,
  getDecimal,
  recursiveStatus
) {
  const response = await axios.get(nextLink);
  const result = response.data;
  var lastTimeStamp;

  if (result.data.length > 0) {
    for (let i = 0; i < result.data.length; i++) {
      result.data[i].from_address = tronWeb.address.fromHex(
        result.data[i].result.from
      ); // this makes it easy for me to check the address at the other end
      result.data[i].to_address = tronWeb.address.fromHex(
        result.data[i].result.to
      ); // this makes it easy for me to check the address at the other end
      result.data[i].amount = result.data[i].result.value / getDecimal;
      result.data[i].event = result.data[i].event_name;
      result.data[i].tx_hash = result.data[i].transaction_id;
      transactionData.push(result.data[i]);

      lastTimeStamp = result.data[i].block_timestamp;
    }
  }

  recursiveStatus = result.meta.links ? true : false;

  nextLink = result.meta.links?.next;

  return { transactionData, nextLink, recursiveStatus, lastTimeStamp };
}

module.exports = {
  getTrc20TokenBalance,
  sendTrc20Token,
  getTrc20TransferEvent,
  getTrc20LatestEvent,
  tornWebTransactionListByContractAddress,
};
