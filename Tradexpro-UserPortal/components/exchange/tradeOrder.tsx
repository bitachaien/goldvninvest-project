import { formatCurrency, formateData } from "common";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import NotLoggedin from "./notLoggedin";

const TradeOrder = ({ tradeOrder, tradeOrderHistory }: any) => {
  const { t } = useTranslation("common");
  const { dashboard } = useSelector((state: RootState) => state.exchange);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <div
      className={"tab-pane fade" + (tradeOrder ? " show active" : "")}
      id="Funds"
      role="tabpanel"
      aria-labelledby="Funds-tab"
    >
      {isLoggedIn && (
        <div className="table-responsive order-history-table-min-h !tradex-overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="pl-0">
                  {t("Transaction id")}
                </th>
                <th scope="col">
                  {" "}
                  {t("Fees")}({dashboard?.order_data?.base_coin})
                </th>
                <th scope="col">
                  {t("Amount")}({dashboard?.order_data?.trade_coin})
                </th>
                <th scope="col">
                  {t("Price")}({dashboard?.order_data?.base_coin})
                </th>
                <th scope="col">
                  {" "}
                  {t("Processed")}({dashboard?.order_data?.base_coin})
                </th>
                <th scope="col">{t("Created At")}</th>
              </tr>
            </thead>
            <tbody>
              {tradeOrderHistory?.map((order: any, index: number) => (
                <tr key={index}>
                  <td className="pl-0">{order.transaction_id}</td>
                  <td>
                    {formatCurrency(
                      order.fees,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>
                    {formatCurrency(
                      order.amount,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>
                    {formatCurrency(
                      order.price,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>
                    {formatCurrency(
                      order.total,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>{formateData(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoggedIn && <NotLoggedin />}
    </div>
  );
};

export default TradeOrder;
