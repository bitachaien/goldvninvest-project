import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import { useEffect, useState } from "react";
import { getTokenBuyHistoryAction } from "state/actions/launchpad";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";

import {
  STATUS_ACCEPTED,
  STATUS_MODIFICATION,
  STATUS_PENDING,
} from "helpers/core-constants";
import SectionLoading from "components/common/SectionLoading";
import CustomDataTable from "components/Datatable";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";

const TokenBuyHistory = () => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);
  const columns = [
    {
      Header: t("Token Name"),
      accessor: "token_name",
    },

    {
      Header: t("Amount"),
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.amount} {row?.original?.token_name}
        </div>
      ),
    },
    {
      Header: t("Amount Paid"),
      Cell: ({ row }: any) => (
        <div>
          {row?.original?.pay_amount} {row?.original?.pay_currency}
        </div>
      ),
    },
    {
      Header: t("Approved Status"),
      accessor: "status",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value === STATUS_PENDING ? (
            <span className="text-warning">{t("Pending")}</span>
          ) : cell.value === STATUS_ACCEPTED ? (
            <span className="text-success"> {t("Accepted")}</span>
          ) : cell.value === STATUS_MODIFICATION ? (
            <span className="text-warning"> {t("Modification request")}</span>
          ) : (
            <span className="text-danger">{t("Rejected")}</span>
          )}
        </div>
      ),
    },
    {
      Header: t("Transaction Id"),
      accessor: "trx_id",
    },
    {
      Header: t("Payment Method"),
      accessor: "payment_method",
    },
    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ cell }: any) => moment(cell.value).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    getTokenBuyHistoryAction(
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
    getTokenBuyHistoryAction(
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
    getTokenBuyHistoryAction(
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
                        {t("Token Buy History")}
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
  await SSRAuthCheck(ctx, "/user/profile");
  return {
    props: {},
  };
};
export default TokenBuyHistory;
