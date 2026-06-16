import Link from "next/link";
import router from "next/router";
import React from "react";

export const TradeList = ({ coinList }: any) => {
  return (
    <div className="tradeList">
      {coinList?.map((item: any, index: number) => (
        <div
          onClick={async () => {
            await localStorage.setItem("base_coin_id", item?.parent_coin_id);
            await localStorage.setItem("trade_coin_id", item?.child_coin_id);
            await localStorage.setItem(
              "current_pair",
              item?.child_coin_name + "_" + item?.parent_coin_name
            );
          }}
          key={`coinList${index}`}
          className="coinList"
        >
          <img src={item.icon} alt="" />
          <Link
            href={
              router.locale !== "en"
                ? `/${router.locale}/exchange/dashboard?coin_pair=${
                    item?.child_coin_name + "_" + item?.parent_coin_name
                  }`
                : `/exchange/dashboard?coin_pair=${
                    item?.child_coin_name + "_" + item?.parent_coin_name
                  }`
            }
          >
            {item.coin_pair_name}
          </Link>
        </div>
      ))}
    </div>
  );
};
