import type { GetServerSideProps, NextPage } from "next";
import ProfileComp from "components/profile/profile";
import { parseCookies } from "nookies";

import { GetUserInfoByTokenServer } from "service/user";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import { useEffect, useState } from "react";
import { DynamicSubmittedFormListAction } from "state/actions/launchpad";
import TableLoading from "components/common/SectionLoading";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";
import Link from "next/link";
import { IoWalletOutline } from "react-icons/io5";
import { GiToken } from "react-icons/gi";
import SectionLoading from "components/common/SectionLoading";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import CustomDataTable from "components/Datatable";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
const customStyles = {
  rows: {
    style: {
      minHeight: "72px", // override the row height
      // backgroundColor: "var(--glass-color-bg-1)",
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      // backgroundColor: "var(--glass-color-bg-1)",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};

const Profile: NextPage = () => {
  const [history, setHistory] = useState<any>([]);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");

  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const [stillHistory, setStillHistory] = useState<any>([]);
  const columns = [
    {
      Header: t("Id"),
      Cell: ({ row }: any) => row?.original?.unique_id,
      sortable: true,
    },
    {
      Header: t("Updated At"),
      Cell: ({ row }: any) => row?.original?.updated_at,
      sortable: true,
    },

    {
      Header: t("Status"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div>
          {row.original?.status === 0 ? (
            <span className="text-warning">{t("Pending")}</span>
          ) : row.original?.status === 1 ? (
            <span className="text-success"> {t("Success")}</span>
          ) : (
            <span className="text-danger">{t("Failed")}</span>
          )}
        </div>
      ),
    },
    {
      Header: t("Date"),
      Cell: ({ row }: any) =>
        moment(row.original?.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("Actions"),
      sortable: true,
      Cell: ({ row }: any) => (
        <div className="blance-text">
          {row?.original?.status === 1 &&
            row?.original?.token_create_status === 1 && (
              <Link href={`/ico/create-edit-token/${row?.original?.id}`}>
                <li
                  className="toolTipForPhaseList d-inline-block position-relative cursor-pointer tradex-text-white"
                  title={t("Create Token")}
                >
                  <GiToken size={25} className=" tradex-text-body" />
                </li>
              </Link>
            )}
        </div>
      ),
    },
  ];
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    DynamicSubmittedFormListAction(
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
    DynamicSubmittedFormListAction(
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
    DynamicSubmittedFormListAction(
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
                        {t("Applied launchpad")}
                      </h4>
                      <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 md:tradex-items-center">
                        <div>
                          <label className="!tradex-mb-0 tradex-text-base tradex-leading-6 tradex-font-semibold tradex-text-body">
                            {t("Show")}
                            <select
                              className=" md:tradex-ml-4 tradex-py-2.5 tradex-px-5 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5 tradex-text-title !tradex-bg-background-main"
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
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);

  return {
    props: {
      user: response.user,
      profileActivity: response.activityLog,
    },
  };
};
export default Profile;
