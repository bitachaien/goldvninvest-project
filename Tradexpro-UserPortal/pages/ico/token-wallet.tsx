import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import type { GetServerSideProps, NextPage } from "next";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { TiArrowRepeat } from "react-icons/ti";
import { getMyTokenBalanceAction } from "state/actions/launchpad";
import Loading from "components/common/SectionLoading";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import SectionLoading from "components/common/SectionLoading";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import moment from "moment";
import CustomDataTable from "components/Datatable";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";

const MyWallet: NextPage = () => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const columns = [
    {
      Header: t("Asset"),
      accessor: "name",
      Cell: ({ row }: any) => (
        <div className=" tradex-flex tradex-gap-2 tradex-items-center">
          <img
            className=" tradex-w-6 tradex-h-6 "
            src={row?.original?.image_path || "/bitcoin.png"}
            alt=""
          />
          <span className="asset-name">{row?.original?.name}</span>
        </div>
      ),
    },

    {
      Header: t("Symbol"),
      Cell: ({ row }: any) => (
        <span className="symbol">{row?.original?.coin_type}</span>
      ),
    },
    {
      Header: t("Available Balance"),
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance">
            {parseFloat(row?.original?.balance).toFixed(8)}
          </span>
        </div>
      ),
    },

    {
      Header: t("Address"),
      accessor: "address",
    },

    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ cell }: any) => moment(cell.value).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
  const [search, setSearch] = useState<any>("");
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [processing, setProcessing] = useState<boolean>(false);
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);

  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    getMyTokenBalanceAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  };
  useEffect(() => {
    getMyTokenBalanceAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  }, [selectedLimit, search]);

  const handlePageClick = (event: any) => {
    getMyTokenBalanceAction(
      selectedLimit,
      parseInt(event.selected + 1),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  };

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6">
              <div className="lg:tradex-col-span-3">
                <LaunchpadSidebar />
              </div>
              <div className=" lg:tradex-col-span-9">
                <div className=" tradex-space-y-8">
                  <div className=" tradex-space-y-4">
                    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                      <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                        {t("Token Wallet")}
                      </h4>
                      <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-justify-between tradex-gap-4 md:tradex-items-center">
                        <div>
                          <label className="!tradex-mb-0 tradex-text-base tradex-leading-6 tradex-font-semibold tradex-text-body">
                            {t("Show")}
                            <select
                              className=" md:tradex-ml-4 !tradex-bg-background-main tradex-py-2.5 tradex-px-5 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5 tradex-text-title"
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
                      <div>
                        <ReactDataTable
                          columns={columns}
                          data={history || []}
                          processing={processing}
                          isSearchable={false}
                          isSortEnable={false}
                          isOverflow={true}
                        />
                      </div>
                    </div>
                    {history?.length > 0 && (
                      <>
                        <CustomPagination
                          per_page={stillHistory?.per_page}
                          current_page={stillHistory?.current_page}
                          total={stillHistory?.total}
                          handlePageClick={handlePageClick}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

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
