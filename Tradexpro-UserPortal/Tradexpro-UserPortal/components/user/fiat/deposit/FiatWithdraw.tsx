import React, { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Footer from "components/common/footer";

import SectionLoading from "components/common/SectionLoading";
import {
  getFiatWithdrawDataApi,
  submitFiatWithdrawDataApi,
} from "service/fiat-wallet";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SelectWithdrawl from "components/deposit/SelectWithdrawl";
import { BANK_DEPOSIT } from "helpers/core-constants";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";

const FiatWithdraw = ({ currency_type }: any) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [loading, setLoading]: any = useState<any>(false);
  const [banks, setBanks] = useState<any>([]);
  const [paymentMethods, setPaymentMethods] = useState<any>([]);
  const [amount, setAmount] = useState<any>();
  const [selectedBankId, setSelectedBankId] = useState<any>();
  // const [selectedPaymentMethod, setPaymentMethod] = useState<any>();
  const [paymentInfo, setPaymentInfo] = useState<any>("");
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<any>({
    method: null,
    method_id: null,
  });
  useEffect(() => {
    getFiatWithdrawData();
  }, []);
  const getFiatWithdrawData = async () => {
    setLoading(true);
    const data = await getFiatWithdrawDataApi();

    if (!data.success) {
      toast.error(data.message);
      router.push(`/user/my-wallet`);
      setLoading(false);

      return;
    }
    const paymentMethod4 = data.data.payment_method_list.find(
      (method: any) => method.payment_method == 4
    );
    // if (paymentMethod4) {
    //   setPaymentMethod(paymentMethod4);
    // }
    setSelectPaymentMethod({
      method: data.data.payment_method_list[0]?.payment_method ?? null,
      method_id: data.data.payment_method_list[0]?.id ?? null,
    });
    setBanks(data.data.my_bank);
    setPaymentMethods(data.data.payment_method_list);
    setLoading(false);
  };

  const fiatSubmitFormHandler = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    const data = await submitFiatWithdrawDataApi(
      currency_type,
      amount,
      selectedBankId,
      selectPaymentMethod?.method_id,
      selectPaymentMethod?.method,
      paymentInfo
    );

    if (!data.success) {
      toast.error(data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success(data.message);
    router.push(`/user/wallet-history?type=withdrawal`);
  };
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D]  tradex-px-5 md:tradex-px-10 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <div className=" tradex-space-y-4  tradex-pb-4  tradex-border-b tradex-border-background-primary">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                  {t("Fiat Withdrawal")}
                </h2>
                <Link href="/user/my-wallet">
                  <a className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-base !tradex-text-body">
                    <IoIosArrowBack size={25} />
                    <p>{t("My Wallet")}</p>
                  </a>
                </Link>
              </div>
              <div>
                <SelectWithdrawl
                  setSelectedMethod={setSelectPaymentMethod}
                  depositInfo={paymentMethods}
                  selectedMethod={selectPaymentMethod}
                />
                <div className="asset-balances-area">
                  <div className="ico-create-form col-12">
                    {loading ? (
                      <SectionLoading />
                    ) : (
                      <form className="row" onSubmit={fiatSubmitFormHandler}>
                        <div className="col-md-6 form-input-div">
                          <label className="ico-label-box" htmlFor="">
                            {t("Select Wallet")}
                          </label>
                          <input
                            type="text"
                            required
                            name="amount"
                            className={`ico-input-box`}
                            readOnly
                            value={currency_type}
                          />
                        </div>

                        <div className="col-md-6 form-input-div">
                          <label className="ico-label-box" htmlFor="">
                            {t("Amount")}
                          </label>
                          <input
                            type="text"
                            required
                            name="amount"
                            className={`ico-input-box`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        {parseInt(selectPaymentMethod?.method) ===
                        BANK_DEPOSIT ? (
                          <div className="col-md-6 form-input-div">
                            <label className="ico-label-box" htmlFor="">
                              {t("Select Bank")}
                            </label>
                            <select
                              name="bank_list"
                              className={`ico-input-box `}
                              required
                              onChange={(e) =>
                                setSelectedBankId(e.target.value)
                              }
                            >
                              <option value="">{t("Select Bank List")}</option>
                              {banks?.map((item: any, index: number) => (
                                <option value={item.id} key={index}>
                                  {item.bank_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="col-md-12 form-input-div">
                            <label className="ico-label-box" htmlFor="">
                              {t("Payment Info")}
                            </label>
                            <textarea
                              className={`ico-input-box `}
                              value={paymentInfo}
                              onChange={(e) => {
                                setPaymentInfo(e.target.value);
                              }}
                            ></textarea>
                          </div>
                        )}

                        <div className="col-md-12 form-input-div">
                          <button type="submit" className="primary-btn">
                            {loading ? t("Loading..") : t("Submit Withdrawl")}
                          </button>
                        </div>
                      </form>
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
export default FiatWithdraw;
