import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import SellTable from "./SellTable";
const DemoTradesHistory = ({ marketTrades }: any) => {
  const { t } = useTranslation("common");
  const { dashboard } = useSelector((state: RootState) => state.demoExchange);

  return (
    <div className="trades-section1">
      <div className="trades-headers mb-2">
        <h3>{t("Market Trades")}</h3>
      </div>
      <div className="primary-table">
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
          <div className="dataTables_scroll p-0">
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
                          className="table-col price sorting_disabled padding-4"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Price"
                        >
                          {t("Price")}({dashboard?.order_data?.base_coin})
                        </th>
                        <th
                          className="table-col amount sorting_disabled padding-4"
                          rowSpan={1}
                          colSpan={1}
                          aria-label="Amount"
                        >
                          {t("Amount")}({dashboard?.order_data?.trade_coin})
                        </th>
                        <th
                          className="table-col time text-right sorting_desc padding-4"
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
            <div className="dataTables_scrollBody overflow-auto position-relative w-full h-244"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTradesHistory;
