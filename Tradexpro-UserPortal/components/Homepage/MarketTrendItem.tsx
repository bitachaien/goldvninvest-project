import { formatCurrency } from "common";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function MarketTrendItem({ item }: any) {
  const { dashboard, currentPair } = useSelector(
    (state: RootState) => state.exchange
  );
  return (
    <div
      className=" tradex-flex tradex-items-center tradex-gap-3 tradex-h-[64px] tradex-cursor-pointer"
      key={item?.id}
    >
      <img
        src={item?.coin_icon || "/bitcoin.png"}
        alt=""
        className=" tradex-w-7 tradex-h-7 tradex-min-h-7 tradex-min-w-7 tradex-rounded-[28px] tradex-object-cover tradex-shrink-0"
      />
      <div className="tradex-flex-1">
        <div className="tradex-text-lg tradex-font-medium tradex-leading-[130%] tradex-text-title">
          {item?.child_coin_name}
        </div>
        <div className=" tradex-text-sm tradex-leading-[130%] tradex-text-primary-three">
          {item?.child_full_name}
        </div>
      </div>
      <div className=" tradex-flex tradex-flex-col gap-y-0.5 tradex-flex-1 tradex-items-end">
        <div className="tradex-text-base tradex-font-medium tradex-leading-[130%] tradex-text-title tradex-whitespace-nowrap">
          <span>
            $
            {formatCurrency(
              item.last_price,
              dashboard?.order_data?.total?.trade_wallet?.pair_decimal
            )}
          </span>
        </div>
        <div
          className={`tradex-text-base tradex-font-medium tradex-leading-[130%]  ${
            parseFloat(item.price_change) >= 0
              ? "tradex-text-primary"
              : "tradex-text-red-600"
          } tradex-text-right`}
        >
          <span>
            {formatCurrency(
              item.price_change,
              dashboard?.order_data?.total?.trade_wallet?.pair_decimal
            )}
            %
          </span>
        </div>
      </div>
    </div>
  );
}
