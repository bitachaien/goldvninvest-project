import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

import BuyTable from "./BuyTable";
import TestBuyTable from "./TestBuyTable";
const AllSellOrders = ({ OpenBooksell, show, customClass }: any) => {
  const { t } = useTranslation("common");
  const { dashboard } = useSelector((state: RootState) => state.exchange);
  return (
    <div className={`buy-order ${customClass}`}>
      <div className="trades-table">
        <div className="trades-table-header">
          <div className="trades-table-row" />
        </div>
        <div className="trades-table-body" />
        <div
          id="exchangeAllBuyOrders_wrapper"
          className="dataTables_wrapper no-footer"
        >
          <div
            id="exchangeAllBuyOrders_processing"
            className="dataTables_processing d-none"
          >
            {t("Processing")}...
          </div>
          <div className="">
            <div className="dataTables_scrollHead overflow-hidden position-relative border-0 w-full">
              <div className="dataTables_scrollBody overflow-auto position-relative h-244 w-full">
                {OpenBooksell.length > 0 ? (
                  <div className="row mx-0">
                    <div className="col-12 px-0">
                      <div className="row mx-0">
                        <div className="col-4 px-0">
                          <span className="order-book-heading-text">
                            {" "}
                            {t("Price")}({dashboard?.order_data?.base_coin})
                          </span>
                        </div>
                        <div className="col-4 px-0">
                          <span className="order-book-heading-text">
                            {t("Amount")}({dashboard?.order_data?.trade_coin})
                          </span>
                        </div>

                        <div className="col-4 px-0">
                          <span className="order-book-heading-text">
                            {t("Total")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <TestBuyTable buy={OpenBooksell} show={show} />
                  </div>
                ) : (
                  <div className="text-center mt-5">
                    <p>{t("No data available in table")} </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSellOrders;
