import { NoItemFound } from "components/NoItemFound/NoItemFound";
import SectionLoading from "components/common/SectionLoading";
import {
  STAKING_INVESTMENT_STATUS_CANCELED,
  STAKING_INVESTMENT_STATUS_PAID,
  STAKING_INVESTMENT_STATUS_RUNNING,
  STAKING_INVESTMENT_STATUS_SUCCESS,
  STAKING_INVESTMENT_STATUS_UNPAID,
} from "helpers/core-constants";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { investmentCanceled } from "service/staking";
import MyModalsPayment from "./modal";
import useTranslation from "next-translate/useTranslation";

export const InvesmentOrderTable = ({
  actionFunction,
  filter = false,
}: any) => {
  const { t } = useTranslation("common");

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [modalData, setModalData] = useState({});
  const [selectedCoin, setSelectedCoins] = useState("all");
  const [processing, setProcessing] = useState<boolean>(false);
  const [history, setHistory] = useState<any>([]);
  const [stillHistory, setStillHistory] = useState<any>([]);
  const LinkTopaginationString = (page: any) => {
    const url = page.url.split("?")[1];
    const number = url.split("=")[1];
    actionFunction(
      5,
      parseInt(number),
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin
    );
  };

  useEffect(() => {
    actionFunction(
      5,
      1,
      setHistory,
      setProcessing,
      setStillHistory,
      selectedStatus,
      selectedCoin
    );
  }, [selectedStatus, selectedCoin]);
  const investmentCanceledAction = async (uid: string) => {
    const response = await investmentCanceled(uid);
    if (response.success) {
      actionFunction(
        5,
        1,
        setHistory,
        setProcessing,
        setStillHistory,
        selectedStatus,
        selectedCoin
      );
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div>
      {processing ? (
        <SectionLoading />
      ) : (
        <div className=" tradex-space-y-6">
          <div className=" tradex-overflow-x-auto">
            <table className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2">
              <thead>
                <tr>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Coin Type")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Daily Earning")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Investment Amount")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Auto Renew")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Status")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Estimated Interest")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary">
                    {t("Time Period")}
                  </th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"></th>
                  <th className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"></th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 &&
                  history?.map((item: any, index: any) => (
                    <tr
                      className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                      key={index}
                    >
                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        <div className="tableImg d-flex align-items-center">
                          <h6 className="">{item?.coin_type}</h6>
                        </div>
                      </td>
                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        <h6 className="mx-2">
                          {parseFloat(item.earn_daily_bonus)} {item?.coin_type}
                        </h6>
                      </td>
                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        {parseFloat(item.investment_amount)}
                      </td>
                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        {parseInt(item.auto_renew_status) === 1
                          ? "Disabled"
                          : parseInt(item.auto_renew_status) === 2
                          ? "Enabled"
                          : ""}
                      </td>
                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        {parseInt(item?.status) ===
                        STAKING_INVESTMENT_STATUS_SUCCESS
                          ? "Success"
                          : parseInt(item?.status) ===
                            STAKING_INVESTMENT_STATUS_PAID
                          ? "Paid"
                          : parseInt(item?.status) ===
                            STAKING_INVESTMENT_STATUS_UNPAID
                          ? "Un Paid"
                          : parseInt(item?.status) ===
                            STAKING_INVESTMENT_STATUS_CANCELED
                          ? "Canceled"
                          : parseInt(item?.status) ===
                            STAKING_INVESTMENT_STATUS_RUNNING
                          ? "Running"
                          : ""}
                      </td>

                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        {item.total_bonus} {item?.coin_type}
                      </td>
                      <td className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                        {item.period} {t("Days")}
                      </td>
                      {parseInt(item?.status) ===
                      STAKING_INVESTMENT_STATUS_RUNNING ? (
                        <td
                          onClick={() => {
                            investmentCanceledAction(item?.uid);
                          }}
                          className=" tradex-text-yellow-600 tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis"
                        >
                          {t("Cancel")}
                        </td>
                      ) : parseInt(item?.status) ===
                        STAKING_INVESTMENT_STATUS_CANCELED ? (
                        <td className=" tradex-text-red-600 tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                          {t("Cancelled")}
                        </td>
                      ) : parseInt(item?.status) ===
                        STAKING_INVESTMENT_STATUS_PAID ? (
                        <td className=" tradex-text-green-600 tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis">
                          {t("Paid")}
                        </td>
                      ) : (
                        ""
                      )}
                      <td
                        data-target="#exampleModal"
                        data-toggle="modal"
                        className="tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-h-11  tradex-max-w-[200px] tradex-text-sm tradex-text-body group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis"
                        onClick={() => {
                          setModalData(item);
                        }}
                      >
                        {t("Details")}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <MyModalsPayment modalData={modalData} />
            </table>
          </div>
          {history?.length == 0 && <NoItemFound />}
          <div>
            {history?.length > 0 && (
              <div className="pagination-wrapper" id="assetBalances_paginate">
                <span>
                  {stillHistory?.links?.map((link: any, index: number) =>
                    link.label === "&laquo; Previous" ? (
                      <a
                        key={index}
                        className="paginate-button"
                        onClick={() => {
                          if (link.url) LinkTopaginationString(link);
                        }}
                      >
                        <i className="fa fa-angle-left"></i>
                      </a>
                    ) : link.label === "Next &raquo;" ? (
                      <a
                        className="paginate-button"
                        onClick={() => LinkTopaginationString(link)}
                        key={index}
                      >
                        <i className="fa fa-angle-right"></i>
                      </a>
                    ) : (
                      <a
                        className={`paginate_button paginate-number ${
                          link.active === true && "text-warning"
                        }`}
                        aria-controls="assetBalances"
                        data-dt-idx="1"
                        onClick={() => LinkTopaginationString(link)}
                        key={index}
                      >
                        {link.label}
                      </a>
                    )
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
