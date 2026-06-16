import request from "lib/request";

const getPublicCustomHeader = (req: any) => {
  return {
    headers: {
      userpublickey: `${req?.headers?.userpublickey}`,
    },
  };
};

export const getMarketPrice = async (pair: string) => {
  const { data } = await request.get("/v1/markets/price/" + pair, {
    headers: {
      publicapisecret: `{z)E/f+2sW?G!f]>E,rh^K4N-=8^Uw5dM]B9g<(mJ:HU^5?6~PwyewwM!a"}gs#N`,
    },
  });
  return data;
};
export const getOrderBook = async (pair: string) => {
  const { data } = await request.get("/v1/markets/orderbook/" + pair, {
    headers: {
      publicapisecret: `{z)E/f+2sW?G!f]>E,rh^K4N-=8^Uw5dM]B9g<(mJ:HU^5?6~PwyewwM!a"}gs#N`,
    },
  });
  return data;
};
export const getTrade = async (pair: string) => {
  const { data } = await request.get("/v1/markets/trade/" + pair, {
    headers: {
      publicapisecret: `{z)E/f+2sW?G!f]>E,rh^K4N-=8^Uw5dM]B9g<(mJ:HU^5?6~PwyewwM!a"}gs#N`,
    },
  });
  return data;
};
export const getChart = async (pair: string) => {
  const { data } = await request.get("/v1/markets/chart/" + pair, {
    headers: {
      publicapisecret: `{z)E/f+2sW?G!f]>E,rh^K4N-=8^Uw5dM]B9g<(mJ:HU^5?6~PwyewwM!a"}gs#N`,
    },
  });
  return data;
};

export const getPublicSiteSettings = async (req: any) => {
  const { data } = await request.get(
    "/public-site-settings",
    getPublicCustomHeader(req)
  );
  return data;
};

export const getFaqLists = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/faq-list?" + params.toString(),
    getPublicCustomHeader(req)
  );
  return data;
};

export const getMarketOverviewCoinStatisticList = async (
  req: any,
  queryParams: any
) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/market-overview-coin-statistic-list?" + params.toString(),
    getPublicCustomHeader(req)
  );
  return data;
};

export const getMarketOverviewTopCoinList = async (
  req: any,
  queryParams: any
) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/market-overview-top-coin-list?" + params.toString(),
    getPublicCustomHeader(req)
  );
  return data;
};

export const getCurrencyLists = async (req: any) => {
  const { data } = await request.get(
    "/currency-list",
    getPublicCustomHeader(req)
  );
  return data;
};

export const getExchangeAllOrdersApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-exchange-all-orders-app?" + params.toString(),
    getPublicCustomHeader(req)
  );
  return data;
};

export const appGetPairs = async (req: any) => {
  const { data } = await request.get(
    "/app-get-pair",
    getPublicCustomHeader(req)
  );
  return data;
};

export const getAppDashboardData = async (req: any, pair: any) => {
  const { data } = await request.get(
    `/app-dashboard/${pair}`,
    getPublicCustomHeader(req)
  );
  return data;
};

export const getExchangeMarketTradesApp = async (
  req: any,
  queryParams: any
) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-exchange-market-trades-app?" + params.toString(),
    getPublicCustomHeader(req)
  );
  return data;
};

export const getExchangeChartDataApp = async (req: any, queryParams: any) => {
  const params = new URLSearchParams(queryParams);
  const { data } = await request.get(
    "/get-exchange-chart-data-app?" + params.toString(),
    getPublicCustomHeader(req)
  );
  return data;
};
