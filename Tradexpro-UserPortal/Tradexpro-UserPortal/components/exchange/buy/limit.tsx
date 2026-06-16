import { formatCurrency, formateZert } from "common";
import RangeSlider from "components/dashboard/RangeSlider";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { buyLimitAppAction } from "state/actions/exchange";
import { RootState } from "state/store";

const Limit = ({
  dashboard,
  buySellLimitCoinData,
  setBuySellLimitCoinData,
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
  const { validationRulesForSpot } = useSelector(
    (state: RootState) => state.exchange
  );
  const setAmountBasedOnPercentage = (percentage: any) => {
    const { maker_fees, taker_fees } = dashboard.fees_settings;
    const amount =
      parseFloat(dashboard?.order_data?.total?.base_wallet?.balance) /
      parseFloat(buySellLimitCoinData.price);
    const feesPercentage =
      parseFloat(maker_fees) > parseFloat(taker_fees)
        ? parseFloat(maker_fees)
        : parseFloat(taker_fees);
    const total = amount * percentage * parseFloat(buySellLimitCoinData.price);
    const fees = (total * feesPercentage) / 100;
    setBuySellLimitCoinData({
      ...buySellLimitCoinData,
      amount: (total - fees) / parseFloat(buySellLimitCoinData.price),
      total: total - fees,
    });
  };

  const validatePrice = (price: number) => {
    const { low_tolerence, high_tolerence } = validationRulesForSpot;

    if (low_tolerence !== undefined && high_tolerence !== undefined) {
      const low = parseFloat(low_tolerence);
      const high = parseFloat(high_tolerence);

      if (price < low) {
        toast.error(`Price is too low. It must be at least ${low}.`);
        return false;
      }

      if (price > high) {
        toast.error(`Price is too high. It must be at most ${high}.`);
        return false;
      }

      return true;
    }

    return true;
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
              <form id="buy-form" className="overflow-hidden">
                <input
                  type="hidden"
                  name="_token"
                  defaultValue="g2OWJq3pDqYRQmVvmGt799aCsDmkkV4UjrWDhzcF"
                />
                <div className="form-group">
                  <div className="total-top">
                    <label>{t("Total")}</label> <label>{t("Available")}</label>
                  </div>
                  <div className="total-top-blance">
                    <div className="total-blance">
                      <span className="text-warning mr-1 font-bold">
                        <span>
                          {dashboard?.order_data?.total?.base_wallet?.balance
                            ? formatCurrency(
                                dashboard?.order_data?.total?.base_wallet
                                  ?.balance,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )
                            : 0}
                        </span>
                      </span>
                      <span className="text-warning font-bold">
                        <span className="trade_coin_type">
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
                        </span>
                      </span>
                    </div>
                    <div className="avilable-blance">
                      <span className="text-warning font-bold">
                        <span>
                          {" "}
                          {dashboard?.order_data?.total?.base_wallet?.balance
                            ? formatCurrency(
                                dashboard?.order_data?.total?.base_wallet
                                  ?.balance,
                                dashboard?.order_data?.total?.trade_wallet
                                  ?.pair_decimal
                              )
                            : 0}
                        </span>
                      </span>
                      <span className="text-warning ml-1 font-bold">
                        <span className="trade_coin_type">
                          {dashboard?.order_data?.total?.base_wallet?.coin_type}
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
                    placeholder="0"
                    className="form-control number_only input_1"
                    value={buySellLimitCoinData.price}
                    onChange={(e) => {
                      if (parseFloat(e.target.value) < 0) {
                        setBuySellLimitCoinData({
                          ...buySellLimitCoinData,
                          price: 0,
                          total: 0,
                        });
                        return;
                      }
                      setBuySellLimitCoinData({
                        ...buySellLimitCoinData,
                        price: e.target.value,
                        total:
                          parseFloat(e.target.value) *
                          buySellLimitCoinData.amount,
                      });
                    }}
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
                    name="amount"
                    type="number"
                    placeholder="0"
                    className="form-control number_only input_2"
                    value={
                      buySellLimitCoinData.amount !== 0 &&
                      buySellLimitCoinData.amount
                    }
                    onChange={(e) => {
                      if (parseFloat(e.target.value) < 0) {
                        setBuySellLimitCoinData({
                          ...buySellLimitCoinData,
                          amount: 0,
                          total: 0,
                        });
                        return;
                      }
                      setBuySellLimitCoinData({
                        ...buySellLimitCoinData,
                        amount: e.target.value,
                        total:
                          parseFloat(e.target.value) *
                          buySellLimitCoinData.price,
                      });
                    }}
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.trade_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                <div className="form-group mt-3 boxShadow">
                  <label className="cstmHead">{t("Total Amount")}</label>

                  <input
                    disabled
                    name="total_amount"
                    type="text"
                    placeholder=""
                    className="form-control number_only input_3"
                    value={
                      Number(parseFloat(buySellLimitCoinData.total).toFixed(8))
                        ? parseFloat(buySellLimitCoinData.total).toFixed(8)
                        : 0
                    }
                  />
                  <span className="text-warning blns font-bold">
                    <span className="trade_coin_type">
                      {dashboard?.order_data?.total?.base_wallet?.coin_type}
                    </span>
                  </span>
                </div>
                {isLoggedIn && (
                  <RangeSlider
                    items={buySellSliderRanges}
                    handleFunc={setAmountBasedOnPercentage}
                    idPrefix="buyLimit"
                  />
                )}

                {!isLoggedIn ? (
                  <div className="form-group  mt-4">
                    <Link href="/signin">
                      <a className="btn theme-btn-red bg-primary-color theme-spot-btn-green">
                        {t("Login")}
                      </a>
                    </Link>
                  </div>
                ) : loading ? (
                  <div className="form-group  mt-4">
                    <button
                      type="submit"
                      className="btn  theme-btn bg-primary-color theme-spot-btn-green"
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
                      className="btn bg-primary-color theme-btn theme-spot-btn-green"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (!validatePrice(buySellLimitCoinData.price)) {
                          return;
                        }
                        await buyLimitAppAction(
                          buySellLimitCoinData.amount,
                          buySellLimitCoinData.price,
                          dashboard?.order_data?.trade_coin_id,
                          dashboard?.order_data?.base_coin_id,
                          setLoading,
                          setBuySellLimitCoinData
                        );
                        // await dispatch(getDashboardData(currentPair));
                        setBuySellLimitCoinData({
                          ...buySellLimitCoinData,
                          amount: 0,
                          total: 0,
                        });
                      }}
                    >
                      <span v-else="">
                        {" "}
                        {t("Buy")}{" "}
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

export default Limit;
