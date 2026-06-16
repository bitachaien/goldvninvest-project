import { formatCurrency } from "common";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import TableLoading from "components/common/SectionLoading";
import ReportSidebar from "layout/report-sidebar";
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { customPage, landingPage } from "service/landing-page";
import { AiFillEye } from "react-icons/ai";
import {
  CurrencyWithdrawHistoryAction,
  handleSearchItemsCurrency,
} from "state/actions/reports";
import WithdrawlHistoryModal from "components/gift-cards/modal/WithdrawlHistoryModal";
import CustomDataTable from "components/Datatable";
import ReportOverviewHeader from "components/reports/ReportOverviewHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import ReactDataTable from "components/ReactDataTable";
import CustomPagination from "components/Pagination/CustomPagination";
import ReportLayout from "components/reports/ReportLayout";

const CurrencyWithdrawHistory = () => {
  type searchType = string;
  const [search, setSearch] = useState<searchType>("");
  const [sortingInfo, setSortingInfo] = useState<any>({
    column_name: "created_at",
    order_by: "desc",
  });
  const { t } = useTranslation("common");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [history, setHistory] = useState<any>([]);
  const [paymentItem, setPaymentItem] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    CurrencyWithdrawHistoryAction(
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
  const getReport = async () => {
    CurrencyWithdrawHistoryAction(
      selectedLimit,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      sortingInfo.column_name,
      sortingInfo.order_by,
      search
    );
  };

  const columns = [
    {
      Header: t("Currency Amount"),

      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance market incree">
            {parseFloat(row?.original?.currency_amount).toFixed(2)}{" "}
            {row?.original?.currency}
          </span>
        </div>
      ),
    },
    {
      Header: t("Coin Amount"),

      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance market incree">
            {row?.original?.coin_amount} {row?.original?.coin_type}
          </span>
        </div>
      ),
    },
    {
      Header: t("Rate"),
      Cell: ({ row }: any) => (
        <div className="blance-text">
          <span className="blance market incree">
            {row?.original?.rate} {row?.original?.coin_type}
          </span>
        </div>
      ),
    },
    {
      Header: t("Status"),
      accessor: "status",
      Cell: ({ cell }: any) => (
        <div>
          {cell.value === 0 ? (
            <span className="text-warning text-12">{t("Pending")}</span>
          ) : cell.value === 1 ? (
            <span className="text-success text-12"> {t("Success")}</span>
          ) : (
            <span className="text-danger text-12">{t("Failed")}</span>
          )}
        </div>
      ),
    },
    {
      Header: t("Date"),
      accessor: "created_at",
      Cell: ({ cell }: any) => moment(cell.value).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      Header: t("Action"),
      Cell: ({ row }: any) => (
        <div
          className="text-center cursor-pointer"
          onClick={() => {
            setModalOpen(true);
            setPaymentItem(row?.original);
          }}
        >
          <AiFillEye size={25} />
        </div>
      ),
    },
  ];
  React.useEffect(() => {
    getReport();
    return () => {
      setHistory([]);
    };
  }, [selectedLimit, search]);

  const closeModalHandle = () => {
    setModalOpen(false);
  };

  const handlePageClick = (event: any) => {
    CurrencyWithdrawHistoryAction(
      selectedLimit,
      event.selected + 1,
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
      <ReportLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Crypto To Fiat Withdraw History")}
            </h2>
            <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4  tradex-justify-between md:tradex-items-end">
              <div>
                <label className="!tradex-mb-0 tradex-text-base tradex-leading-6 tradex-font-semibold tradex-text-body">
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
          <div className=" tradex-space-y-6">
            <ReactDataTable
              columns={columns}
              data={history || []}
              processing={processing}
              isSearchable={false}
              isSortEnable={false}
            />

            {history?.length > 0 && (
              <CustomPagination
                per_page={stillHistory?.per_page}
                current_page={stillHistory?.current_page}
                total={stillHistory?.total}
                handlePageClick={handlePageClick}
              />
            )}
          </div>
        </div>
      </ReportLayout>

      <Footer />
      {modalOpen && (
        <WithdrawlHistoryModal close={closeModalHandle} item={paymentItem} />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  return {
    props: {},
  };
};

export default CurrencyWithdrawHistory;
