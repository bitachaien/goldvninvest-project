import { formatCurrency } from "common";
import CustomDatatable from "components/CustomDatatable";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import request from "lib/request";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getExchangeMarketDetails } from "service/futureTrade";
import { listenMessagesFutureMarketData } from "state/actions/exchange";
import { RootState } from "state/store";

const tabLists = [
  {
    name: "Core Assets",
    value: "assets",
  },
  {
    name: "24H Gainers",
    value: "hour",
  },
  {
    name: "New Listings",
    value: "new",
  },
];

export default function TradeSections() {
  const [tradeDatas, setTradeDatas] = useState<any>([]);
  const { settings } = useSelector((state: RootState) => state.common);
  const [selectType, setSelectType] = useState("assets");
  const { dashboard } = useSelector((state: RootState) => state.exchange);
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    getTradeSectionData();
  }, [selectType]);

  const columns = [
    {
      Header: t("Market"),
      accessor: "child_coin_name",
      Cell: ({ row }: any) => (
        <div className=" tradex-flex tradex-gap-3 tradex-items-center">
          <div className="tradex-min-w-[34px]">
            <img
              className=" tradex-max-w-[34px] tradex-max-h-[34px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
              src={row?.original?.coin_icon || "/bitcoin.png"}
              alt=""
            />
          </div>
          <div>
            <p className="tradex-text-base tradex-font-medium !tradex-text-title">
              {row?.original?.child_coin_name}
            </p>
            <p className="tradex-text-sm !tradex-text-body">
              {row?.original?.parent_coin_name}
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: t("Price"),
      accessor: "last_price",
      Cell: ({ cell }: any) => (
        <p className="tradex-text-base tradex-font-medium !tradex-text-title">
          $
          {formatCurrency(
            cell?.value,
            dashboard?.order_data?.total?.trade_wallet?.pair_decimal
          )}
        </p>
      ),
    },
    {
      Header: t("Change (24h)"),
      accessor: "price_change",
      Cell: ({ cell }: any) => (
        <span
          className={`tradex-text-base tradex-font-medium ${
            parseFloat(cell?.value) >= 0
              ? " tradex-text-green-600"
              : "tradex-text-red-600"
          } `}
        >
          {formatCurrency(
            cell?.value,
            dashboard?.order_data?.total?.trade_wallet?.pair_decimal
          )}
          %
        </span>
      ),
    },
    {
      Header: t("Volume"),
      accessor: "volume",
      Cell: ({ cell }: any) => (
        <p className="tradex-text-base tradex-font-medium !tradex-text-title">
          $
          {formatCurrency(
            cell?.value,
            dashboard?.order_data?.total?.trade_wallet?.pair_decimal
          )}
        </p>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div
          onClick={async () => {
            await localStorage.setItem(
              "base_coin_id",
              row?.original?.parent_coin_id
            );
            await localStorage.setItem(
              "trade_coin_id",
              row?.original?.child_coin_id
            );
            await localStorage.setItem(
              "current_pair",
              row?.original?.child_coin_name +
                "_" +
                row?.original?.parent_coin_name
            );
            await localStorage.setItem(
              "coin_pair_id",
              row?.original?.coin_pair_id
            );
          }}
        >
          <Link
            href={
              router.locale !== "en"
                ? `/${router.locale}/futures/exchange`
                : "/futures/exchange"
            }
          >
            <a className="tradex-py-3 tradex-px-6 tradex-rounded-lg tradex-border tradex-border-primary group-hover:tradex-bg-primary group-hover:!tradex-text-white !tradex-text-title tradex-bg-transparent tradex-text-sm tradex-leading-[18px]">
              Trade
            </a>
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    listenMessagesFutureMarketData(setTradeDatas);
  }, []);
  const getTradeSectionData = async () => {
    const data: any = await getExchangeMarketDetails(selectType);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setTradeDatas(data.data);
  };

  return (
    <div className="tradex-pt-[70px]">
      <div className=" tradex-space-y-10">
        <div className=" tradex-flex tradex-flex-col tradex-gap-6 md:tradex-flex-row tradex-justify-between tradex-items-center tradex-pb-4 tradex-border-b-2 tradex-border-background-primary">
          <div className=" tradex-w-full tradex-flex tradex-gap-6 tradex-items-center tradex-flex-wrap ">
            {tabLists?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectType(item?.value)}
                className={` tradex-text-base sm:tradex-text-xl sm:tradex-leading-6 tradex-text-title tradex-relative ${
                  selectType == item.value &&
                  "tradex-font-semibold after:-tradex-bottom-[8px] after:tradex-absolute md:after:-tradex-bottom-[18px] after:tradex-left-0 after:tradex-w-full after:tradex-h-[4px] after:tradex-bg-primary after:tradex-inline-block"
                }`}
              >
                {t(item?.name)}
              </button>
            ))}
          </div>
        </div>
        <div className=" tradex-space-y-3">
          <h3 className=" !tradex-text-title tradex-text-xl sm:tradex-text-[28px] sm:tradex-leading-8 tradex-font-bold">
            {settings?.app_title}
            {t("Market Watch")}
          </h3>
          <p className=" tradex-text-sm sm:tradex-text-xl sm:tradex-leading-6 !tradex-text-body">
            {t("Find Promising Coin and great opportunities")}
          </p>
        </div>
      </div>
      <div className=" tradex-pt-8">
        <CustomDatatable
          columns={columns}
          data={tradeDatas?.coins || []}
          processing={false}
          isSearchable={false}
          isSortEnable={false}
        />
      </div>
    </div>
  );
}
