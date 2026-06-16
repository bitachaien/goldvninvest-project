import Echo from "laravel-echo";
import Pusher from "pusher-js";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";
import MarketTrendItem from "./MarketTrendItem";
import { formatCurrency } from "common";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
let socketCall = 0;

async function listenMessages(
  setLocalAssetCoinPairs: any,
  setLocalHourlyCoinPairs: any,
  setLocalLatestCoinPairs: any
) {
  //@ts-ignore
  window.Pusher = Pusher;
  //@ts-ignore
  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "test",
    wsHost: process.env.NEXT_PUBLIC_HOST_SOCKET,
    wsPort: process.env.NEXT_PUBLIC_WSS_PORT
      ? process.env.NEXT_PUBLIC_WSS_PORT
      : 6006,
    wssPort: 443,
    forceTLS: false,
    cluster: "mt1",
    disableStats: true,
    enabledTransports: ["ws", "wss"],
  });
  //@ts-ignore
  window.Echo.channel(`market-coin-pair-data`).listen(
    ".market-coin-pairs",
    (e: any) => {
      e.asset_coin_pairs.length && setLocalAssetCoinPairs(e.asset_coin_pairs);
      e.hourly_coin_pairs.length &&
        setLocalHourlyCoinPairs(e.hourly_coin_pairs);
      e.latest_coin_pairs.length &&
        setLocalLatestCoinPairs(e.latest_coin_pairs);
    }
  );
}
const MarketTrends = ({
  landing,
  asset_coin_pairs,
  hourly_coin_pairs,
  latest_coin_pairs,
}: any) => {
  const { dashboard, currentPair } = useSelector(
    (state: RootState) => state.exchange
  );
  const { t } = useTranslation("common");
  const [localAssetCoinPairs, setLocalAssetCoinPairs] = React.useState<any>(
    asset_coin_pairs || []
  );
  const [localHourlyCoinPairs, setLocalHourlyCoinPairs] = React.useState<any>(
    hourly_coin_pairs || []
  );
  const [localLatestCoinPairs, setLocalLatestCoinPairs] = React.useState<any>(
    latest_coin_pairs || []
  );
  const router = useRouter();
  useEffect(() => {
    if (socketCall === 0) {
      listenMessages(
        setLocalAssetCoinPairs,
        setLocalHourlyCoinPairs,
        setLocalLatestCoinPairs
      );
    }
    socketCall = 1;
  });

  return (
    <>
      {parseInt(landing?.landing_third_section_status) === 1 && (
        <section className="tradex-pt-[60px] md:tradex-pt-[120px] tradex-relative tradex-z-10">
          <div className="tradex-container tradex-space-y-6 md:tradex-space-y-10">
            <div className=" tradex-flex tradex-justify-between tradex-items-center">
              <h3 className=" tradex-text-[24px] tradex-leading-[32px] md:tradex-text-[32px] md:tradex-leading-[48px] xl:tradex-text-[48px] xl:tradex-leading-[60px] !tradex-text-title tradex-font-bold">
                {landing?.market_trend_title || t("Crypto Market Trend")}
              </h3>
              <Link href={`/markets`}>
                <a className=" tradex-px-3 tradex-py-2 md:tradex-py-4 md:tradex-px-6 tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-base md:tradex-leading-6 tradex-font-semibold !tradex-text-title tradex-border tradex-border-title tradex-rounded-lg hover:tradex-bg-primary hover:!tradex-text-white hover:tradex-border-primary">
                  <span>{t("See More")}</span>
                  <span>
                    <FaArrowRight className=" tradex-w-3 md:tradex-w-[14px]" />
                  </span>
                </a>
              </Link>
            </div>

            <div className=" tradex-grid tradex-grid-cols-1 xl:tradex-grid-cols-3 tradex-gap-6 tradex-min-h-[600px]">
              <div className=" xl:tradex-col-span-2 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-h-full tradex-pt-6 tradex-px-4 tradex-pb-4 tradex-space-y-6">
                <div className="tradex-pb-4 tradex-border-b tradex-border-background-primary">
                  <h4 className=" tradex-text-sm md:tradex-text-2xl md:tradex-leading-[30px] !tradex-text-title tradex-font-medium">
                    {t("Core Assets")}
                  </h4>
                </div>
                <div className="tradex-max-h-[600px] tradex-overflow-y-auto tradex-overflow-x-auto">
                  {localAssetCoinPairs?.length > 0 ? (
                    <table className=" tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                      <thead>
                        <tr>
                          <th className="text-xs tradex-text-nowrap md:tradex-text-base md:tradex-leading-5 !tradex-text-title tradex-font-normal">
                            {t("Market")}
                          </th>
                          <th className="text-xs tradex-text-nowrap md:tradex-text-base md:tradex-leading-5 !tradex-text-title tradex-font-normal tradex-text-center">
                            {t("Last Traded Price")}
                          </th>
                          <th className="text-xs tradex-text-nowrap md:tradex-text-base md:tradex-leading-5 !tradex-text-title tradex-font-normal tradex-text-center">
                            {t("Chang(24H)")}
                          </th>
                          <th className="text-xs tradex-text-nowrap md:tradex-text-base md:tradex-leading-5 !tradex-text-title tradex-font-normal tradex-px-2">
                            {t("Actions")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {localAssetCoinPairs?.map((item: any, index: any) => (
                          <tr
                            key={item?.id}
                            className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                          >
                            <td
                              className={` ${
                                index + 1 != localAssetCoinPairs?.length &&
                                "tradex-border-b"
                              } group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-px-2 tradex-text-nowrap`}
                            >
                              <div className=" tradex-flex tradex-gap-3 tradex-items-center">
                                <div className="tradex-min-w-[34px]">
                                  <img
                                    className=" tradex-max-w-[34px] tradex-max-h-[34px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
                                    src={item?.coin_icon || "/bitcoin.png"}
                                    alt=""
                                  />
                                </div>
                                <div>
                                  <p className="tradex-text-base tradex-font-medium !tradex-text-title">
                                    {item?.child_coin_name}
                                  </p>
                                  <p className="tradex-text-sm !tradex-text-body">
                                    {item?.child_full_name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td
                              className={`${
                                index + 1 != localAssetCoinPairs?.length &&
                                "tradex-border-b"
                              } group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap tradex-text-center`}
                            >
                              <p className="tradex-text-base tradex-font-medium !tradex-text-title">
                                $
                                {formatCurrency(
                                  item.last_price,
                                  dashboard?.order_data?.total?.trade_wallet
                                    ?.pair_decimal
                                )}
                              </p>
                            </td>
                            <td
                              className={`${
                                index + 1 != localAssetCoinPairs?.length &&
                                "tradex-border-b"
                              }  group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap tradex-text-center`}
                            >
                              <p
                                className={`tradex-text-base tradex-font-medium ${
                                  parseFloat(item.price_change) >= 0
                                    ? "tradex-text-green-600"
                                    : "tradex-text-red-600"
                                }`}
                              >
                                {formatCurrency(
                                  item.price_change,
                                  dashboard?.order_data?.total?.trade_wallet
                                    ?.pair_decimal
                                )}
                                %
                              </p>
                            </td>
                            <td
                              className={`${
                                index + 1 != localAssetCoinPairs?.length &&
                                "tradex-border-b"
                              } group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap`}
                            >
                              <Link
                                href={
                                  router.locale !== "en"
                                    ? `/${
                                        router.locale
                                      }/exchange/dashboard?coin_pair=${
                                        item?.child_coin_name +
                                        "_" +
                                        item?.parent_coin_name
                                      }`
                                    : `/exchange/dashboard?coin_pair=${
                                        item?.child_coin_name +
                                        "_" +
                                        item?.parent_coin_name
                                      }`
                                }
                              >
                                <a className="tradex-py-3 tradex-px-6 tradex-rounded-lg tradex-border tradex-border-primary group-hover:tradex-bg-primary group-hover:!tradex-text-white !tradex-text-title tradex-bg-transparent tradex-text-sm tradex-leading-[18px]">
                                  {t("Trade")}
                                </a>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="tradex-text-lg tradex-font-medium tradex-text-body tradex-min-h-[550px] tradex-flex tradex-justify-center tradex-items-center">
                      {t("No Item Found")}
                    </p>
                  )}
                </div>
              </div>
              <div className=" md:tradex-grid xl:tradex-block tradex-grid-cols-2 xl:tradex-grid-cols-1 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-h-full tradex-pt-6 tradex-px-4 tradex-pb-4 xl:tradex-space-y-4">
                <div>
                  <div className="tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h4 className=" tradex-text-sm md:tradex-text-2xl md:tradex-leading-[30px] !tradex-text-title tradex-font-medium">
                      {t("24H Gainers")}
                    </h4>
                  </div>
                  <div className=" tradex-max-h-[250px] tradex-overflow-y-auto tradex-overflow-x-auto">
                    {localHourlyCoinPairs?.length > 0 ? (
                      <table className=" tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <tbody>
                          {localHourlyCoinPairs?.map(
                            (item: any, index: any) => (
                              <tr
                                key={item?.id}
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                              >
                                <td
                                  className={` ${
                                    index + 1 != localHourlyCoinPairs?.length &&
                                    "tradex-border-b"
                                  } group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-px-2 tradex-text-nowrap`}
                                >
                                  <div className=" tradex-flex tradex-gap-3 tradex-items-center">
                                    <div className="tradex-min-w-[34px]">
                                      <img
                                        className=" tradex-max-w-[34px] tradex-max-h-[34px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
                                        src={item?.coin_icon || "/bitcoin.png"}
                                        alt=""
                                      />
                                    </div>
                                    <div>
                                      <p className="tradex-text-base tradex-font-medium !tradex-text-title">
                                        {item?.child_coin_name}
                                      </p>
                                      <p className="tradex-text-sm !tradex-text-body">
                                        {item?.child_full_name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={`${
                                    index + 1 != localHourlyCoinPairs?.length &&
                                    "tradex-border-b"
                                  } group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap tradex-text-center`}
                                >
                                  <p className="tradex-text-base tradex-font-medium !tradex-text-title">
                                    $
                                    {formatCurrency(
                                      item.last_price,
                                      dashboard?.order_data?.total?.trade_wallet
                                        ?.pair_decimal
                                    )}
                                  </p>
                                </td>
                                <td
                                  className={`${
                                    index + 1 != localHourlyCoinPairs?.length &&
                                    "tradex-border-b"
                                  }  group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap tradex-text-center`}
                                >
                                  <p
                                    className={`tradex-text-base tradex-font-medium ${
                                      parseFloat(item.price_change) >= 0
                                        ? "tradex-text-green-600"
                                        : "tradex-text-red-600"
                                    }`}
                                  >
                                    {formatCurrency(
                                      item.price_change,
                                      dashboard?.order_data?.total?.trade_wallet
                                        ?.pair_decimal
                                    )}
                                    %
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p className="tradex-text-lg tradex-font-medium tradex-text-body tradex-min-h-[200px] tradex-flex tradex-justify-center tradex-items-center">
                        {t("No Item Found")}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <div className="tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h4 className=" tradex-text-sm md:tradex-text-2xl md:tradex-leading-[30px] !tradex-text-title tradex-font-medium">
                      {t("New Listings")}
                    </h4>
                  </div>
                  <div className=" tradex-max-h-[250px] tradex-overflow-y-auto tradex-overflow-x-auto">
                    {localLatestCoinPairs?.length > 0 ? (
                      <table className=" tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
                        <tbody>
                          {localLatestCoinPairs?.map(
                            (item: any, index: any) => (
                              <tr
                                key={item?.id}
                                className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                              >
                                <td
                                  className={` ${
                                    index + 1 != localLatestCoinPairs?.length &&
                                    "tradex-border-b"
                                  } group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-px-2 tradex-text-nowrap`}
                                >
                                  <div className=" tradex-flex tradex-gap-3 tradex-items-center">
                                    <div className="tradex-min-w-[34px]">
                                      <img
                                        className=" tradex-max-w-[34px] tradex-max-h-[34px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
                                        src={item?.coin_icon || "/bitcoin.png"}
                                        alt=""
                                      />
                                    </div>
                                    <div>
                                      <p className="tradex-text-base tradex-font-medium !tradex-text-title">
                                        {item?.child_coin_name}
                                      </p>
                                      <p className="tradex-text-sm !tradex-text-body">
                                        {item?.child_full_name}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td
                                  className={`${
                                    index + 1 != localLatestCoinPairs?.length &&
                                    "tradex-border-b"
                                  } group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap tradex-text-center`}
                                >
                                  <p className="tradex-text-base tradex-font-medium !tradex-text-title">
                                    $
                                    {formatCurrency(
                                      item.last_price,
                                      dashboard?.order_data?.total?.trade_wallet
                                        ?.pair_decimal
                                    )}
                                  </p>
                                </td>
                                <td
                                  className={`${
                                    index + 1 != localLatestCoinPairs?.length &&
                                    "tradex-border-b"
                                  }  group-hover:tradex-border-b-0 tradex-border-background-primary tradex-py-3 tradex-px-2 tradex-text-nowrap tradex-text-center`}
                                >
                                  <p
                                    className={`tradex-text-base tradex-font-medium  ${
                                      parseFloat(item.price_change) >= 0
                                        ? "tradex-text-green-600"
                                        : "tradex-text-red-600"
                                    }`}
                                  >
                                    {formatCurrency(
                                      item.price_change,
                                      dashboard?.order_data?.total?.trade_wallet
                                        ?.pair_decimal
                                    )}
                                    %
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p className="tradex-text-lg tradex-font-medium tradex-text-body tradex-min-h-[200px] tradex-flex tradex-justify-center tradex-items-center">
                        {t("No Item Found")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default MarketTrends;
