import React, { useState } from "react";
import DataTable from "react-data-table-component";
import {
  WithdrawAndDepositHistoryAction,
  handleSearch,
} from "state/actions/reports";
import Loading from "components/common/SectionLoading";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import CustomDataTable from "components/Datatable";
import ReactDataTable from "components/ReactDataTable";
import CustomPagination from "components/Pagination/CustomPagination";
const Wallethistory = ({ type }: any) => {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    WithdrawAndDepositHistoryAction(
      type === "withdrawal" ? "withdraw" : "deposit",
      10,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };
  const getReport = async () => {
    if (type === "deposit" || type === "withdrawal") {
      WithdrawAndDepositHistoryAction(
        type === "withdrawal" ? "withdraw" : "deposit",
        10,
        1,
        setHistory,
        setProcessing,
        setStillHistory,
        search
      );
    }
  };
  const columns = [
    {
      Header: t("Created At"),
      accessor: "created_at",
      Cell: ({ cell }: any) => (
        <div>
          {cell?.value
            ? moment(cell.value).format("YYYY-MM-DD HH:mm:ss")
            : "N/A"}
        </div>
      ),
    },
    {
      Header: t("Address"),
      accessor: "address",
    },
    {
      Header: t("Coin Type"),
      accessor: "coin_type",
    },
    {
      Header: t("Amount"),
      accessor: "amount",
    },
    {
      Header: t("Fees"),
      accessor: "fees",
    },
    {
      Header: t("Status"),
      accessor: "status",

      Cell: ({ cell: { value } }: any) => (
        <div>
          {value == 0 ? (
            <span className=" tradex-text-sm tradex-text-yellow-600">
              {t("Pending")}
            </span>
          ) : value == 1 ? (
            <span className="tradex-text-sm tradex-text-green-600">
              {" "}
              {t("Success")}
            </span>
          ) : (
            <span className="tradex-text-sm tradex-text-red-600">
              {t("Failed")}
            </span>
          )}
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    getReport();

    return () => {
      setHistory([]);
    };
  }, [type, selectedLimit, search]);

  const handlePageClick = async (event: any) => {
    WithdrawAndDepositHistoryAction(
      type === "withdrawal" ? "withdraw" : "deposit",
      selectedLimit,
      parseInt(event.selected + 1),
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };

  return (
    <>
      <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
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
          data={history || []}
          processing={processing}
          isSearchable={false}
          isSortEnable={false}
        />

        {history?.length > 0 && (
          <CustomPagination
            per_page={stillHistory?.histories?.per_page}
            current_page={stillHistory?.histories?.current_page}
            total={stillHistory?.histories?.total}
            handlePageClick={handlePageClick}
          />
        )}
      </div>
    </>
  );
};

export default Wallethistory;
