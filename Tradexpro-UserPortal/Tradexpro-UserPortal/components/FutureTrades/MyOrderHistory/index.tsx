import React, { useEffect, useState } from "react";
import Position from "./position";
import {
  CROSS,
  ISOLATED,
  OPEN_ORDER,
  ORDER_HISTORY,
  POSITON,
  TRADE_HISTORY,
  TRANSACTION_HISTORY,
} from "helpers/core-constants";
import OpenOrder from "./open-order";
import OrderHistory from "./order-history";
import TradeHistory from "./trade-history";
import TransactionHistory from "./transaction-history";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import {
  getLongShortPositionOrderListAction,
  getShortLongOrderHistoryAction,
  getTradeHistoryAction,
  getTransactionHistoryAction,
  openORderFutureAction,
  orderHistoryFutureAction,
} from "state/actions/futureTrade";
import { listenMessagesFuture } from "state/actions/exchange";
import useTranslation from "next-translate/useTranslation";

const MyOrderHistory = ({ setdisableCross, setdisableIsolated }: any) => {
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const [selected, setSelected] = useState(POSITON);
  const [listData, setListData] = useState([]);
  const [tradeHistory, settradeHistory] = useState([]);
  const [transactionHistory, settransactionHistory] = useState([]);
  const [orderHistory, setorderHistory] = useState([]);
  const [openOrder, setOpenOrder] = useState([]);
  const { dashboard, currentPair } = useSelector(
    (state: RootState) => state.futureExchange
  );
  useEffect(() => {
    let disableCross = false;
    let disableIsolated = false;
    listData.map((item: any) => {
      if (item.margin_mode === ISOLATED) {
        disableCross = true;
      }
      if (item.margin_mode === CROSS) {
        disableIsolated = true;
      }
    });
    openOrder.map((item: any) => {
      if (item.margin_mode === ISOLATED) {
        disableCross = true;
      }
      if (item.margin_mode === CROSS) {
        disableIsolated = true;
      }
    });
    setdisableCross(disableCross);
    setdisableIsolated(disableIsolated);
  }, [listData, openOrder]);
  useEffect(() => {
    if (isLoggedIn) {
      listenMessagesFuture(
        setListData,
        settransactionHistory,
        setorderHistory,
        setOpenOrder
      );
    }
  }, [currentPair, isLoggedIn]);
  useEffect(() => {
    if (
      dashboard?.order_data?.base_coin_id &&
      dashboard?.order_data?.trade_coin_id &&
      isLoggedIn
    ) {
      getLongShortPositionOrderListAction(
        setListData,
        dashboard?.order_data?.base_coin_id,
        dashboard?.order_data?.trade_coin_id
      );
      getShortLongOrderHistoryAction(
        setorderHistory,
        dashboard?.order_data?.base_coin_id,
        dashboard?.order_data?.trade_coin_id
      );
      // orderHistoryFutureAction(
      //   setorderHistory,
      //   dashboard?.order_data?.base_coin_id,
      //   dashboard?.order_data?.trade_coin_id
      // );
      openORderFutureAction(
        setOpenOrder,
        dashboard?.order_data?.base_coin_id,
        dashboard?.order_data?.trade_coin_id
      );
      getTransactionHistoryAction(
        settransactionHistory,
        dashboard?.order_data?.coin_pair_id
      );
      getTradeHistoryAction(
        settradeHistory,
        dashboard?.order_data?.base_coin_id,
        dashboard?.order_data?.trade_coin_id
      );
    }
  }, [
    dashboard?.order_data?.trade_coin_id,
    dashboard?.order_data?.base_coin_id,
    dashboard?.order_data?.coin_pair_id,
    isLoggedIn,
  ]);
  return (
    <div>
      <div className="orders-area mb-0">
        <div className="orders-area-top p-10">
          <div className="top-left">
            <ul id="ordersTab" role="tablist" className="nav nav-tabs">
              <li role="presentation" className="nav-item">
                <a
                  id="Open-orders-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Open-orders"
                  aria-selected="true"
                  className={`nav-link ${selected === POSITON && "active"}`}
                  onClick={() => {
                    setSelected(POSITON);
                  }}
                >
                  {t("Position")}({listData.length})
                </a>
              </li>
              <li role="presentation" className="nav-item">
                <a
                  id="Open-orders-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Open-orders"
                  aria-selected="true"
                  className={`nav-link false ${
                    selected === OPEN_ORDER && "active"
                  }`}
                  onClick={() => {
                    setSelected(OPEN_ORDER);
                  }}
                >
                  {t("Open order")}
                </a>
              </li>
              <li role="presentation" className="nav-item">
                <a
                  id="Open-orders-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Open-orders"
                  aria-selected="true"
                  className={`nav-link false ${
                    selected === ORDER_HISTORY && "active"
                  }`}
                  onClick={() => {
                    setSelected(ORDER_HISTORY);
                  }}
                >
                  {t("Order history")}
                </a>
              </li>
              <li role="presentation" className="nav-item">
                <a
                  id="Open-orders-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Open-orders"
                  aria-selected="true"
                  className={`nav-link false ${
                    selected === TRADE_HISTORY && "active"
                  }`}
                  onClick={() => {
                    setSelected(TRADE_HISTORY);
                  }}
                >
                  {t("Trade History")}
                </a>
              </li>
              <li role="presentation" className="nav-item">
                <a
                  id="Open-orders-tab"
                  data-toggle="tab"
                  role="tab"
                  aria-controls="Open-orders"
                  aria-selected="true"
                  className={`nav-link false ${
                    selected === TRANSACTION_HISTORY && "active"
                  }`}
                  onClick={() => {
                    setSelected(TRANSACTION_HISTORY);
                  }}
                >
                  {t("Transaction History")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        {selected === POSITON && <Position listData={listData} />}
        {selected === OPEN_ORDER && <OpenOrder openOrder={openOrder} />}
        {selected === ORDER_HISTORY && (
          <OrderHistory orderHistory={orderHistory} />
        )}
        {selected === TRADE_HISTORY && (
          <TradeHistory tradeHistory={tradeHistory} />
        )}
        {selected === TRANSACTION_HISTORY && (
          <TransactionHistory transactionHistory={transactionHistory} />
        )}
      </div>
    </div>
  );
};

export default MyOrderHistory;
