import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import SellTable from "./SellTable";
import { useRouter } from "next/router";
import { formatCurrency } from "common";
import Link from "next/link";
const TradesHistory = ({ marketTrades, customClass }: any) => {
  const { t } = useTranslation("common");
  const { dashboard } = useSelector((state: RootState) => state.exchange);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [isMarketTradeShow, setIsMarketTradeShow] = useState<any>(true);

  return (
    <div className={`trades-section1 ${customClass}`}>
      <div className="trades-headers mb-2 justify-content-start gap-10">
        <h3
          className={`${
            isMarketTradeShow && "text-primary-color"
          } cursor-pointer`}
          onClick={() => setIsMarketTradeShow(true)}
        >
          {t("Market Trades")}
        </h3>
        {router.pathname == "/exchange/dashboard" && (
          <h3
            className={`${
              !isMarketTradeShow && "text-primary-color"
            } cursor-pointer`}
            onClick={() => setIsMarketTradeShow(false)}
          >
            {t("Asset Overview")}
          </h3>
        )}
      </div>
      {isMarketTradeShow ? (
        <div className="primary-table">
          {/* <div className="table-header">
          <div className="table-row" />
        </div>
        <div className="table-body" /> */}
          <div
            id="marketTradeTable_wrapper"
            className="dataTables_wrapper no-footer"
          >
            <div
              id="marketTradeTable_processing"
              className="dataTables_processing d-none"
            >
              {t("Processing")}...
            </div>
            <div className="dataTables_scroll px-0">
              <div className="dataTables_scrollHead overflow-hidden position-relative border-0 w-full">
                <div className="dataTables_scrollHeadInner box-sizing-content-box pr-0 w-431-25">
                  {marketTrades.length > 0 ? (
                    <table
                      className="table dataTable  no-footer ml-0 w-431-25"
                      role="grid"
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className="table-col price sorting_disabled w-170-656 padding-4"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Price"
                          >
                            {t("Price")}({dashboard?.order_data?.base_coin})
                          </th>
                          <th
                            className="table-col amount sorting_disabled w-120-75 padding-4"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Amount"
                          >
                            {t("Amount")}({dashboard?.order_data?.trade_coin})
                          </th>
                          <th
                            className="table-col time text-right sorting_desc w-79-8438 padding-4"
                            rowSpan={1}
                            colSpan={1}
                            aria-label="Time"
                          >
                            {t("Time")}
                          </th>
                        </tr>
                      </thead>
                      <SellTable marketTrades={marketTrades} />
                    </table>
                  ) : (
                    <div className="text-center mt-5">
                      <p>{t("No data available in table")} </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="dataTables_scrollBody position-relative overflow-auto w-full h-244"></div>
            </div>
          </div>
        </div>
      ) : (
        router.pathname == "/exchange/dashboard" && (
          <div>
            <div>
              <p className="font-600">{t("Trading Account")}</p>
              <div className="d-flex justify-content-between align-items-center">
                <p>{dashboard?.order_data?.base_coin}</p>
                <p>
                  {dashboard?.order_data?.on_order?.base_wallet &&
                    formatCurrency(
                      dashboard?.order_data?.on_order?.base_wallet,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p>{dashboard?.order_data?.trade_coin}</p>
                <p>
                  {dashboard?.order_data?.on_order?.trade_wallet &&
                    formatCurrency(
                      dashboard?.order_data?.on_order?.trade_wallet,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                </p>
              </div>
            </div>
            <div>
              <p className="font-600">{t("Funding Account")}</p>
              <div className="d-flex justify-content-between align-items-center">
                <p>{dashboard?.order_data?.base_coin}</p>
                <p>
                  {dashboard?.order_data?.total?.base_wallet?.balance &&
                    formatCurrency(
                      dashboard?.order_data?.total?.base_wallet?.balance,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p>{dashboard?.order_data?.trade_coin}</p>
                <p>
                  {dashboard?.order_data?.total?.trade_wallet?.balance &&
                    formatCurrency(
                      dashboard?.order_data?.total?.trade_wallet?.balance,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                </p>
              </div>
            </div>
            <div className="mt-4 d-flex justify-content-between align-items-center gap-10">
              <Link
                href={
                  !isLoggedIn
                    ? "/signin"
                    : `/user/my-wallet/deposit?type=deposit&coin_id=${dashboard?.order_data?.total?.trade_wallet?.wallet_id}`
                }
              >
                <button className="btn w-full rounded-pill bg-primary-color">
                  {t("Deposit")}
                </button>
              </Link>
              <Link
                href={
                  !isLoggedIn
                    ? "/signin"
                    : `/user/my-wallet/withdraw?type=withdraw&coin_id=${dashboard?.order_data?.total?.trade_wallet?.wallet_id}`
                }
              >
                <button className="btn w-full rounded-pill bg-primary-color">
                  {t("Transfer")}
                </button>
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TradesHistory;
