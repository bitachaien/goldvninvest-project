import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import AllSellOrders from "../AllSellOrders";
import AllSellOrdersFull from "../AllSellOrdersFull";
import ExchangeBox from "../ExchangeBox";
import TradesHistory from "../TradesHistory";
import AllBuyOrders from "../AllBuyOrders";
import AllBuyOrdersFull from "../AllBuyOrdersFull";
import dynamic from "next/dynamic";
import OrderHistorySection from "../orderHistorySection";
import useTranslation from "next-translate/useTranslation";
import { EXCHANGE_LAYOUT_TWO } from "helpers/core-constants";
import { set } from "nprogress";
import OrderBookPriceLabel from "../order-book/OrderBookPriceLabel";
import OrderBook from "../order-book/OrderBook";
const TradingChart = dynamic(
  () =>
    import("components/exchange/TradingChart").then(
      (mod: any) => mod.TVChartContainer
    ),
  { ssr: false }
);

const DepthChart = dynamic(
  () => import("components/depth-chart/DepthChartView"),
  { ssr: false }
);

const LayoutTwo = ({ ThemeColor }: any) => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation("common");
  const [select, setSelect] = React.useState(3);

  const [isActiveTradingView, setIsActiveTradingView] = useState(true);

  const { dashboard, OpenBookBuy, OpenBooksell, marketTrades, currentPair } =
    useSelector((state: RootState) => state.exchange);
  const { settings, theme } = useSelector((state: RootState) => state.common);

  useEffect(() => {
    setShow(false);
    setInterval(() => {
      setShow(true);
    }, 400);
  }, [ThemeColor.green, ThemeColor.red]);
  return (
    <div className="row trade-dashboard-side-margin">
      <div className="col-xl-7 px-0">
        <div className="py-2 px-2 d-flex align-items-center gap-10">
          <span
            onClick={() => setIsActiveTradingView(true)}
            className={`${
              isActiveTradingView && "text-primary-color"
            } font-bold cursor-pointer`}
          >
            {t("Trading View")}
          </span>
          <span
            onClick={() => setIsActiveTradingView(false)}
            className={`${
              !isActiveTradingView && "text-primary-color"
            } font-bold cursor-pointer`}
          >
            {t("Depth Chart")}
          </span>
        </div>
        <div className="cp-user-buy-coin-content-area">
          <div className="card cp-user-custom-card">
            {currentPair && show && isActiveTradingView && (
              <TradingChart
                //@ts-ignore
                currentPair={currentPair}
                theme={theme}
                ThemeColor={ThemeColor}
              />
            )}
            {!isActiveTradingView && <DepthChart />}
          </div>
        </div>

        <OrderHistorySection />
      </div>
      <div className="col-xl-5 px-0">
        <div className="row mx-0">
          <div className="col-sm-6 px-0">
            <OrderBook ThemeColor={ThemeColor} layout={3} />
          </div>
          <div className="col-sm-6 px-0">
            <TradesHistory
              marketTrades={marketTrades}
              customClass={"spot-trade-table"}
            />
          </div>
        </div>
        <div className="row mx-0">
          <div className="col-xl-12 px-0">
            <ExchangeBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutTwo;
