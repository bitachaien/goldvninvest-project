import React, { useEffect } from "react";
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
const AllBuyOrders = ({ OpenBookBuy, show, customClass }: any) => {
  const { t } = useTranslation("common");
  const [buyData, setBuyData] = React.useState<any>([]);
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  const dispatch = useDispatch();
  const changeSellPrice = (price: number, amount: number) => {
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
    const Array = show ? [...OpenBookBuy].slice(0, show) : [...OpenBookBuy];
    setBuyData(Array);
    return () => {};
  }, [OpenBookBuy]);

  return (
    <div className={`buy-order ${customClass}`}>
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
            <div className="dataTables_scrollBody mt-2 position-relative overflow-auto w-full h-425">
              {OpenBookBuy.length > 0 ? (
                <div>
                  {buyData?.length !== 0 ? (
                    buyData?.map((item: any, index: number) => (
                      <Tooltip
                        key={index}
                        placement={"right"}
                        overlay={
                          <span>
                            <span>
                              {t("Avg Price")}:
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
                            changeSellPrice(item.price, item.amount);
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
                    <div className="odd">
                      <div className="text-center">
                        {t("No data available in table")}
                      </div>
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
