import React, { useEffect } from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setBuyAmount,
  setSellAmount,
  setSellPrice,
  setBuyPrice,
} from "state/reducer/exchange";
import useTranslation from "next-translate/useTranslation";
import { formatCurrency } from "common";
import { RootState } from "state/store";
const TestBuyTable = ({ buy, show }: any) => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  const changeSellPrice = (price: number, amount: number) => {
    dispatch(setSellPrice(price));
    dispatch(setSellAmount(amount));
    dispatch(setBuyAmount(amount));
    dispatch(setBuyPrice(price));
  };
  const [buyData, setBuyData] = React.useState<any>([]);
  const [summary, setSummary] = React.useState<any>({
    amount: 0,
    total: 0,
  });
  useEffect(() => {
    const Array = show ? [...buy].reverse().slice(-show) : [...buy].reverse();
    setBuyData(Array);
  }, [buy]);
  return (
    <div className="col-12 px-0">
      {buyData?.length > 0 ? (
        buyData?.map((item: any, index: number) => (
          <Tooltip
            placement={"right"}
            overlay={
              <span>
                <span>
                  {t("Avg Price")}:{" "}
                  {formatCurrency(
                    item.price,
                    dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                  )}
                </span>
                <br />
                <span>
                  {t("Amount")}:{" "}
                  {formatCurrency(
                    summary.amount,
                    dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                  )}
                </span>
                <br />

                <span>
                  {t("Total")}:{" "}
                  {formatCurrency(
                    summary.total,
                    dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                  )}
                </span>
              </span>
            }
            trigger={["hover"]}
            key={index}
            overlayClassName="rcTooltipOverlay"
          >
            <div
              className="row mx-0 position-relative"
              onClick={() => changeSellPrice(item.price, item.amount)}
              onMouseEnter={() => {
                const selectedIndex = index;
                const lastIndex = buy.length - 1;
                let sumtotal = 0;
                let sumAmount = 0;
                for (let i = selectedIndex; i <= lastIndex; i++) {
                  sumtotal += parseFloat(buy[i].total);
                  sumAmount += parseFloat(buy[i].amount);
                }
                setSummary({
                  amount: sumAmount,
                  total: sumtotal,
                });
              }}
            >
              <div className="col-4 px-0">
                <div className="asset">
                  <span className="redText order-book-body-text">
                    {formatCurrency(
                      item.price,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </span>
                </div>
              </div>
              <div className="col-4 px-0">
                <div className="asset">
                  <span className="asset-name order-book-body-text">
                    {formatCurrency(
                      item.amount,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </span>
                </div>
              </div>
              <div className="col-4 px-0">
                <div className="asset">
                  <span className="asset-name order-book-body-text">
                    {formatCurrency(
                      item.total,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </span>
                </div>
              </div>
              <div
                className="progress-red"
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
          <div className="dataTables_empty">
            {t("No data available in table")}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestBuyTable;
