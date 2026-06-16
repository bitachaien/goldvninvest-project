import { formatCurrency } from "common";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

import AllSellOrdersFull from "../AllSellOrdersFull";
import AllBuyOrdersFull from "../AllBuyOrdersFull";
import AllSellOrders from "../AllSellOrders";
import AllBuyOrders from "../AllBuyOrders";
import { EXCHANGE_LAYOUT_THREE } from "helpers/core-constants";
import OrderBookPriceLabel from "./OrderBookPriceLabel";

export default function OrderBook({ ThemeColor, layout = 0 }: any) {
  const allSellOrdersFullCls =
    layout === EXCHANGE_LAYOUT_THREE ? "buy-sell-order-max-h" : "";
  const allBuyOrdersFullCls =
    layout === EXCHANGE_LAYOUT_THREE ? "buy-sell-order-max-h" : "";
  const allSellOrdersCls =
    layout === EXCHANGE_LAYOUT_THREE ? "trade-order-dash-h" : "";
  const allBuyOrdersCls =
    layout === EXCHANGE_LAYOUT_THREE ? "trade-order-dash-h" : "";

  const [select, setSelect] = React.useState(3);
  const { dashboard, OpenBookBuy, OpenBooksell, currentPair } = useSelector(
    (state: RootState) => state.exchange
  );

  const { t } = useTranslation();
  return (
    <div className="trades-section">
      <div>
        <h6 className="text-white">{t("Order Book")}</h6>
      </div>
      <div className="trades-headers">
        <div className="orderBookIcons">
          <h3
            onClick={() => {
              setSelect(2);
            }}
            className="icon-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="css-3kwgah w-25"
            >
              <path d="M4 4h7v16H4V4z" fill={ThemeColor.green}></path>
              <path
                d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                fill="currentColor"
              ></path>
            </svg>
          </h3>
          <h3
            onClick={() => {
              setSelect(1);
            }}
            className="icon-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="css-3kwgah  w-25"
            >
              <path d="M4 4h7v16H4V4z" fill={ThemeColor.red}></path>
              <path
                d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                fill="currentColor"
              ></path>
            </svg>
          </h3>
          <h3
            onClick={() => {
              setSelect(3);
            }}
            className="icon-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="css-3kwgah w-25"
            >
              <path d="M4 4h7v7H4V4z" fill={ThemeColor.red}></path>
              <path d="M4 13h7v7H4v-7z" fill={ThemeColor.green}></path>
              <path
                d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                fill="currentColor"
              ></path>
            </svg>
          </h3>
        </div>
      </div>
      {select === 1 && (
        <>
          <AllSellOrdersFull
            OpenBooksell={OpenBooksell}
            customClass={allSellOrdersFullCls}
            show={100}
          />

          <OrderBookPriceLabel
            prevPrice={
              dashboard?.last_price_data
                ? dashboard?.last_price_data[0]?.last_price
                : 0
            }
            lastPrice={
              dashboard?.last_price_data
                ? dashboard?.last_price_data[0]?.price
                : 0
            }
          />
        </>
      )}
      {select === 2 && (
        <>
          <OrderBookPriceLabel
            prevPrice={
              dashboard?.last_price_data
                ? dashboard?.last_price_data[0]?.last_price
                : 0
            }
            lastPrice={
              dashboard?.last_price_data
                ? dashboard?.last_price_data[0]?.price
                : 0
            }
          />
          <AllBuyOrdersFull
            buy={OpenBookBuy}
            show={100}
            customClass={allBuyOrdersFullCls}
          />
        </>
      )}
      {select === 3 && (
        <div className="tradeSection-both">
          <AllSellOrders
            OpenBooksell={OpenBooksell}
            show={18}
            customClass={allSellOrdersCls}
          />

          <OrderBookPriceLabel
            prevPrice={
              dashboard?.last_price_data
                ? dashboard?.last_price_data[0]?.last_price
                : 0
            }
            lastPrice={
              dashboard?.last_price_data
                ? dashboard?.last_price_data[0]?.price
                : 0
            }
          />
          <AllBuyOrders
            OpenBookBuy={OpenBookBuy}
            show={18}
            customClass={allBuyOrdersCls}
          />
        </div>
      )}
    </div>
  );
}
