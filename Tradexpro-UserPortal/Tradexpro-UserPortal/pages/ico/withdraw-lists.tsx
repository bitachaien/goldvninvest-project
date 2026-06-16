import type { GetServerSideProps, NextPage } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import { customPage, landingPage } from "service/landing-page";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  GetIcoWithdrawListsAction,
  GetTokenListAction,
} from "state/actions/launchpad";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { handleSwapHistorySearch } from "state/actions/reports";
import { MdCreateNewFolder } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { AiFillEye, AiOutlineOrderedList } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  STATUS_ACCEPTED,
  STATUS_MODIFICATION,
  STATUS_PENDING,
} from "helpers/core-constants";
import { BsFillChatFill } from "react-icons/bs";
import CustomDataTable from "components/Datatable";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import IcoWithdrawModal from "components/gift-cards/modal/IcoWithdrawModal";
import ReactPaginate from "react-paginate";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import CustomPagination from "components/Pagination/CustomPagination";
import ReactDataTable from "components/ReactDataTable";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";

const Profile: NextPage = ({}: any) => {
  const [history, setHistory] = useState<any>([]);
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [stillHistory, setStillHistory] = useState<any>([]);

  const [paymentSlip, setPaymentSlip] = useState<any>();
  const [paymentDetails, setPaymentDetails] = useState<any>();
  const [modalOpen, setModalOpen] = useState<any>(false);

  const columns = [
    {
      Header: t("Transaction Type"),

      accessor: "tran_type",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value == 1 && <span>{t("Fiat")}</span>}{" "}
          {cell.value == 2 && <span>{t("Crypto")}</span>}
        </div>
      ),
    },
    {
      Header: t("Request Amount"),
      Cell: ({ row }: any) => (
        <span>
          {row?.original?.request_amount} {row?.original?.request_currency}
        </span>
      ),
    },
    {
      Header: t("Convert Amount"),
      Cell: ({ row }: any) => (
        <span>
          {row?.original?.convert_amount} {row?.original?.convert_currency}
        </span>
      ),
    },
    {
      Header: t("Approved Status"),
      accessor: "approved_status",
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
      Header: t("Payment Details"),
      accessor: "payment_details",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value ? (
            <span
              onClick={() => {
                setModalOpen(true);
                setPaymentDetails(cell.value);
                setPaymentSlip(null);
              }}
              className="text-underline text-primary-color pointer"
            >
              {t("View")}
            </span>
          ) : (
            <span> {t("N/A")}</span>
          )}
        </div>
      ),
    },

    {
      Header: t("Payment Slip"),
      accessor: "payment_sleep",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value ? (
            <span
              onClick={() => {
                setModalOpen(true);
                setPaymentSlip(cell.value);
                setPaymentDetails(null);
              }}
              className="text-underline text-primary-color pointer"
            >
              {t("View")}
            </span>
          ) : (
            <span> {t("N/A")}</span>
          )}
        </div>
      ),
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
    GetIcoWithdrawListsAction(
      selectedLimit,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };
  useEffect(() => {
    GetIcoWithdrawListsAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  }, [selectedLimit, search]);

  const closeModalHandle = () => {
    setModalOpen(false);
  };

  const handlePageClick = (event: any) => {
    GetIcoWithdrawListsAction(
      selectedLimit,
      event.selected + 1,
      setHistory,
      setProcessing,
      setStillHistory,
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
                        {t("Withdraw Lists")}
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
      {modalOpen && (
        <IcoWithdrawModal
          close={closeModalHandle}
          image={paymentSlip}
          paymentDetails={paymentDetails}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/ico/withdraw-lists");
  return {
    props: {},
  };
};
export default Profile;
