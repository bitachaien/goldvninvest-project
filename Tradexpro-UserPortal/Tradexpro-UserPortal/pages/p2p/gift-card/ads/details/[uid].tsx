import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import BackButton from "components/P2P/BackButton";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import P2PGiftCardSidebar from "components/P2P/p2p-gift-card/P2PGiftCardSidebar";
import P2PGiftCardHeader from "components/P2P/p2p-gift-card/p2p-gift-card-header/P2PGiftCardHeader";
import P2PGiftCardNavbar from "components/P2P/p2p-gift-card/p2p-gift-card-navbar/P2PGiftCardNavbar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { CUstomSelect } from "components/common/CUstomSelect";
import ImageComponent from "components/common/ImageComponent";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsGiftFill } from "react-icons/bs";
import { TfiHandPointRight } from "react-icons/tfi";
import { toast } from "react-toastify";
import {
  buyP2PGiftCardAdsApi,
  getGiftCardAdsDetailsForBuyApi,
} from "service/p2pGiftCards";

const options = [{ value: 1, label: "Payment 1" }];

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adsDetails, setAdsDetails] = useState<any>({});
  const [selectedPayment, setSelectedPayment] = useState<any>({});
  const { t } = useTranslation("common");
  useEffect(() => {
    getGiftCardAdsDetailsForBuy();
  }, []);

  const getGiftCardAdsDetailsForBuy = async () => {
    setLoading(true);
    const data = await getGiftCardAdsDetailsForBuyApi(router?.query?.uid);
    setLoading(false);

    if (!data.success) {
      toast.error(data.message);
      return;
    }

    setAdsDetails(data.data);
  };

  const buyGiftCardHandler = async () => {
    if (
      Number(adsDetails?.payment_currency_type) === 1 &&
      Object.keys(selectedPayment).length === 0
    ) {
      toast.error("Select Payment Method");
      return;
    }
    let params: any = {
      gift_card_id: adsDetails?.id,
    };
    if (Number(adsDetails?.payment_currency_type) === 1) {
      params = {
        gift_card_id: adsDetails?.id,
        payment_method_uid: selectedPayment?.value,
      };
    }
    const data = await buyP2PGiftCardAdsApi(params);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    router.push(`/p2p/gift-card/ads/buy/${data?.data?.order_uid}`);
  };

  if (loading) return <SectionLoading />;

  return (
    <>
      <div className=" tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container">
            <div className="tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6">
              <div className=" lg:tradex-col-span-3">
                <P2PGiftCardSidebar />
              </div>
              <div className="lg:tradex-col-span-9 ">
                <div className="tradex-pb-10 tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary">
                  <div className=" tradex-px-4  tradex-rounded-tl-lg tradex-rounded-tr-lg tradex-py-6  tradex-border-b tradex-border-background-primary tradex-flex tradex-justify-between tradex-items-center">
                    <div className="tradex-space-y-3 ">
                      <h3 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px]  md:tradex-leading-[48px] !tradex-text-title">
                        {t("Details")}
                      </h3>
                      <div
                        onClick={() => {
                          router.back();
                        }}
                        className=" tradex-flex tradex-gap-3 tradex-text-base md:tradex-text-xl tradex-leading-6 tradex-text-body tradex-items-center tradex-cursor-pointer"
                      >
                        <BiArrowBack />
                        {t("Back")}
                      </div>
                    </div>
                    <div className=" tradex-px-3 tradex-py-2 tradex-border tradex-border-background-primary tradex-rounded tradex-flex tradex-items-center tradex-gap-2.5">
                      <div className=" tradex-min-w-8">
                        <img
                          src="https://api-tradex.nftarttoken.xyz/images/avatars/yellow-hat.png"
                          alt=""
                          className=" tradex-max-w-8 tradex-max-h-8 tradex-h-8 tradex-w-8 tradex-rounded-full"
                        />
                      </div>
                      <p className=" tradex-text-lg tradex-leading-6 tradex-text-title tradex-font-semibold">
                        {adsDetails?.user?.first_name}{" "}
                        {adsDetails?.user?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="tradex-px-4 tradex-pt-6 tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-5 tradex-gap-6">
                    <div className=" lg:tradex-col-span-2 tradex-space-y-6">
                      <div className="relative tradex-max-h-[212px]">
                        <img
                          src={
                            adsDetails?.gift_card?.banner?.banner ||
                            "/demo_gift_banner.png"
                          }
                          alt=""
                          className="tradex-max-h-[212px] tradex-object-cover tradex-object-center tradex-h-[212px] tradex-w-full tradex-rounded-lg"
                        />
                        <div className=" tradex-absolute tradex-right-0 tradex-bottom-0">
                          <div className="tradex-rounded-tl-lg tradex-rounded-br-lg tradex-px-[6px] tradex-py-[9px] tradex-bg-primary !tradex-text-white tradex-flex tradex-justify-center tradex-items-center tradex-gap-1 tradex-w-fit">
                            <BsGiftFill size={20} />
                            <h4 className=" tradex-text-xl tradex-leading-5 !tradex-text-white !tradex-font-semibold">{`${parseFloat(
                              adsDetails?.gift_card?.amount
                            )} ${adsDetails?.gift_card?.coin_type}`}</h4>
                          </div>
                        </div>
                      </div>
                      <div className="tradex-border tradex-border-background-primary tradex-rounded tradex-px-3 tradex-py-[14px]">
                        <div className="tradex-space-y-2">
                          <h5 className="tradex-text-lg tradex-leading-[22px] !tradex-text-title tradex-font-semibold tradex-pb-2 tradex-border-b tradex-border-background-primary">
                            {t("Terms and Conditions")}
                          </h5>
                          <div className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-text-body tradex-text-base tradex-leading-5">
                            <p>{adsDetails?.terms_condition}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:tradex-col-span-3">
                      <div className="tradex-border tradex-border-background-primary tradex-rounded tradex-px-4 tradex-py-6 tradex-space-y-6">
                        <div className="tradex-pb-2 tradex-border-b tradex-border-background-primary tradex-space-y-1">
                          <h5 className="tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-semibold">
                            {adsDetails?.gift_card?.banner?.title ||
                              t("Tradex gift card")}
                          </h5>
                          <p className="tradex-text-base tradex-leading-[22px] !tradex-text-body">
                            {" "}
                            {adsDetails?.gift_card?.banner?.sub_title ||
                              t("Tradex Festive Gift card for sale")}
                          </p>
                        </div>
                        <div className=" tradex-space-y-6 lg:tradex-space-y-0 lg:tradex-grid tradex-grid-cols-2 tradex-gap-6">
                          <div className="tradex-space-y-2">
                            <p className="tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                              {t("Price")}
                            </p>
                            <p className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                              {parseFloat(adsDetails?.price)}{" "}
                              {adsDetails?.currency_type}
                            </p>
                          </div>
                          <div className="tradex-space-y-2">
                            <p className="tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                              {t("Available")}
                            </p>
                            <p className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                              {parseFloat(adsDetails?.gift_card?.amount)}{" "}
                              {adsDetails?.gift_card?.coin_type}
                            </p>
                          </div>
                          <div className=" lg:tradex-col-span-2 tradex-space-y-2">
                            <p className="tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold">
                              {t("Payment Time Limit")}
                            </p>
                            <p className="tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-base tradex-leading-5 tradex-px-3 tradex-py-[14px]">
                              {adsDetails?.time_limit} {t("Minutes")}
                            </p>
                          </div>
                          {Number(adsDetails?.payment_currency_type === 1) ? (
                            <div className="lg:tradex-col-span-2 tradex-space-y-2">
                              <label className="tradex-text-base tradex-leading-[22px] tradex-text-title tradex-font-semibold !tradex-mb-0">
                                {t("Select payment method")}
                              </label>

                              <CUstomSelect
                                options={adsDetails?.payment_methods}
                                handleFunction={setSelectedPayment}
                              />
                            </div>
                          ) : null}
                          <div className="tradex-col-span-2"></div>
                        </div>
                      </div>
                      <div className=" tradex-mt-6">
                        <button
                          className="tradex-min-w-[150px] tradex-min-h-[56px] tradex-rounded tradex-bg-primary tradex-text-white tradex-text-base tradex-leading-[22px] tradex-font-bold"
                          onClick={buyGiftCardHandler}
                        >
                          {t("Buy")}
                        </button>
                      </div>
                    </div>
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
}
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p/gift-card");
  return {
    props: {},
  };
};
