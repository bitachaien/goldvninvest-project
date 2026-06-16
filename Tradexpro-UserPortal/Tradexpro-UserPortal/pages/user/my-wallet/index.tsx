import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { TiArrowRepeat } from "react-icons/ti";
import ReactPaginate from "react-paginate";

import {
  HiOutlineBanknotes,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";

import {
  SearchObjectArrayFuesJS,
  WalletListApiAction,
} from "state/actions/wallet";
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { TradeList } from "components/TradeList";
import { appDashboardDataWithoutPair } from "service/exchange";
import Footer from "components/common/footer";
import DataTable from "components/Datatable";
import WalletOverviewSidebar from "layout/WalletOverviewSidebar";
import WalletOverviewHeader from "components/wallet-overview/WalletOverviewHeader";
import { useRouter } from "next/router";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { getTotalWalletBalanceApi } from "service/wallet";
import SectionLoading from "components/common/SectionLoading";
import WalletLayout from "components/wallet/WalletLayout";
import CustomDatatable from "components/CustomDatatable";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
const MyWallet: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);
  const [search, setSearch] = useState<any>("");
  const [walletList, setWalletList] = useState<any>([]);
  const [selectedPerPage, setSelectedPerPage] = useState("15");
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [allData, setAllData] = useState<any>();
  const [tradeList, setTradeList]: any = useState();
  const [coinList, setCoinList]: any = useState([]);
  const [totalBalance, setTotalBalance] = useState<any>(0);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [loadingForTotalBalance, setLoadingForTotalBalance] = useState(false);

  useEffect(() => {
    if (router.query.errorMessage) {
      toast.error(router.query.errorMessage);
      const { pathname, query } = router;
      delete query.errorMessage;
      router.replace(
        {
          pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.errorMessage]);
  const columns = [
    {
      Header: t("Asset"),

      Cell: ({ row }: any) => (
        <div className=" tradex-flex tradex-items-center tradex-gap-2">
          <div className="tradex-min-w-[27px]">
            <img
              className=" tradex-max-w-[27px] tradex-max-h-[27px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
              src={row.original.coin_icon || "/bitcoin.png"}
              alt=""
              width={27}
              height={27}
            />
          </div>
          <div className=" tradex-space-y-0.5">
            <p className=" tradex-text-sm tradex-leading-4 tradex-font-medium !tradex-text-title">
              {row.original?.name}
            </p>
            <p className="tradex-text-xs tradex-leading-4 !tradex-text-body">
              {row.original?.coin_type}
            </p>
          </div>
        </div>
      ),
    },

    {
      Header: t("On Order"),
      Cell: ({ row }: any) => (
        <div className=" tradex-space-y-1">
          <p className=" tradex-text-xs tradex-text-green-600 ">
            {row?.original?.on_order}
          </p>
          <p className="tradex-text-sm tradex-leading-4 !tradex-text-body">
            ({settings?.currency_symbol}
            {parseFloat(row?.original?.on_order_usd).toFixed(8)})
          </p>
        </div>
      ),
    },
    {
      Header: t("Available Balance"),
      Cell: ({ row }: any) => (
        <div className="tradex-space-y-1">
          <p className=" tradex-text-xs tradex-text-green-600 ">
            {parseFloat(row?.original?.balance).toFixed(8)}
          </p>
          <p className="tradex-text-sm tradex-leading-4 !tradex-text-body">
            ({settings?.currency_symbol}
            {parseFloat(row?.original?.available_balance_usd).toFixed(8)})
          </p>
        </div>
      ),
    },
    {
      Header: t("Total Balance"),
      Cell: ({ row }: any) => (
        <div className="tradex-space-y-1">
          <p className=" tradex-text-xs tradex-text-green-600 ">
            {/* @ts-ignore */}
            {parseFloat(
              // @ts-ignore
              Number(row?.original?.balance) + Number(row?.original?.on_order)
            ).toFixed(8)}
          </p>
          <p className="tradex-text-sm tradex-leading-4 !tradex-text-body">
            ({settings?.currency_symbol}
            {parseFloat(row?.original?.total_balance_usd).toFixed(8)})
          </p>
        </div>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className="active-link">
          <ul className=" tradex-flex tradex-items-center">
            {row?.original.is_deposit === 1 && (
              <Link href={setDepositCryptoOrFiatUrl(row?.original)}>
                <li
                  className="toolTip relative cursor-pointer after:!tradex-text-white"
                  title="Deposit"
                >
                  <HiOutlineBanknotes size={18} />
                </li>
              </Link>
            )}
            {row?.original.is_withdrawal === 1 && (
              <Link href={setWithdrawCryptoOrFiatUrl(row?.original)}>
                <li
                  className="toolTip relative cursor-pointer after:!tradex-text-white"
                  title="Withdraw"
                >
                  <IoWalletOutline size={18} />
                </li>
              </Link>
            )}

            <li
              className="toolTip trade-li cursor-pointer after:!tradex-text-white"
              title="Trade"
              onClick={() =>
                handleActive(tradeList ? null : row?.original?.id + 1)
              }
            >
              <HiOutlinePresentationChartLine size={18} />
              {tradeList === row?.original?.id + 1 && (
                <div className="trade-select">
                  <TradeList coinList={coinList.pairs} />
                </div>
              )}
            </li>
            {/* {parseInt(settings?.swap_status) === 1 &&
              (Changeable.length >= 2 ? (
                <Link href={`/user/swap-coin?coin_id=${row?.original.id}`}>
                  <li className="toolTip relative cursor-pointer" title="swap">
                    <TiArrowRepeat size={25} />
                  </li>
                </Link>
              ) : (
                <li
                  className="toolTip relative cursor-pointer"
                  title="swap"
                  onClick={() => {
                    toast.error("Two coins are required to swap");
                  }}
                >
                  <TiArrowRepeat size={25} />
                </li>
              ))} */}
            {parseInt(settings?.swap_status) === 1 && (
              <Link href={`/user/swap-coin?coin_id=${row?.original.id}`}>
                <li
                  className="toolTip relative cursor-pointer after:!tradex-text-white after:!tradex-right-full after:!tradex-left-auto"
                  title="swap"
                >
                  <TiArrowRepeat size={18} />
                </li>
              </Link>
            )}
          </ul>
        </div>
      ),
    },
  ];

  const handleActive = (index: any) => {
    if (index === tradeList) {
      setTradeList(index);
    } else {
      setTradeList(index);
    }
  };

  const handlePageClick = (event: any) => {
    getWalletLists(
      `/wallet-list?page=${
        event.selected + 1
      }&per_page=${selectedLimit}&search=${search}`
    );
  };

  const getWalletLists = async (url: string) => {
    const response: any = await WalletListApiAction(url, setProcessing);
    console.log("response", response);
    setWalletList(response?.wallets);
    setChangeable(response?.wallets?.data);
    // setAllData(response);
  };

  const getWalletTotalBalance = async () => {
    setLoadingForTotalBalance(true);
    const response: any = await getTotalWalletBalanceApi();
    if (!response?.success) {
      setLoadingForTotalBalance(false);
      return;
    }
    setTotalBalance(response?.data?.total || 0);
    setLoadingForTotalBalance(false);
  };

  // const LinkTopaginationString = async (link: any) => {
  //   if (link.url === null) return;
  //   if (link.label === walletList.current_page.toString()) return;
  //   const splitLink = link.url.split("api");
  //   const response: any = await WalletListApiAction(
  //     splitLink[1] + "&per_page=" + selectedLimit + "&search=" + search,
  //     setProcessing
  //   );
  //   setWalletList(response?.wallets);
  //   setChangeable(response?.wallets?.data);
  // };

  console.log("Changeable", Changeable);
  const coinListApi = async () => {
    const coinList = await appDashboardDataWithoutPair();
    setCoinList(coinList);
  };

  useEffect(() => {
    getWalletTotalBalance();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      coinListApi();
      getWalletLists(
        `/wallet-list?page=1&per_page=${selectedLimit}&search=${search}`
      );
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(debounceTimeout);
      setWalletList(null);
    };
  }, [search, selectedLimit]);

  const setDepositCryptoOrFiatUrl = (item: any) => {
    if (item.currency_type == 1) {
      return `/user/my-wallet/deposit?type=deposit&coin_id=${item.id}`;
    }
    return `/user/fiat/deposit?type=deposit&coin_id=${item.id}&currency=${item.coin_type}`;
  };
  const setWithdrawCryptoOrFiatUrl = (item: any) => {
    if (item.currency_type == 1) {
      return `/user/my-wallet/withdraw?type=withdraw&coin_id=${item.id}`;
    }
    return `/user/fiat/withdraw?type=withdraw&coin_id=${item.id}&currency=${item.coin_type}`;
  };
  return (
    <>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Spot Wallet")}
            </h2>
            <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 tradex-justify-between md:tradex-items-end">
              <div className=" tradex-space-y-2">
                <div className=" tradex-flex tradex-items-center tradex-gap-2">
                  <div className=" tradex-w-[11px] tradex-h-[11px] tradex-rounded-full tradex-bg-primary"></div>
                  <p className=" tradex-text-sm tradex-leading-4 tradex-font-bold tradex-text-primary">
                    {t("Total Balance")}
                  </p>
                </div>
                <h3 className=" tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-bold">
                  {totalBalance}
                  {""} {settings?.currency}
                </h3>
              </div>
              <div className=" tradex-flex  tradex-flex-col md:tradex-flex-row  md:tradex-items-center tradex-gap-6">
                <div>
                  <label className="!tradex-mb-0 tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body">
                    {t("Show")}
                    <select
                      className=" tradex-ml-4 !tradex-bg-background-main tradex-py-2.5 tradex-px-5 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5 tradex-text-title"
                      placeholder="10"
                      onChange={(e) => {
                        setSelectedLimit(e.target.value);
                      }}
                      value={selectedLimit}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className=" !tradex-mb-0 tradex-flex tradex-items-center tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body">
                    <input
                      type="search"
                      aria-controls="table"
                      className=" !tradex-bg-transparent md:tradex-ml-4 tradex-py-2.5 tradex-px-3 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5"
                      value={search || ""}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("Search")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className=" tradex-space-y-6">
              <ReactDataTable
                columns={columns}
                data={Changeable || []}
                processing={processing}
                isSearchable={false}
                isSortEnable={false}
                isOverflow={true}
              />

              {Changeable?.length > 0 && (
                <CustomPagination
                  per_page={walletList?.per_page}
                  current_page={walletList?.current_page}
                  total={walletList?.total}
                  handlePageClick={handlePageClick}
                />
              )}
            </div>
          </div>
        </div>
      </WalletLayout>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet");
  return {
    props: {},
  };
};

export default MyWallet;
