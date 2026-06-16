import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import OpenOrders from "./openOrders";
import OrderHistory from "./orderHistory";
import TradeOrder from "./tradeOrder";
import UserTradeOrder from "./UserTradeOrder";
import StopLimitOrders from "./StopLimitOrders";

const OrderHistorySection = ({ bottom }: any) => {
  type activeTabType = {
    openOrders: boolean;
    orderHistory: boolean;
    tradeOrder: boolean;
    stopLimitOrder: boolean;
  };
  const [activeTab, setActiveTab] = useState<activeTabType>({
    openOrders: true,
    orderHistory: false,
    tradeOrder: false,
    stopLimitOrder: false,
  });
  const { t } = useTranslation("common");
  const {
    dashboard,
    currentPair,
    openOrderHistory,
    sellOrderHistory,
    buyOrderHistory,
    tradeOrderHistory,
    stopLimitOrders,
  } = useSelector((state: RootState) => state.exchange);

  React.useEffect(() => {
    return () => {};
  }, [currentPair, dashboard]);
  return (
    <div className={`orders-area p-10`}>
      <div className="orders-area-top p-0 mb-2">
        <div className="top-left">
          <ul id="ordersTab" role="tablist" className="nav nav-tabs">
            <li
              role="presentation"
              className="nav-item"
              onClick={() => {
                setActiveTab({
                  openOrders: true,
                  orderHistory: false,
                  tradeOrder: false,
                  stopLimitOrder: false,
                });
              }}
            >
              <a
                id="Open-orders-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="Open-orders"
                aria-selected="true"
                className={"nav-link " + (activeTab.openOrders && "active")}
              >
                {t("Open orders")}
              </a>
            </li>
            <li
              role="presentation"
              className="nav-item"
              onClick={() => {
                setActiveTab({
                  openOrders: false,
                  orderHistory: true,
                  tradeOrder: false,
                  stopLimitOrder: false,
                });
              }}
            >
              <a
                id="Open-orders-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="Open-orders"
                aria-selected="true"
                className={"nav-link " + (activeTab.orderHistory && "active")}
              >
                {t("Order history")}
              </a>
            </li>
            <li
              role="presentation"
              className="nav-item"
              onClick={() => {
                setActiveTab({
                  openOrders: false,
                  orderHistory: false,
                  tradeOrder: true,
                  stopLimitOrder: false,
                });
              }}
            >
              <a
                id="Open-orders-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="Open-orders"
                aria-selected="true"
                className={"nav-link " + (activeTab.tradeOrder && "active")}
              >
                {t("Trade history")}
              </a>
            </li>
            <li
              role="presentation"
              className="nav-item"
              onClick={() => {
                setActiveTab({
                  openOrders: false,
                  orderHistory: false,
                  tradeOrder: false,
                  stopLimitOrder: true,
                });
              }}
            >
              <a
                id="Open-orders-tab"
                data-toggle="tab"
                role="tab"
                aria-controls="Open-orders"
                aria-selected="true"
                className={"nav-link " + (activeTab.stopLimitOrder && "active")}
              >
                {t("Stop limit orders")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="tab-content" id="ordersTabContent">
        <OpenOrders
          openOrders={activeTab.openOrders}
          openOrderHistory={openOrderHistory}
        />
        <OrderHistory
          orderHistory={activeTab.orderHistory}
          sellOrderHistoryState={sellOrderHistory}
          buyOrderHistoryState={buyOrderHistory}
        />
        {/* <UserTradeOrder
          tradeOrder={activeTab.tradeOrder}
          tradeOrderHistory={tradeOrderHistory}
        /> */}
        <TradeOrder
          tradeOrder={activeTab.tradeOrder}
          tradeOrderHistory={tradeOrderHistory}
        />
        <StopLimitOrders
          isOpen={activeTab.stopLimitOrder}
          orderHistory={stopLimitOrders}
        />
      </div>
    </div>
  );
};

export default OrderHistorySection;
