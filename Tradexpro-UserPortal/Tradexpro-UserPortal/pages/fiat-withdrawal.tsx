import FiatSidebar from "layout/fiat-sidebar";
import {
  pageAvailabilityCheck,
  SSRAuthCheck,
} from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { customPage, landingPage } from "service/landing-page";
import { GetUserInfoByTokenServer } from "service/user";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";
import {
  apiFiatWithdrawalAction,
  fiatWithdrawProcessAction,
  getFiatWithdrawalRateAction,
} from "state/actions/fiat-deposit-withawal";
import SectionLoading from "components/common/SectionLoading";
import SelectWithdrawl from "components/deposit/SelectWithdrawl";
import { BANK_DEPOSIT } from "helpers/core-constants";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import FiatHeader from "components/fiat/FiatHeader";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import FiatSidebarTabs from "components/fiat/FiatSidebarTabs";

const FiatWithdrawal = () => {
  const { t } = useTranslation("common");
  const [loading, setLoading]: any = useState<any>(false);
  const [initialData, setInitialData]: any = useState<any>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>({
    method: null,
    method_id: null,
  });
  const [rateCred, setRateCred]: any = useState<any>({
    wallet_id: "",
    currency: "",
    amount: "",
    type: "fiat",
    bank_id: "",
    payment_method_id: "",
    payment_method_type: "",
    payment_info: "",
  });
  const [converted_value, setConverted_value] = useState(0);
  const [fees, setFees] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [currency, setcurrency] = useState("");
  const [selectedPaymentMethod, setPaymentMethod] = useState<any>();
  const getRate = async () => {
    if (rateCred.wallet_id && rateCred.currency && rateCred.amount) {
      const response = await getFiatWithdrawalRateAction({
        wallet_id: rateCred.wallet_id,
        currency: rateCred.currency,
        amount: rateCred.amount,
      });

      setConverted_value(response.data.convert_amount);
      setFees(response.data.fees);
      setNetAmount(response.data.net_amount);
      setcurrency(response.data.currency);
    }
  };
  useEffect(() => {
    getRate();
  }, [rateCred?.amount, rateCred?.wallet_id, rateCred?.currency]);

  useEffect(() => {
    apiFiatWithdrawalAction(setInitialData, setLoading, setPaymentMethod);
  }, []);

  useEffect(() => {
    setRateCred({
      wallet_id: "",
      currency: "",
      amount: "",
      type: "fiat",
      bank_id: "",
      payment_method_id: selectedMethod?.method_id,
      payment_method_type: selectedMethod?.method,
      payment_info: "",
    });
    setConverted_value(0);
    setNetAmount(0);
    setFees(0);
    setcurrency("");
  }, [selectedMethod]);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <FiatSidebarTabs />
              <div className=" lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Crypto To Fiat Withdrawal")}
                    </h2>
                    <p className=" tradex-text-xl tradex-text-title tradex-font-bold">
                      {t("Select method")}
                    </p>
                  </div>
                  <SelectWithdrawl
                    setSelectedMethod={setSelectedMethod}
                    depositInfo={initialData?.payment_method_list}
                    selectedMethod={selectedMethod}
                  />
                  <div className="">
                    {!loading && !selectedMethod.method ? (
                      <div className="cp-user-title text-center  section-padding-custom">
                        <h4>{t("No Avaiable payment method")}</h4>
                      </div>
                    ) : (
                      <div>
                        <form
                          className=" tradex-space-y-6"
                          onSubmit={(e) => {
                            e.preventDefault();
                            fiatWithdrawProcessAction(rateCred, setLoading);
                          }}
                        >
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label tradex-mb-0"
                              htmlFor=""
                            >
                              {t("Select Wallet")}
                            </label>
                            <select
                              name="wallet"
                              className={`tradex-input-field !tradex-text-sm !tradex-text-title !tradex-bg-background-primary !tradex-border-0`}
                              value={rateCred?.wallet_id}
                              required
                              onChange={(e: any) => {
                                setRateCred({
                                  ...rateCred,
                                  wallet_id: e.target.value,
                                });
                              }}
                            >
                              <option value="">
                                {t("Select Your Wallet")}
                              </option>
                              {initialData?.my_wallet?.map(
                                (item: any, index: number) => (
                                  <option value={item.encryptId} key={index}>
                                    {item.coin_type}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label tradex-mb-0"
                              htmlFor=""
                            >
                              {t("Select Currency")}
                            </label>
                            <select
                              name="coin_list"
                              value={rateCred?.currency}
                              required
                              className={`tradex-input-field !tradex-text-sm !tradex-text-title !tradex-bg-background-primary !tradex-border-0`}
                              onChange={(e: any) => {
                                setRateCred({
                                  ...rateCred,
                                  currency: e.target.value,
                                });
                              }}
                            >
                              <option value="">{t("Select Currency")}</option>
                              {initialData?.currency?.map(
                                (item: any, index: number) => (
                                  <option key={index} value={item.code}>
                                    {item.name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label tradex-mb-0"
                              htmlFor=""
                            >
                              {t("Amount")}
                            </label>
                            <input
                              type="text"
                              required
                              value={rateCred?.amount}
                              onChange={(e) => {
                                setRateCred({
                                  ...rateCred,
                                  amount: e.target.value,
                                });
                                // getFiatWithdrawalRateAction(rateCred);
                              }}
                              name="amount"
                              className={`tradex-input-field !tradex-text-sm`}
                            />
                          </div>

                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label tradex-mb-0"
                              htmlFor=""
                            >
                              {t("Amount Convert Price")}
                            </label>
                            <input
                              type="text"
                              disabled
                              value={converted_value}
                              required
                              name="convert_price"
                              className={`tradex-input-field !tradex-text-sm`}
                            />
                            <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-text-sm">
                              <span>
                                {t("Fees:")}
                                {fees}
                              </span>
                              <span>
                                {t("Net Amount:")}
                                {netAmount}
                                {currency}
                              </span>
                            </div>
                          </div>
                          {parseInt(selectedMethod.method) === BANK_DEPOSIT ? (
                            <div className="tradex-space-y-2">
                              <label
                                className="tradex-input-label tradex-mb-0"
                                htmlFor=""
                              >
                                {t("Select Bank")}
                              </label>
                              <select
                                name="bank_list"
                                className={`tradex-input-field !tradex-text-sm !tradex-text-title !tradex-bg-background-primary !tradex-border-0`}
                                required
                                value={rateCred?.bank_id}
                                onChange={(e) => {
                                  setRateCred({
                                    ...rateCred,
                                    bank_id: e.target.value,
                                  });
                                }}
                              >
                                <option value="">
                                  {t("Select Bank List")}
                                </option>
                                {initialData?.my_bank?.map(
                                  (item: any, index: number) => (
                                    <option value={item.id} key={index}>
                                      {item.bank_name}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          ) : (
                            <div className="tradex-space-y-2">
                              <label className="tradex-input-label" htmlFor="">
                                {t("Payment Info")}
                              </label>
                              <textarea
                                className={`tradex-input-field !tradex-text-sm`}
                                value={rateCred?.payment_info}
                                onChange={(e) => {
                                  setRateCred({
                                    ...rateCred,
                                    payment_info: e.target.value,
                                  });
                                }}
                              ></textarea>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                          >
                            {loading ? t("Loading..") : t("Submit Withdrawl")}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
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
  await SSRAuthCheck(ctx, "/user/profile");
  const commonRes = await pageAvailabilityCheck();

  if (parseInt(commonRes.currency_deposit_status) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
export default FiatWithdrawal;
