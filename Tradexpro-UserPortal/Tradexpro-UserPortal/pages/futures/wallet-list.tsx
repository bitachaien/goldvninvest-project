import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import React, { useEffect, useState } from "react";

import { SearchObjectArrayFuesJS } from "state/actions/wallet";
import Loading from "components/common/SectionLoading";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { AiOutlineSend } from "react-icons/ai";
import { BsWallet2 } from "react-icons/bs";
import { getWalletsFutureAction } from "state/actions/futureTrade";
import CustomDataTable from "components/Datatable";
import moment from "moment";
import WalletOverviewSidebar from "layout/WalletOverviewSidebar";
import WalletOverviewHeader from "components/wallet-overview/WalletOverviewHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import WalletLayout from "components/wallet/WalletLayout";
import ReactDataTable from "components/ReactDataTable";
import CustomPagination from "components/Pagination/CustomPagination";
const WalletList: NextPage = () => {
  const { t } = useTranslation("common");
  const [walletList, setWalletList] = useState<any>([]);
  const [search, setSearch] = useState<any>("");
  const [Changeable, setChangeable] = useState<any[]>([]);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [processing, setProcessing] = useState<boolean>(false);
  const columns = [
    {
      Header: t("Asset"),

      Cell: ({ row }: any) => (
        <div className="tradex-flex tradex-items-center tradex-gap-2">
          <div className="tradex-min-w-[27px]">
            <img
              className="tradex-max-w-[27px] tradex-max-h-[27px] tradex-w-full tradex-h-full tradex-object-cover tradex-object-center"
              src={row.original.coin_icon || "/bitcoin.png"}
              alt=""
              width={27}
              height={27}
            />
          </div>

          <div className=" tradex-space-y-0.5">
            <p className=" tradex-text-sm tradex-leading-4 tradex-font-medium !tradex-text-title">
              {row.original?.wallet_name}
            </p>
            <p className="tradex-text-xs tradex-leading-4 !tradex-text-body">
              {row.original?.coin_type}
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: t("Available Balance"),
      accessor: "balance",
      Cell: ({ cell }: any) => (
        <div>
          <span className="tradex-text-sm tradex-leading-4 tradex-font-medium !tradex-text-body">
            {parseFloat(cell?.value).toFixed(8)}
          </span>
        </div>
      ),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div className="active-link">
          <ul>
            <div className="active-link">
              <ul>
                <Link
                  href={`/futures/transfer-wallet/2/${row?.original?.coin_type}`}
                >
                  <li className="toolTip relative cursor-pointer" title="Send">
                    <AiOutlineSend />
                  </li>
                </Link>
                <Link
                  href={`/futures/transfer-wallet/1/${row?.original?.coin_type}`}
                >
                  <li
                    className="toolTip relative cursor-pointer"
                    title="Recieve"
                  >
                    <BsWallet2 />
                  </li>
                </Link>
              </ul>
            </div>
          </ul>
        </div>
      ),
    },
  ];
  const getWalletLists = async () => {
    setProcessing(true);
    const response: any = await getWalletsFutureAction(
      selectedLimit,
      1,
      search
    );
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
    setProcessing(false);
  };

  const LinkTopaginationString = async (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    setProcessing(true);
    const response: any = await getWalletsFutureAction(
      selectedLimit,
      number,
      search
    );
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
    setProcessing(false);
  };

  useEffect(() => {
    getWalletLists();
    return () => {
      setWalletList(null);
    };
  }, [selectedLimit, search]);

  const handlePageClick = async (event: any) => {
    setProcessing(true);
    const response: any = await getWalletsFutureAction(
      selectedLimit,
      event.selected + 1,
      search
    );
    setWalletList(response?.data);
    setChangeable(response?.data?.data);
    setProcessing(false);
  };
  return (
    <div>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Futures Wallet")}
            </h2>
            <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4  tradex-justify-between md:tradex-items-end">
              <div>
                <label className="!tradex-mb-0 tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body">
                  {t("Show")}
                  <select
                    className=" tradex-ml-4 !tradex-bg-transparent tradex-py-2.5 tradex-px-5 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5 tradex-text-title"
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
          <div className=" tradex-space-y-6">
            <ReactDataTable
              columns={columns}
              data={Changeable || []}
              processing={processing}
              isSearchable={false}
              isSortEnable={false}
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
      </WalletLayout>

      <Footer />
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};

export default WalletList;
