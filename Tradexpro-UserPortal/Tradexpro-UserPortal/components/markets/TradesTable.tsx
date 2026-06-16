import { NoItemFound } from "components/NoItemFound/NoItemFound";
import request from "lib/request";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { getMarketsTradeSectionDataApi } from "service/markets";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import SectionLoading from "components/common/SectionLoading";
import { formatCurrency } from "common";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { MdOutlineSearch } from "react-icons/md";
import CustomDatatable from "components/CustomDatatable";
import CustomPagination from "components/Pagination/CustomPagination";
import Link from "next/link";

const tabLists = [
  {
    name: "All Cryptos",
    value: 1,
  },
  {
    name: "Spot Markets",
    value: 2,
  },
  {
    name: "Futures Markets",
    value: 3,
  },
  {
    name: "New Listing",
    value: 4,
  },
];

async function listenMessages(setUpdatedTradeData: any) {
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
  window.Echo.channel(`market-overview-top-coin-list-data`).listen(
    ".market-overview-top-coin-list",
    (e: any) => {
      if (e?.coin_pair_details === null) return;
      setUpdatedTradeData(e?.coin_pair_details);
    }
  );
}

export default function TradesTable({ selectedCurrency }: any) {
  // use
  const router = useRouter();

  const { settings } = useSelector((state: RootState) => state.common);
  const [tradeDatas, setTradeDatas] = useState<any>([]);
  const [tradeItems, setTradeItems] = useState<any>([]);
  const [selectType, setSelectType] = useState(1);
  const [updatedTradeData, setUpdatedTradeData] = useState<any>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { dashboard } = useSelector((state: RootState) => state.exchange);
  const { t } = useTranslation("common");

  const columns = [
    {
      Header: t("Market"),
      accessor: "coin_type",
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
              {row?.original?.coin_type}
            </p>
            <p className="tradex-text-sm !tradex-text-body">
              {row?.original?.base_coin_type}
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: t("Price"),
      accessor: "price",
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
      accessor: "change",
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
      Header: t("Total Coin Holding"),
      accessor: "total_balance",
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
      Header: t("Actions"),
      Cell: ({ row }: any) => (
        <Link
          href={
            router.locale !== "en"
              ? `/${router.locale}/exchange/dashboard?coin_pair=${
                  row?.original?.coin_type + "_" + row?.original?.base_coin_type
                }`
              : `/exchange/dashboard?coin_pair=${
                  row?.original?.coin_type + "_" + row?.original?.base_coin_type
                }`
          }
        >
          <a className="tradex-py-3 tradex-px-6 tradex-rounded-lg tradex-border tradex-border-primary group-hover:tradex-bg-primary group-hover:!tradex-text-white !tradex-text-title tradex-bg-transparent tradex-text-sm tradex-leading-[18px]">
            {t("Trade")}
          </a>
        </Link>
      ),
    },
  ];

  useEffect(() => {
    listenMessages(setUpdatedTradeData);
  }, []);

  useEffect(() => {
    updateTradeDataHandler();
  }, [updatedTradeData]);

  const updateTradeDataHandler = () => {
    if (Object.keys(updatedTradeData).length === 0) return;
    const updatedArray = tradeItems?.map((item: any) => {
      if (item.id === updatedTradeData?.id) {
        return { ...item, ...updatedTradeData };
      }
      return item;
    });
    if (updatedArray.length <= 0) return;
    setTradeItems(updatedArray);
  };

  useEffect(() => {
    getMarketsTradeSectionData(1);
  }, [selectType, search, selectedCurrency]);

  const getMarketsTradeSectionData = async (page: any) => {
    setLoading(true);
    const data = await getMarketsTradeSectionDataApi(
      selectedCurrency.value,
      selectType,
      search,
      page
    );
    if (!data.success) {
      toast.error(data.message);
      setLoading(false);

      return;
    }
    setTradeDatas(data.data);
    setTradeItems(data.data.data);
    setLoading(false);
  };
  const handlePageClick = (event: any) => {
    getMarketsTradeSectionData(event.selected + 1);
  };

  return (
    <section className=" tradex-container tradex-pt-[70px]">
      <div className=" tradex-space-y-10">
        <div className=" tradex-flex tradex-flex-col tradex-gap-6 md:tradex-flex-row tradex-justify-between tradex-items-center tradex-pb-4 tradex-border-b-2 tradex-border-background-primary">
          <div className=" tradex-w-full tradex-flex tradex-gap-6 tradex-items-center tradex-flex-wrap ">
            {tabLists?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectType(item?.value)}
                className={` tradex-text-base sm:tradex-text-xl sm:tradex-leading-6 tradex-text-title tradex-relative ${
                  selectType == item.value &&
                  "tradex-font-semibold after:-tradex-bottom-[8px] after:tradex-absolute md:after:-tradex-bottom-[28px] after:tradex-left-0 after:tradex-w-full after:tradex-h-[4px] after:tradex-bg-primary after:tradex-inline-block"
                } ${
                  item.value == 3 && Number(settings?.enable_future_trade) !== 1
                    ? " tradex-hidden"
                    : ""
                }  `}
              >
                {t(item?.name)}
              </button>
            ))}
          </div>
          <div className=" tradex-w-full md:tradex-w-fit tradex-flex tradex-items-center tradex-gap-2 tradex-h-11 tradex-px-3 tradex-rounded tradex-border tradex-border-background-primary">
            <MdOutlineSearch size={20} />
            <input
              type="text"
              className="!tradex-border-none !tradex-bg-transparent tradex-min-w-[195px]"
              placeholder={t("Search Coin Name")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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

      <div className="tradex-pt-8">
        {loading ? (
          <SectionLoading />
        ) : (
          <div className=" tradex-space-y-6">
            <CustomDatatable
              columns={columns}
              data={tradeItems || []}
              processing={loading}
              isSearchable={false}
              isSortEnable={false}
            />

            <CustomPagination
              per_page={tradeDatas?.per_page}
              current_page={tradeDatas?.current_page}
              total={tradeDatas.total}
              handlePageClick={handlePageClick}
            />
          </div>
        )}
      </div>
    </section>
  );
}
