import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";

import SelectDeposit from "components/deposit/selectDeposit";
import LaunchPad from "components/ico/LaunchPad";

import BankPayment from "components/ico/payment/Bank-payment";
import CryptoPayment from "components/ico/payment/CryptoPayment";
import PaypalPayment from "components/ico/payment/PaypalPayment";
import StripePayment from "components/ico/payment/StripePayment";
import Paystack from "components/ico/payment/paystack";
import {
  BANK_DEPOSIT,
  CRYPTO_DEPOSIT,
  PAYPAL,
  PHASE_SORT_BY_RECENT,
  STRIPE,
  PAYSTACK,
} from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  getLaunchpadListDetailsAction,
  TokenBuyPageAction,
} from "state/actions/launchpad";

const Index = () => {
  const { t } = useTranslation("common");
  const [selectedMethod, setSelectedMethod] = useState<any>({
    method: null,
  });
  const [launchpadListDetails, setLaunchpadListDetails]: any = useState([]);
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>({
    phase_id: 0,
    token_id: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<any>({});
  useEffect(() => {
    TokenBuyPageAction(setPageInfo, setLoading);
  }, []);
  useEffect(() => {
    setInitialData({
      phase_id: router.query.phase_id,
      token_id: router.query.token_id,
    });
  }, [router.query]);

  useEffect(() => {
    getLaunchpadListDetailsAction(
      setLaunchpadListDetails,
      router.query.phase_id,
      setPageLoading
    );
  }, []);
  useEffect(() => {
    if (
      !pageInfo ||
      !pageInfo?.payment_methods ||
      pageInfo?.payment_methods?.length == 0
    ) {
      return;
    }

    setSelectedMethod({
      method: pageInfo?.payment_methods[0]?.payment_method,
      method_id: pageInfo?.payment_methods[0]?.id,
    });
  }, [pageInfo?.payment_methods]);

  return (
    <div>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
              <div className=" tradex-space-y-4">
                <div className=" tradex-space-y-2">
                  <h2 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                    {t("Token Payment")}
                  </h2>
                </div>
                <div className=" tradex-flex tradex-items-center tradex-gap-5">
                  <Link href={"/ico"}>
                    <div className=" tradex-cursor-pointer tradex-flex tradex-gap-2 tradex-items-center tradex-text-title">
                      <FaArrowLeft />
                      <h2 className=" tradex-text-xl tradex-leading-6 !tradex-text-title">
                      {t("Homepage")}
                      </h2>
                    </div>
                  </Link>
                  <div className=" tradex-w-full tradex-h-[1px] tradex-bg-background-primary"></div>
                </div>
              </div>

              {loading || pageLoading ? (
                <SectionLoading />
              ) : (
                <div className=" tradex-space-y-6">
                  <LaunchPad
                    viewMore={false}
                    data={launchpadListDetails.data}
                    core={PHASE_SORT_BY_RECENT}
                    // image={false}
                    link={false}
                  />
                  <div className=" tradex-space-y-4">
                    {pageInfo?.payment_methods?.length > 0 ? (
                      <h4 className="tradex-text-[32px] tradex-leading-[38px] !tradex-text-title tradex-font-bold ">
                        {t("Select method")}
                      </h4>
                    ) : (
                      <div className="cp-user-title text-center section-padding-custom">
                        {/* <h4>{t("No Avaiable payment method")}</h4> */}
                        <NoItemFound
                          message={t("No Avaiable payment method")}
                        />
                      </div>
                    )}

                    {pageInfo?.payment_methods?.length > 0 && (
                      <SelectDeposit
                        setSelectedMethod={setSelectedMethod}
                        depositInfo={pageInfo}
                        selectedMethod={selectedMethod}
                      />
                    )}
                    {pageInfo?.payment_methods?.length > 0 && (
                      <div>
                        {loading ? (
                          <SectionLoading />
                        ) : (
                          <div>
                            {parseInt(selectedMethod.method) ===
                            CRYPTO_DEPOSIT ? (
                              <CryptoPayment
                                initialData={initialData}
                                walletlist={pageInfo?.wallet}
                                phaseData={launchpadListDetails.data}
                              />
                            ) : parseInt(selectedMethod.method) ===
                              BANK_DEPOSIT ? (
                              <BankPayment
                                pageInfo={pageInfo}
                                initialData={initialData}
                                phaseData={launchpadListDetails.data}
                              />
                            ) : parseInt(selectedMethod.method) === STRIPE ? (
                              <StripePayment
                                initialData={initialData}
                                pageInfo={pageInfo}
                                phaseData={launchpadListDetails.data}
                              />
                            ) : parseInt(selectedMethod.method) === PAYSTACK ? (
                              <Paystack
                                pageInfo={pageInfo}
                                initialData={initialData}
                                phaseData={launchpadListDetails.data}
                              />
                            ) : parseInt(selectedMethod.method) === PAYPAL ? (
                              <PaypalPayment
                                initialData={initialData}
                                pageInfo={pageInfo}
                                phaseData={launchpadListDetails.data}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                        <div className="text-center w-full">
                          {!selectedMethod.method &&
                            pageInfo?.payment_methods?.length > 0 && (
                              <NoItemFound message="No payment method selected" />
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/ico");
  return {
    props: {},
  };
};
