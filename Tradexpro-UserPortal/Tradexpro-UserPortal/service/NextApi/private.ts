import request from "lib/request";

const getCustomHeader = (req: any) => {
  return {
    headers: {
      userpublickey: `${req?.headers?.userpublickey}`,
      usersecretkey: `${req?.headers?.usersecretkey}`,
    },
  };
};

export const getUserProfile = async (req: any) => {
  const { data } = await request.get("/profile", getCustomHeader(req));
  return data;
};

export const getWalletLists = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/wallet-list?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const addSellLimitApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/sell-limit-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const addSellMarketApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/sell-market-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const addSellStopLimitApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/sell-stop-limit-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const getWalletDepositByWalletId = async (req: any, wallet_id: any) => {
  const { data } = await request.get(
    `/wallet-deposit-${wallet_id}`,
    getCustomHeader(req)
  );
  return data;
};
export const getWalletWithdrawlByWalletId = async (
  req: any,
  wallet_id: any
) => {
  const { data } = await request.get(
    `/wallet-withdrawal-${wallet_id}`,
    getCustomHeader(req)
  );
  return data;
};

export const addPreWithdrawlProcess = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/pre-withdrawal-process",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const addWalletWithdrawalProcess = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/wallet-withdrawal-process",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const getWalletNetworkAddress = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/get-wallet-network-address",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const getAllBuyOrdersApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-all-buy-orders-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getAllSellOrdersApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-all-sell-orders-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getMyAllOrdersApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-my-all-orders-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getMyTradesApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-my-trades-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const cancelOpenOrderApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/cancel-open-order-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const getAllBuyOrdersHistoryApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/all-buy-orders-history-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getAllSellOrdersHistoryApp = async (
  req: any,
  queryParams: any
) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/all-sell-orders-history-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getAllTransactionsHistoryApp = async (
  req: any,
  queryParams: any
) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/all-transaction-history-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getAllStopLimitOrdersApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-all-stop-limit-orders-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getReferalHistory = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/referral-history?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const getWalletHistoryAppLists = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/wallet-history-app?" + params.toString(),
    getCustomHeader(req)
  );
  return data;
};

export const addBuyLimitApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/buy-limit-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const addBuyMarketApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/buy-market-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};

export const addBuyStopLimitApp = async (req: any, bodyData: any) => {
  const { data } = await request.post(
    "/buy-stop-limit-app",
    {
      ...bodyData,
    },
    getCustomHeader(req)
  );
  return data;
};
