import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import { AddPostOne } from "components/P2P/AddPost/AddPostStep_one";
import { AddPostThree } from "components/P2P/AddPost/AddPostStep_three";
import { AddPostTwo } from "components/P2P/AddPost/AddPostStep_two";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import { P2pTopBar } from "components/P2P/P2pHome/TopBar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAddPostInitial } from "state/actions/p2p";

const AddPost = () => {
  const {
    data,
    loading,
    addStep,
    setAddStep,
    selectedAsset,
    selectedCurrency,
    setSelectedAsset,
    setselectedCurrency,
    pricePoint,
    priceType,
    setPriceType,
    setPricePoint,
    setSelectedPayment,
    selectedPayment,
    selectedPaymentTime,
    setSelectedPaymentTime,
    Amount,
    setAmount,
    terms,
    setTerms,
    auto_reply,
    setAuto_reply,
    selectedCountry,
    setSelectedCountry,
    registerDays,
    coinHolding,
    setregisterDays,
    setcoinHolding,
    adsType,
    UpdateP2pAdsAction,
    setAdsType,
    createUpdateP2pAdsAction,
    uid,
    getAvailableBalanceAction,
  } = useAddPostInitial();
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (data?.data?.is_payment_method_available === false) {
      router.push("/p2p/add-payment-method");
    }
  }, [data?.data?.is_payment_method_available]);
  if (loading)
    return (
      <div className=" tradex-min-h-[50vh]">
        <SectionLoading />
      </div>
    );
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <P2PSidebar />
              <div className=" lg:tradex-col-span-2 tradex-space-y-8 tradex-h-full">
                {!uid && (
                  <div className=" tradex-grid tradex-grid-cols-2 tradex-gap-8 tradex-bg-background-main tradex-rounded-sm tradex-border tradex-border-background-primary">
                    <button
                      className={` tradex-min-h-[56px] tradex-w-full tradex-flex tradex-justify-center tradex-items-center tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-bold tradex-rounded-sm ${
                        adsType === 1 && "tradex-bg-primary !tradex-text-white"
                      }`}
                      onClick={() => setAdsType(1)}
                    >
                      {t("I Want to Buy")}
                    </button>

                    <button
                      className={`tradex-min-h-[56px] tradex-w-full tradex-flex tradex-justify-center tradex-items-center tradex-text-lg tradex-leading-[22px] tradex-text-title tradex-font-bold tradex-rounded-sm ${
                        adsType === 2 && "tradex-bg-primary !tradex-text-white"
                      }`}
                      onClick={() => setAdsType(2)}
                    >
                      {t("I Want to Sell")}
                    </button>
                  </div>
                )}

                <div>
                  {addStep === "stepOne" && (
                    <AddPostOne
                      data={data}
                      setAddStep={setAddStep}
                      selectedAsset={selectedAsset}
                      selectedCurrency={selectedCurrency}
                      setSelectedAsset={setSelectedAsset}
                      setselectedCurrency={setselectedCurrency}
                      pricePoint={pricePoint}
                      priceType={priceType}
                      setPriceType={setPriceType}
                      setPricePoint={setPricePoint}
                      uid={uid}
                    />
                  )}
                  {addStep === "stepTwo" && (
                    <AddPostTwo
                      setAddStep={setAddStep}
                      selectedAsset={selectedAsset}
                      data={data}
                      selectedPayment={selectedPayment}
                      setSelectedPayment={setSelectedPayment}
                      selectedCurrency={selectedCurrency}
                      selectedPaymentTime={selectedPaymentTime}
                      setSelectedPaymentTime={setSelectedPaymentTime}
                      amount={Amount}
                      setAmount={setAmount}
                      getAvailableBalanceAction={getAvailableBalanceAction}
                      uid={uid}
                    />
                  )}
                  {addStep === "stepThree" && (
                    <AddPostThree
                      setAddStep={setAddStep}
                      terms={terms}
                      data={data}
                      setTerms={setTerms}
                      auto_reply={auto_reply}
                      setAuto_reply={setAuto_reply}
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      registerDays={registerDays}
                      coinHolding={coinHolding}
                      uid={uid}
                      setregisterDays={setregisterDays}
                      setcoinHolding={setcoinHolding}
                      UpdateP2pAdsAction={UpdateP2pAdsAction}
                      createUpdateP2pAdsAction={createUpdateP2pAdsAction}
                    />
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
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default AddPost;
