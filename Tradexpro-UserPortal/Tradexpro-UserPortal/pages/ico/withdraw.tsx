import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import WithdrawTopCardItem from "components/ico/WithdrawTopCardItem";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { customPage, landingPage } from "service/landing-page";
import { getTokenWithdrawPrice, withDrawMoney } from "service/launchpad";
import { getEarningDetailsAction } from "state/actions/launchpad";

const Withdraw = () => {
  const { t } = useTranslation("common");
  const [loading, setLoading]: any = useState<any>(false);
  const [data, setData]: any = useState<any>();
  const [amount, setamount]: any = useState<any>();
  const [amountInfo, setAmountInfo] = useState<any>();
  const [selectedCurrency, setSelectedCurrency] = useState<any>();
  const [currencyFiat, setCurrencyFiat]: any = useState<any>();
  const [currencyCoin, setCurrencyCoin]: any = useState<any>();
  const [currencyType, setCurrencyType]: any = useState<any>();
  const [paymentDetails, setPaymentDetails] = useState<any>("");

  const getTokenwithdrawPrice = async () => {
    if (amount && currencyType && selectedCurrency) {
      const payload = {
        amount,
        currency_type: currencyType,
        currency_to: selectedCurrency,
      };
      const response = await getTokenWithdrawPrice(payload);
      setAmountInfo(response);
    }
  };
  const withDrawMoneyApi = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (amount && currencyType && selectedCurrency) {
      let payload: any = {
        amount,
        currency_type: currencyType,
        currency_to: selectedCurrency,
      };
      if (currencyType == 1) {
        payload = {
          ...payload,
          payment_details: paymentDetails,
        };
      }
      const response = await withDrawMoney(payload);
      setLoading(false);

      if (response.success === true) {
        toast.success(response.message);
        getTokenwithdrawPrice();
      } else {
        toast.error(response.message);
        setCurrencyType("");
        getTokenwithdrawPrice();
      }
    }
  };
  // ;
  useEffect(() => {
    getTokenwithdrawPrice();
  }, [currencyType, amount, selectedCurrency]);
  useEffect(() => {
    getEarningDetailsAction(setLoading, setData);
  }, []);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6">
              <div className="lg:tradex-col-span-3">
                <LaunchpadSidebar />
              </div>
              <div className=" lg:tradex-col-span-9">
                <div>
                  {loading ? (
                    <div className="mt-4">
                      <SectionLoading />
                    </div>
                  ) : (
                    <>
                      <form
                        onSubmit={withDrawMoneyApi}
                        className=" tradex-space-y-8"
                      >
                        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                          <h4 className=" tradex-pb-5 tradex-border-b tradex-border-background-primary tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                            {t("Withdraw")}
                          </h4>

                          <div className=" tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-3 tradex-gap-6">
                            <WithdrawTopCardItem
                              title={`${data?.earns?.earn} ${data?.earns?.currency}`}
                              content="Total Earned"
                              img={`/total_earning_ico_withdraw.png`}
                            />
                            <WithdrawTopCardItem
                              title={`${data?.earns?.withdraw} ${data?.earns?.currency}`}
                              content="Withdrawal Amount"
                              img={`/withdraw_amount_ico_withdraw.png`}
                            />
                            <WithdrawTopCardItem
                              title={`${data?.earns?.available} ${data?.earns?.currency}`}
                              content="Available Amount"
                              img={`/avilable_amount_ico_withdraw.png`}
                            />
                          </div>

                          <div className="tradex-grid md:tradex-grid-cols-2 tradex-gap-x-6 tradex-gap-y-4">
                            <div className="tradex-space-y-2">
                              <label
                                className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                                htmlFor=""
                              >
                                {t("Amount")}
                              </label>
                              <input
                                type="number"
                                name="amount"
                                required
                                onChange={(e) => {
                                  setamount(e.target.value);
                                }}
                                className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent `}
                              />
                              {amountInfo?.success ? (
                                <p className=" tradex-text-sm tradex-text-body">
                                  {amountInfo?.data?.amount}{" "}
                                  {amountInfo?.data?.currency_from} ={" "}
                                  {amountInfo?.data?.price}{" "}
                                  {amountInfo?.data?.currency_to}
                                </p>
                              ) : (
                                <p className=" tradex-text-sm tradex-text-body">
                                  {amountInfo?.message}
                                </p>
                              )}
                            </div>
                            <div className="tradex-space-y-2">
                              <label
                                className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                                htmlFor=""
                              >
                                {t("Currency Type")}
                              </label>
                              <div className="cp-select-area">
                                <select
                                  name="coin_currency"
                                  className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main `}
                                  required
                                  onChange={(e: any) => {
                                    setPaymentDetails("");
                                    setCurrencyType(e.target.value);
                                    setSelectedCurrency("");
                                    if (parseInt(e.target.value) === 1) {
                                      setCurrencyFiat(data?.currencys);
                                    } else {
                                      setCurrencyCoin(data?.coins);
                                    }
                                  }}
                                >
                                  <option value="">
                                    {t("Select Currency Type")}
                                  </option>
                                  <option value={1}>{t("Fiat")}</option>
                                  <option value={2}>{t("Crypto")}</option>
                                </select>
                              </div>
                            </div>
                            {currencyType == 1 && (
                              <div className="tradex-space-y-2 md:tradex-col-span-2">
                                <label
                                  className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                                  htmlFor=""
                                >
                                  {t("Currency List")}
                                </label>

                                <select
                                  name="coin_currency"
                                  className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main `}
                                  required
                                  onChange={(e) => {
                                    setSelectedCurrency(e.target.value);
                                  }}
                                >
                                  <option value="">
                                    {t("Select currency")}
                                  </option>
                                  {currencyFiat.map((item: any, index: any) => (
                                    <option value={item.code} key={index}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {currencyType == 2 && (
                              <div className="tradex-space-y-2 md:tradex-col-span-2">
                                <label
                                  className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                                  htmlFor=""
                                >
                                  {t("Currency List")}
                                </label>

                                <select
                                  name="coin_currency"
                                  className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main `}
                                  required
                                  onChange={(e) => {
                                    setSelectedCurrency(e.target.value);
                                  }}
                                >
                                  <option value="">
                                    {t("Select currency")}
                                  </option>
                                  {currencyCoin?.map(
                                    (item: any, index: any) => (
                                      <option
                                        value={item.coin_type}
                                        key={index}
                                      >
                                        {item.coin_type}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            )}
                            {currencyType == 1 && (
                              <div className="tradex-space-y-2 md:tradex-col-span-2">
                                <label
                                  className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                                  htmlFor="payment_details"
                                >
                                  {t("Payment Details")}
                                </label>

                                <textarea
                                  name="payment_details"
                                  id="payment_details"
                                  className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent `}
                                  required
                                  onChange={(e) => {
                                    setPaymentDetails(e.target.value);
                                  }}
                                ></textarea>
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="primary-btn !tradex-text-white"
                        >
                          {loading ? t("Please Wait..") : t("Withdraw")}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet");
  return {
    props: {},
  };
};
export default Withdraw;
