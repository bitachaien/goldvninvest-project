import { formatCurrency } from "common";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const TradesTable = ({ marketTrades }: any) => {
  const { t } = useTranslation("common");
  const [trades, setTrades] = React.useState<any>([]);
  const { dashboard } = useSelector((state: RootState) => state.exchange);

  const setTradeData = () => {
    let allTradeData = [];
    marketTrades.length &&
      allTradeData.push(marketTrades[marketTrades.length - 1]);
    for (let i = marketTrades.length; i >= 0; i--) {
      if (
        parseFloat(marketTrades[i]?.price) >
        parseFloat(marketTrades[i - 1]?.price)
      ) {
        allTradeData.push({
          type: "red",
          price: marketTrades[i - 1]?.price,
          amount: marketTrades[i - 1]?.amount,
          time: marketTrades[i - 1]?.time,
        });
      } else if (
        parseFloat(marketTrades[i]?.price) <
        parseFloat(marketTrades[i - 1]?.price)
      ) {
        allTradeData.push({
          type: "green",
          price: marketTrades[i - 1]?.price,
          amount: marketTrades[i - 1]?.amount,
          time: marketTrades[i - 1]?.time,
        });
      } else if (
        parseFloat(marketTrades[i]?.price) ===
        parseFloat(marketTrades[i - 1]?.price)
      ) {
        allTradeData.push({
          type: "white",
          price: marketTrades[i - 1]?.price,
          amount: marketTrades[i - 1]?.amount,
          time: marketTrades[i - 1]?.time,
        });
      }
    }
    setTrades(allTradeData.reverse());
  };
  useEffect(() => {
    setTradeData();
  }, [marketTrades]);
  return (
    <tbody>
      {marketTrades?.length === 0 ? (
        <tr className="odd">
          <td valign="top" colSpan={3} className="text-center">
            {t("No data available in table")}
          </td>
        </tr>
      ) : (
        trades?.map((item: any, index: number) => (
          <tr className="odd dataTable-white leading-13" key={index}>
            <td>
              <div className={"asset padding-4"}>
                <span
                  className={
                    item.type === "green"
                      ? "greenText"
                      : item.type === "red"
                      ? "redText"
                      : ""
                  }
                >
                  {formatCurrency(
                    item?.price,
                    dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                  )}
                </span>
              </div>
            </td>
            <td>
              <div className="asset padding-4">
                <span className="">
                  {formatCurrency(
                    item?.amount,
                    dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                  )}
                </span>
              </div>
            </td>
            <td>
              <div className="asset padding-4">
                <span className="">{item?.time}</span>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
};

export default TradesTable;
