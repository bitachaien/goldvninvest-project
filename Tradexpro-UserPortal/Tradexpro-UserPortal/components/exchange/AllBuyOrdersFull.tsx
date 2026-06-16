import React, { useEffect, useState } from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setBuyAmount,
  setBuyPrice,
  setSellAmount,
  setSellPrice,
} from "state/reducer/exchange";
import useTranslation from "next-translate/useTranslation";
import { formatCurrency } from "common";
import { RootState } from "state/store";
const AllBuyOrders = ({ buy, show, customClss }: any) => {
  const { t } = useTranslation("common");
  const [OpenBookBuy, setopenBookBuy] = useState<any>([]);
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  const changeBuyPrice = (price: number, amount: number) => {
    dispatch(setSellPrice(price));
    dispatch(setSellAmount(amount));
    dispatch(setBuyAmount(amount));
    dispatch(setBuyPrice(price));
  };
  const [summary, setSummary] = React.useState({
    amount: 0,
    total: 0,
  });
  useEffect(() => {
    const Array = show ? [...buy].reverse().slice(-show) : [...buy].reverse();
    setopenBookBuy(Array);
  }, [buy]);
  return (
    <div className={`sell-order ${customClss}`}>
      <div className="trades-table">
        <div className="trades-table-body" />
        <div
          id="exchangeAllSellOrders_wrapper"
          className="dataTables_wrapper no-footer"
        >
          <div
            id="exchangeAllSellOrders_processing"
            className="dataTables_processing d-none"
          >
            {t("Processing")}...
          </div>
          <div className="">
            <div className="dataTables_scrollBody overflow-auto position-relative h-855 w-full">
              {OpenBookBuy.length > 0 ? (
                <div>
                  {OpenBookBuy?.length !== 0 ? (
                    OpenBookBuy?.map((item: any, index: number) => (
                      <Tooltip
                        key={index}
                        placement={"right"}
                        overlay={
                          <span>
                            <span>
                              {t("Avg Price")}:{" "}
                              {formatCurrency(
                                item.price,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )}
                            </span>
                            <br />
                            <span>
                              {t("Amount")}:{" "}
                              {formatCurrency(
                                summary.amount,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )}
                            </span>
                            <br />

                            <span>
                              {t("Size")}:{" "}
                              {formatCurrency(
                                summary.total,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )}
                            </span>
                          </span>
                        }
                        trigger={["hover"]}
                        overlayClassName="rcTooltipOverlay"
                      >
                        <div
                          className="row mx-0 position-relative"
                          onClick={() => {
                            changeBuyPrice(item.price, item.amount);
                          }}
                          onMouseEnter={() => {
                            const selectedIndex = index;
                            const firstIndex = 0;
                            let sumtotal = 0;
                            let sumAmount = 0;
                            for (let i = selectedIndex; i >= firstIndex; i--) {
                              sumtotal += parseFloat(OpenBookBuy[i].total);
                              sumAmount += parseFloat(OpenBookBuy[i].amount);
                            }
                            setSummary({
                              amount: sumAmount,
                              total: sumtotal,
                            });
                          }}
                        >
                          <div className="col-4 px-0">
                            <div className="asset">
                              <span className="greenText order-book-body-text">
                                {formatCurrency(
                                  item.price,
                                  dashboard?.order_data?.total?.trade_wallet
                                    ?.pair_decimal
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="col-4 px-0">
                            <div className="asset">
                              <span className="asset-name order-book-body-text">
                                {formatCurrency(
                                  item.amount,
                                  dashboard?.order_data?.total?.trade_wallet
                                    ?.pair_decimal
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="col-4 px-0">
                            <div className="asset">
                              <span className="asset-name order-book-body-text">
                                {formatCurrency(
                                  item.total,
                                  dashboard?.order_data?.total?.trade_wallet
                                    ?.pair_decimal
                                )}
                              </span>
                            </div>
                          </div>
                          <div
                            className="progress-green"
                            style={{
                              width: `${
                                parseFloat(item?.percentage)
                                  ? parseFloat(item?.percentage)
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </Tooltip>
                    ))
                  ) : (
                    <div>
                      <div className="">{t("No data available in table")}</div>
                    </div>
                  )}
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
  );
};

export default AllBuyOrders;
