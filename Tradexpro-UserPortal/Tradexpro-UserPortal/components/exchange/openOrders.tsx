import { formatCurrency, formateData } from "common";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrderAppAction,
  initialDashboardCallActionWithToken,
} from "state/actions/exchange";
import { RootState } from "state/store";
import NotLoggedin from "./notLoggedin";

const OpenOrders = ({ openOrders, openOrderHistory }: any) => {
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const { dashboard, currentPair } = useSelector(
    (state: RootState) => state.exchange
  );
  const dispatch = useDispatch();
  return (
    <div
      className={"tab-pane fade h-full" + (openOrders ? " show active" : "")}
      id="Open-orders"
      role="tabpanel"
      aria-labelledby="Open-orders-tab"
    >
      {isLoggedIn && (
        <div className="table-responsive order-history-table-min-h !tradex-overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="pl-0">
                  {t("Type")}
                </th>

                <th scope="col">
                  {t("Amount")}({dashboard?.order_data?.trade_coin})
                </th>
                <th scope="col">
                  {t("Fees")}({dashboard?.order_data?.base_coin})
                </th>
                <th scope="col">
                  {t("Price")}({dashboard?.order_data?.base_coin})
                </th>
                <th scope="col">
                  {t("Processed")}({dashboard?.order_data?.trade_coin})
                </th>
                <th scope="col">
                  {t("total")}({dashboard?.order_data?.base_coin})
                </th>
                <th scope="col">{t("Created at")}</th>

                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {openOrderHistory?.map((order: any, index: number) => (
                <tr key={index}>
                  <td className="pl-0">
                    <span
                      className={
                        order.type === "sell" ? "redText" : "greenText"
                      }
                    >
                      {order.type}
                    </span>
                  </td>

                  <td>
                    {formatCurrency(
                      order.amount,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>
                    {formatCurrency(
                      order.fees,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>
                    {formatCurrency(
                      order.price,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>{order.processed}</td>
                  <td>
                    {formatCurrency(
                      order.total,
                      dashboard?.order_data?.total?.trade_wallet?.pair_decimal
                    )}
                  </td>
                  <td>{formateData(order.created_at)}</td>

                  <td>
                    <button
                      className="cancel"
                      onClick={async () => {
                        await cancelOrderAppAction(order.type, order.id);
                        if (currentPair && dashboard) {
                          await dispatch(
                            initialDashboardCallActionWithToken(
                              currentPair,
                              dashboard
                            )
                          );
                        }
                      }}
                    >
                      {t("Cancel")}
                    </button>
                  </td>
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

export default OpenOrders;
