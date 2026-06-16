// import BankDeposit from "components/deposit/bank-deposit";
import WalletDeposit from "components/deposit/wallet-deposit";
import StripeDeposit from "components/deposit/stripe-deposit";
import {
  BANK_DEPOSIT,
  FAQ_TYPE_DEPOSIT,
  PAYPAL,
  STRIPE,
  WALLET_DEPOSIT,
  PAYSTACK,
  PERFECT_MONEY,
  MOBILE_MONEY,
  PAYDUNYA,
} from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { currencyDeposit } from "service/deposit";
import SelectDeposit from "components/deposit/selectDeposit";
import DepositFaq from "components/deposit/DepositFaq";
import PaypalSection from "components/deposit/PaypalSection";
import SectionLoading from "components/common/SectionLoading";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { getFaqList } from "service/faq";
import { GetServerSideProps } from "next";
import {
  pageAvailabilityCheck,
  SSRAuthCheck,
} from "middlewares/ssr-authentication-check";
import { parseCookies } from "nookies";
import Footer from "components/common/footer";
import FiatSidebar from "layout/fiat-sidebar";
import Paystack from "components/deposit/paystack";
import BankDeposit from "components/user/fiat/deposit/BankDeposit";
import { getFiatDepositDataApi } from "service/fiat-wallet";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import SelectFiatDepositMethod from "components/deposit/SelectFiatDepositMethod";
import FiatPaypalSection from "components/deposit/FiatPaypalSection";
import FiatStripeDeposit from "components/deposit/FiatStripeDeposit";
import FiatPaystack from "components/deposit/FiatPaystack";
import FiatPerfectMoney from "components/deposit/FiatPerfectMoney";
import FiatMobileMoney from "components/deposit/FiatMobileMoney";
import FiatPaydunya from "components/deposit/FiatPaydunya";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const FiatDeposit = ({ currency_type, wallet_id }: any) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const { settings } = useSelector((state: RootState) => state.common);
  const [methods, setMethods] = useState<any>();
  const [banks, setBanks] = useState<any>([]);
  const [mobileBanks, setMobileBanks] = useState<any>([]);
  const [currencyLists, setCurrencyLists] = useState([]);

  const [selectedMethods, setSelectedMethods] = useState<any>({
    method: null,
    method_id: null,
  });

  useEffect(() => {
    getFiatDepositData();
  }, []);
  const getFiatDepositData = async () => {
    setLoading(true);

    const data = await getFiatDepositDataApi();

    if (!data.success) {
      toast.error(data.message);
      router.push(`/user/my-wallet`);
      setLoading(false);

      return;
    }
    setBanks(data.data.banks);
    setCurrencyLists(data.data.currency_list);
    setMobileBanks(data.data.mobile_money_list);
    setMethods(data.data.payment_methods);
    setSelectedMethods({
      method:
        data?.data?.payment_methods[0] &&
        data?.data?.payment_methods[0].payment_method,
      method_id:
        data?.data?.payment_methods[0] && data?.data?.payment_methods[0].id,
    });
    setLoading(false);
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
                  {t("Fiat Deposit")}
                </h2>
                <Link href="/user/my-wallet">
                  <a className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-base !tradex-text-body">
                    <IoIosArrowBack size={25} />
                    <p>{t("My Wallet")}</p>
                  </a>
                </Link>
              </div>
              <div>
                <SelectFiatDepositMethod
                  setSelectedMethods={setSelectedMethods}
                  methods={methods}
                  selectedMethods={selectedMethods}
                />
                <div className="row">
                  {loading ? (
                    <SectionLoading />
                  ) : (
                    <div className={`col-lg-12 col-sm-12 `}>
                      {!loading && !selectedMethods.method ? (
                        <div className="cp-user-title text-center  section-padding-custom">
                          <h4>{t("No Avaiable payment method")}</h4>
                        </div>
                      ) : (
                        ""
                      )}
                      {parseInt(selectedMethods.method) === BANK_DEPOSIT && (
                        <BankDeposit
                          method_id={selectedMethods.method_id}
                          banks={banks}
                          currency_type={currency_type}
                        />
                      )}

                      {parseInt(selectedMethods.method) === STRIPE && (
                        <FiatStripeDeposit
                          method_id={selectedMethods.method_id}
                          banks={banks}
                          currency_type={currency_type}
                        />
                      )}

                      {parseInt(selectedMethods.method) === PAYPAL && (
                        <FiatPaypalSection
                          method_id={selectedMethods.method_id}
                          banks={banks}
                          currency_type={currency_type}
                        />
                      )}

                      {parseInt(selectedMethods.method) === PAYSTACK && (
                        <FiatPaystack
                          method_id={selectedMethods.method_id}
                          currency_type={currency_type}
                          wallet_id={wallet_id}
                        />
                      )}

                      {parseInt(selectedMethods.method) === PAYDUNYA && (
                        <FiatPaydunya
                          currency_type={currency_type}
                          method_id={selectedMethods.method_id}
                          wallet_id={wallet_id}
                        />
                      )}

                      {parseInt(selectedMethods.method) === PERFECT_MONEY && (
                        <FiatPerfectMoney
                          method_id={selectedMethods.method_id}
                          currency_type={currency_type}
                          currencyLists={currencyLists}
                        />
                      )}

                      {parseInt(selectedMethods.method) === MOBILE_MONEY && (
                        <FiatMobileMoney
                          method_id={selectedMethods.method_id}
                          currency_type={currency_type}
                          mobiles={mobileBanks}
                        />
                      )}
                    </div>
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
export default FiatDeposit;
