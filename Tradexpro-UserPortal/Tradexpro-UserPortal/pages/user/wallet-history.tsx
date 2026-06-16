import type { GetServerSideProps, NextPage } from "next";
import React, { useState, useEffect } from "react";
import ReportSidebar from "layout/report-sidebar";
import DataTable from "react-data-table-component";
import {
  WithdrawAndDepositHistoryAction,
  handleSearch,
} from "state/actions/reports";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import moment from "moment";
import Footer from "components/common/footer";
import { toast } from "react-toastify";
import { BiCopy } from "react-icons/bi";
import SectionLoading from "components/common/SectionLoading";
import CustomDataTable from "components/Datatable";
import { getFiatHistoryApi } from "service/reports";
import FiatTableForDeposit from "components/user/fiat/FiatTableForDeposit";
import FiatTableForWithdraw from "components/user/fiat/FiatTableForWithdraw";
import { AiOutlineSearch } from "react-icons/ai";
import ReportOverviewHeader from "components/reports/ReportOverviewHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import {
  WITHDRAW_DEPOSIT_STATUS,
  WITHDRAW_DEPOSIT_STATUS_COLOR,
} from "helpers/core-constants";
import ReportLayout from "components/reports/ReportLayout";
import ReactDataTable from "components/ReactDataTable";
import CustomPagination from "components/Pagination/CustomPagination";
const DepositHistory: NextPage = () => {
  const router = useRouter();
  const { type } = router.query;
  const { t } = useTranslation("common");
  const [search, setSearch] = useState<any>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");
  const [selectedType, setSelectedType] = useState({
    id: 1,
    name: "Crypto",
  });
  const [history, setHistory] = useState<any>([]);
  // const [fiatHistory, setFiatHistory] = useState<any>([])
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

  const LinkTopaginationStringForFiat = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    getFiatHistory(parseInt(number), search);
  };
  const getReport = async () => {
    if (type === "deposit" || type === "withdrawal") {
      WithdrawAndDepositHistoryAction(
        type === "withdrawal" ? "withdraw" : "deposit",
        selectedLimit,
        1,
        setHistory,
        setProcessing,
        setStillHistory,
        search
      );
    }
  };
  const getFiatHistory = async (page: any, searchField: string) => {
    setProcessing(true);
    const data = await getFiatHistoryApi(
      type === "withdrawal" ? "withdraw" : "deposit",
      selectedLimit,
      page,
      searchField
    );
    if (!data.success) {
      toast.error(data.message);
      setProcessing(false);
      return;
    }
    setHistory(data?.data?.data);
    setStillHistory(data.data);
    setProcessing(false);
  };

  const walletTypes = [
    {
      id: 1,
      name: "Crypto",
    },
    {
      id: 2,
      name: "Fiat",
    },
  ];
  const columns = [
    {
      Header: t("Created At"),
      accessor: "created_at",
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
      Header:
        type === t("deposit") ? t("Transaction Id") : t("Transaction Hash"),
      accessor: type == "deposit" ? "transaction_id" : "transaction_hash",
      Cell: ({ cell: { value } }: any) => (
        <>
          <span
            onClick={() => {
              navigator.clipboard.writeText(value).then(() => {
                toast.success("Successfully copied");
              });
            }}
            className=" tradex-cursor-pointer"
          >
            {value?.slice(0, 16) + "...." + value?.slice(-16)}
          </span>
        </>
      ),
    },
    {
      Header: t("Status"),
      accessor: "status",

      Cell: ({ cell: { value } }: any) => (
        <>
          <span
            className={`badge badge-pill text-12 badge-${WITHDRAW_DEPOSIT_STATUS_COLOR[value]}`}
          >
            {WITHDRAW_DEPOSIT_STATUS[value]}
          </span>
        </>
      ),
    },
  ];
  useEffect(() => {
    setHistory([]);
    setStillHistory([]);
    setSearch("");
    if (selectedType.id == 1) {
      getReport();
    }
    if (selectedType.id == 2) {
      getFiatHistory(1, "");
    }
    return () => {
      setHistory([]);
    };
  }, [type, selectedType, selectedLimit]);

  useEffect(() => {
    setHistory([]);
    setStillHistory([]);
    if (selectedType.id == 1) {
      getReport();
    }
    if (selectedType.id == 2) {
      getFiatHistory(1, search);
    }
  }, [search]);

  const handlePagination = (event: any) => {
    WithdrawAndDepositHistoryAction(
      type === "withdrawal" ? "withdraw" : "deposit",
      selectedLimit,
      event?.selected + 1,
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };

  const handleFiatPaginatin = (event: any) => {
    getFiatHistory(event?.selected + 1, search);
  };

  const handlePageClick = (event: any) => {
    WithdrawAndDepositHistoryAction(
      type === "withdrawal" ? "withdraw" : "deposit",
      selectedLimit,
      event?.selected + 1,
      setHistory,
      setProcessing,
      setStillHistory,
      search
    );
  };

  console.log("stillHistory", stillHistory);

  return (
    <>
      <ReportLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {type === "deposit"
                ? t("Deposit History")
                : t("Withdrawal History")}
            </h2>
            <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 tradex-justify-between md:tradex-items-center">
              <div className=" tradex-flex tradex-gap-4 tradex-items-center">
                {walletTypes?.map((wallet_type: any, index: number) => (
                  <div
                    className={
                      selectedType.id === wallet_type.id
                        ? "tradex-cursor-pointer tradex-h-[42px] tradex-flex tradex-justify-center tradex-rounded tradex-items-center tradex-px-6  tradex-bg-primary tradex-text-white"
                        : " tradex-cursor-pointer tradex-h-[42px] tradex-flex tradex-justify-center tradex-items-center tradex-px-6 tradex-border tradex-border-primary tradex-rounded tradex-text-primary"
                    }
                    key={index}
                    onClick={() => {
                      setSelectedType(wallet_type);
                      setSelectedLimit("10");
                    }}
                  >
                    {wallet_type.name}
                  </div>
                ))}
              </div>

              <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 md:tradex-items-center">
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
            </div>
          </div>
          {selectedType.id == 1 && (
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
          )}
          {selectedType.id == 2 && (
            <div className=" tradex-space-y-6">
              {processing ? (
                <SectionLoading />
              ) : (
                <>
                  {type === "withdrawal" ? (
                    <FiatTableForWithdraw data={history} />
                  ) : (
                    <FiatTableForDeposit data={history} />
                  )}
                </>
              )}

              {history?.length > 0 && (
                <CustomPagination
                  per_page={stillHistory?.per_page}
                  current_page={stillHistory?.current_page}
                  total={stillHistory?.total}
                  handlePageClick={handleFiatPaginatin}
                />
              )}
            </div>
          )}
        </div>
      </ReportLayout>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/wallet-history");
  return {
    props: {},
  };
};

export default DepositHistory;
