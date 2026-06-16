import { formatCurrency } from "common";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function MarketsCardItem({ item }: any) {
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  return (
    <div className=" tradex-grid tradex-grid-cols-3 tradex-gap-4 tradex-items-center">
      <div className=" tradex-flex tradex-items-center tradex-gap-2">
        <div className=" tradex-min-w-[18px]">
          <img
            className=" tradex-w-[18px] tradex-h-[18px] tradex-max-w-[18px] tradex-max-h-[18px] tradex-object-cover tradex-object-center"
            src={item?.coin_icon || "/bitcoin.png"}
            alt="coin"
          />
        </div>
        <p className="tradex-text-sm tradex-text-body">{item?.coin_type}</p>
      </div>

      <div>
        <p className="tradex-text-sm tradex-text-body">
          {item?.currency_symbol}

          {formatCurrency(
            item.usdt_price,
            dashboard?.order_data?.total?.trade_wallet?.pair_decimal
          )}
        </p>
      </div>
      <div>
        <p
          className={`${
            parseFloat(item?.change) >= 0
              ? "tradex-text-green-600"
              : "tradex-text-red-600"
          } !tradex-text-sm`}
        >
          {item?.change >= 0
            ? "+" +
              formatCurrency(
                item.change,
                dashboard?.order_data?.total?.trade_wallet?.pair_decimal
              )
            : formatCurrency(
                item.change,
                dashboard?.order_data?.total?.trade_wallet?.pair_decimal
              )}
        </p>
      </div>
    </div>
  );
}
