import { formatCurrency } from "common";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function OrderBookPriceLabel({ prevPrice, lastPrice }: any) {
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  return (
    <div className="trades-table-footer">
      <div className="trades-table-row">
        <span
          className={
            parseFloat(lastPrice) >= parseFloat(prevPrice)
              ? "value-increase"
              : "value-decrease"
          }
        >
          {lastPrice
            ? formatCurrency(
                lastPrice,
                dashboard?.order_data?.total?.trade_wallet?.pair_decimal
              )
            : 0}

          {parseFloat(lastPrice) >= parseFloat(prevPrice) ? (
            <i className="fa-solid fa-up-long value-increaseicon ml-2"></i>
          ) : (
            <i className="fa-solid fa-down-long value-decreaseicon ml-2"></i>
          )}
        </span>
        <span className="value-previous">
          {" "}
          {prevPrice
            ? formatCurrency(
                prevPrice,
                dashboard?.order_data?.total?.trade_wallet?.pair_decimal
              )
            : 0}
          ({dashboard?.order_data?.base_coin})
        </span>
      </div>
    </div>
  );
}
