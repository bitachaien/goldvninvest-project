import { formatCurrency } from "common";
import RangeSlider from "components/dashboard/RangeSlider";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import {
  getDashboardData,
  initialDashboardCallAction,
  sellMarketAppAction,
} from "state/actions/exchange";

const Market = ({
  dashboard,
  buySellMarketCoinData,
  setBuySellMarketCoinData,
  isLoggedIn,
  currentPair,
}: any) => {
  const buySellSliderRanges = [
    {
      percent: 0.25,
    },
    {
      percent: 0.5,
    },
    {
      percent: 0.75,
    },
    {
      percent: 1,
    },
  ];
  const { t } = useTranslation("common");
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const setAmountBasedOnPercentage = (percentage: any) => {
    const amountPercentage =
      parseFloat(dashboard?.order_data?.total?.trade_wallet?.balance) *
      percentage;
    setBuySellMarketCoinData({
      ...buySellMarketCoinData,
      amount: amountPercentage,
      total: amountPercentage * parseFloat(buySellMarketCoinData.price),
    });
  };
  return (
    <div id="BuyTabContent" className="tab-content p-0">
      <div
        id="imit"
        role="tabpanel"
        aria-labelledby="Limit-tab"
        className="tab-pane fade show active"
      >
        <div className="row">
          <div className="col-md-12">
            <div className="cp-user-profile-info">
              <form id="buy-form">
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="g2OWJq3pDqYRQmVvmGt799aCsDmkkV4UjrWDhzcF"
                />
                <div className="form-group ">
                  <div className="total-top">
                    <label>{t("Total")}</label> <label>{t("Available")}</label>
                  </div>
                  <div className="total-top-blance">
                    <div className="total-blance">
                      <span className="text-warning font-bold">
                        <span>
                          {dashboard?.order_data?.total?.trade_wallet?.balance
                            ? formatCurrency(
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.balance,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )
                            : 0}
                        </span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="trade_coin_type ml-1">
                          {
                            dashboard?.order_data?.total?.trade_wallet
                              ?.coin_type
                          }
                        </span>
                      </span>
                    </div>
                    <div className="avilable-blance">
                      <span className="text-warning font-bold">
                        <span>
                          {dashboard?.order_data?.total?.trade_wallet?.balance
                            ? formatCurrency(
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.balance,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )
                            : 0}
                        </span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="trade_coin_type ml-1">
                          {
                            dashboard?.order_data?.total?.trade_wallet
                              ?.coin_type
                          }
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Price")}</label>
                  <input
                    name="price"
                    type="text"
                    placeholder=""
                    className="form-control number_only"
                    value={"Market"}
                    disabled
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Amount")}</label>
                  <input
                    min={0}
                    name="amount"
                    type="number"
                    placeholder="0"
                    className="form-control number_only"
                    value={
                      buySellMarketCoinData?.amount !== 0 &&
                      buySellMarketCoinData?.amount
                    }
                    onChange={async (e) => {
                      if (parseFloat(e.target.value) < 0) {
                        setBuySellMarketCoinData({
                          ...buySellMarketCoinData,
                          amount: 0,
                          total: 0,
                        });
                        return;
                      }
                      setBuySellMarketCoinData({
                        ...buySellMarketCoinData,
                        amount: e.target.value,
                        total:
                          parseFloat(e.target.value) *
                          buySellMarketCoinData.price,
                      });
                    }}
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                {/* <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Total Amount")}</label>

                  <input
                    disabled
                    name="total_amount"
                    type="text"
                    placeholder=""
                    className="form-control number_only input_3"
                    value={
                      Number(parseFloat(buySellMarketCoinData.total).toFixed(8))
                        ? parseFloat(buySellMarketCoinData.total).toFixed(8)
                        : 0
                    }
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div> */}
                {isLoggedIn && (
                  <RangeSlider
                    items={buySellSliderRanges}
                    handleFunc={setAmountBasedOnPercentage}
                    idPrefix="sellMarket"
                  />
                )}
                {!isLoggedIn ? (
                  <div className="form-group mt-4">
                    <Link href="/signin">
                      <a className="btn theme-btn-red bg-primary-color theme-spot-btn-red">
                        {t("Login")}
                      </a>
                    </Link>
                  </div>
                ) : loading ? (
                  <div className="form-group mt-4">
                    <button
                      type="submit"
                      className="btn theme-btn-red bg-primary-color theme-spot-btn-red"
                    >
                      <span v-if="limitBuyData.placingOrder">
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {t("Placing Order...")}
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="form-group mt-4">
                    <button
                      type="submit"
                      className="btn theme-btn-red bg-primary-color theme-spot-btn-red"
                      onClick={async (e) => {
                        e.preventDefault();
                        await sellMarketAppAction(
                          buySellMarketCoinData.amount,
                          buySellMarketCoinData?.price,
                          dashboard?.order_data?.trade_coin_id,
                          dashboard?.order_data?.base_coin_id,
                          setLoading
                        );
                        // await dispatch(getDashboardData(currentPair));
                        setBuySellMarketCoinData({
                          ...buySellMarketCoinData,
                          amount: 0,
                          total: 0,
                        });
                      }}
                    >
                      <span v-else="">
                        {" "}
                        {t("Sell")}{" "}
                        {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                      </span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
