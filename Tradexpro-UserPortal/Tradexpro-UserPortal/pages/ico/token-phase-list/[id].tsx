import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import CustomDataTable from "components/Datatable";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import { IoCreateOutline } from "react-icons/io5";
import { customPage, landingPage } from "service/landing-page";
import { SaveIcoPhaseStatus } from "service/launchpad";
import { IcoTokenPhaseListAction } from "state/actions/launchpad";
import { handleSwapHistorySearch } from "state/actions/reports";

const IcoTokenPhaseList = ({ id }: any) => {
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
      Header: t("Phase title"),
      accessor: "phase_title",
      Cell: ({ row }: any) => (
        <div className="">
          <p>{row?.original?.phase_title}</p>
        </div>
      ),
      sortable: true,
    },
    {
      Header: t("Token name"),
      accessor: "coin_type",
      sortable: true,
    },
    {
      Header: t("Total Token Supply"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {parseFloat(row?.original?.total_token_supply).toFixed(5)}{" "}
          {row?.original?.coin_type}
        </div>
      ),
    },
    {
      Header: t("Available Token Supply"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {parseFloat(row?.original?.available_token_supply).toFixed(4)}{" "}
          {row?.original?.coin_type}
        </div>
      ),
    },
    {
      Header: t("Coin Price"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {row?.original?.coin_price} {row?.original?.coin_currency}
        </div>
      ),
    },
    {
      Header: t("Status"),
      selector: ({ row }: any) => row?.status,
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="position-relative">
          <li
            className="toolTip ml-3 after:!tradex-text-white"
            title={row?.original?.status === 0 ? t("Turn on") : t("Turn off")}
            onClick={async () => {
              await SaveIcoPhaseStatus(row?.original?.id);
              await IcoTokenPhaseListAction(
                selectedLimit,
                1,
                setHistory,
                setProcessing,
                setStillHistory,
                sortingInfo.column_name,
                sortingInfo.order_by,
                id,
                search
              );
            }}
          >
            {row?.original?.status === 0 ? (
              <BsToggle2Off size={20} />
            ) : (
              <BsToggle2On size={20} />
            )}
          </li>
        </div>
      ),
    },
    {
      Header: t("Start Date"),
      Cell: ({ row }: any) =>
        moment(row?.original?.start_date).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("End Date"),
      Cell: ({ row }: any) =>
        moment(row?.original?.end_date).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("Actions"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <Link href={`/ico/create-edit-phase/${row?.original?.id}?edit=true`}>
            <li
              className="toolTipForPhaseList d-inline-block position-relative cursor-pointer after:!tradex-text-white"
              title={t("Edit Phase")}
            >
              <IoCreateOutline size={20} />
            </li>
          </Link>
          <Link href={`/ico/create-edit-additional-phase/${row?.original?.id}`}>
            <li
              className="toolTipForPhaseList ml-3 d-inline-block position-relative cursor-pointer after:!tradex-text-white"
              title={t("Add Edit Additional phase")}
            >
              <AiOutlineAppstoreAdd size={20} />
            </li>
          </Link>
        </div>
      ),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    IcoTokenPhaseListAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      id,
      search
    );
  };
  useEffect(() => {
    IcoTokenPhaseListAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      id,
      search
    );
  }, [selectedLimit, search]);

  const handlePageClick = (event: any) => {
    IcoTokenPhaseListAction(
      selectedLimit,
      parseInt(event.selected + 1),
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      id,
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
  await SSRAuthCheck(ctx, "/user/profile");
  const { id, edit } = ctx.query;

  return {
    props: {
      id: id,
      edit: edit ? edit : null,
    },
  };
};
export default IcoTokenPhaseList;
