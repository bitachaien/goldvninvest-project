import P2PGiftCardHeader from "components/P2P/p2p-gift-card/p2p-gift-card-header/P2PGiftCardHeader";
import P2PGiftCardNavbar from "components/P2P/p2p-gift-card/p2p-gift-card-navbar/P2PGiftCardNavbar";
import { CUstomSelect } from "components/common/CUstomSelect";
import SectionLoading from "components/common/SectionLoading";
import request from "lib/request";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCreateAdsSettingsDataApi,
  getGiftCardDetailsForP2PGiftCardApi,
  storeAdsHandlerApi,
} from "service/p2pGiftCards";
import Select from "react-select";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import ImageComponent from "components/common/ImageComponent";
import { BsGiftFill } from "react-icons/bs";
import Footer from "components/common/footer";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import P2PGiftCardSidebar from "components/P2P/p2p-gift-card/P2PGiftCardSidebar";
import { BiArrowBack } from "react-icons/bi";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const options = [
  { value: 1, label: "Bank Transfer" },
  { value: 2, label: "Crypto Transfer" },
];

const status = [
  { value: 1, label: "Active" },
  { value: 0, label: "Deactive" },
];

export default function Index() {
  const { t } = useTranslation("common");

  const router = useRouter();

  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [giftCardDetais, setgiftCardDetais] = useState<any>({});
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
  const [selectedCurrencyType, setSelectedCurrencyType] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState(status[0].value);
  const [selectedPayment, setSelectedPayment] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedTime, setSelectedTime] = useState(0);
  const [termsData, setTermsData] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    getCreateAdsSettingsData();
    getGiftCardDetailsForP2PGiftCard();
  }, []);

  const getGiftCardDetailsForP2PGiftCard = async () => {
    const data = await getGiftCardDetailsForP2PGiftCardApi(router.query.id);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    setgiftCardDetais(data.data);
  };

  const getCreateAdsSettingsData = async () => {
    setLoading(true);
    const data: any = await getCreateAdsSettingsDataApi();

    setLoading(false);
    if (!data?.success) {
      toast.error(data?.message);
      return;
    }

    setSettings(data?.data);
  };

  const paymentTypeHandler = (event: any) => {
    setSelectedPaymentType(event.value);
    setSelectedCurrencyType(null);
    setSelectedPayment([]);
  };

  const handlePayment = (event: any) => {
    setSelectedPayment(event);
  };

  const handleCountry = (event: any) => {
    setSelectedCountry(event);
  };

  const handleCurrencyType = (event: any) => {
    setSelectedCurrencyType(event);
  };

  const createAdsHandler = async () => {
    if (!selectedPaymentType) {
      toast.error("Select Payment Type");
      return;
    } else if (!selectedCurrencyType) {
      toast.error("Select Currency Type");
      return;
    } else if (price === "") {
      toast.error("Enter Price");
      return;
    } else if (selectedCountry.length === 0) {
      toast.error("Select Country");
      return;
    } else if (
      selectedPaymentType &&
      selectedPaymentType === 1 &&
      selectedPayment.length === 0
    ) {
      toast.error("Select Payment Method");
      return;
    } else if (termsData === "") {
      toast.error("Enter Terms Condition");
      return;
    }

    const countries = selectedCountry.map((option: any) => option.value);

    const formData: any = new FormData();
    formData.append("gift_card_id", router.query.id);
    formData.append("payment_currency_type", selectedPaymentType);
    formData.append("currency_type", selectedCurrencyType.value);
    formData.append("price", price);
    formData.append("terms_condition", termsData);
    // formData.append("country", countries);
    countries.forEach((country) => {
      formData.append("country[]", country);
    });
    formData.append("status", selectedStatus);
    formData.append("time_limit", selectedTime);

    if (selectedPaymentType === 1) {
      const payment_methods = selectedPayment.map(
        (option: any) => option.value
      );
      payment_methods.forEach((payment_method: any) => {
        formData.append("payment_method[]", payment_method);
      });
    }
    const data = await storeAdsHandlerApi(formData);
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    router.push(`/p2p/gift-card/my-adds`);
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
                      <h3 className="tradex-text-[32px]  tradex-leading-[38px] sm:tradex-text-[40px]  sm:tradex-leading-[48px] !tradex-text-title">
                        {t("Create Gift Card Ads")}
                      </h3>
                    </div>
                  </div>
                  <div className="tradex-px-4 tradex-pt-6 tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-5 tradex-gap-6">
                    <div className=" lg:tradex-col-span-2 tradex-space-y-6">
                      <div className="relative tradex-max-h-[212px]">
                        <img
                          src={
                            giftCardDetais?.banner?.banner ||
                            "/demo_gift_banner.png"
                          }
                          alt=""
                          className="tradex-max-h-[212px] tradex-object-cover tradex-object-center tradex-h-[212px] tradex-w-full tradex-rounded-lg"
                        />
                        <div className=" tradex-absolute tradex-right-0 tradex-bottom-0">
                          <div className="tradex-rounded-tl-lg tradex-rounded-br-lg tradex-px-[6px] tradex-py-[9px] tradex-bg-primary !tradex-text-white tradex-flex tradex-justify-center tradex-items-center tradex-gap-1 tradex-w-fit">
                            <BsGiftFill size={20} />
                            <h4 className=" tradex-text-xl tradex-leading-5 !tradex-text-white !tradex-font-semibold">{`${parseFloat(
                              giftCardDetais?.amount
                            )} ${giftCardDetais?.coin_type}`}</h4>
                          </div>
                        </div>
                      </div>
                      <div className="tradex-space-y-2">
                        <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                          {t("Terms And Condition")}
                        </h6>

                        <textarea
                          placeholder={t("Enter Terms And Condition")}
                          className=" tradex-w-full tradex-min-h-[48px] !tradex-bg-transparent tradex-flex tradex-items-center tradex-border tradex-border-background-primary tradex-rounded tradex-text-body tradex-text-sm tradex-leading-5 tradex-px-3 tradex-py-[14px]"
                          rows={4}
                          value={termsData}
                          onChange={(e) => setTermsData(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="lg:tradex-col-span-3">
                      <div className="tradex-border tradex-border-background-primary tradex-rounded tradex-px-4 tradex-py-6 tradex-space-y-6">
                        <div className="tradex-pb-2 tradex-border-b tradex-border-background-primary tradex-space-y-1">
                          <h5 className="tradex-text-xl tradex-leading-6 !tradex-text-title tradex-font-semibold">
                            {giftCardDetais?.banner?.title ||
                              t("Tradex gift card")}
                          </h5>
                          <p className="tradex-text-sm tradex-leading-[18px] !tradex-text-body">
                            {" "}
                            {giftCardDetais?.banner?.sub_title ||
                              t("Tradex Festive Gift card for sale")}
                          </p>
                        </div>
                        <div className=" tradex-grid lg:tradex-grid-cols-2 tradex-gap-6">
                          <div className="tradex-space-y-2">
                            <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                              {t("Payment Currencey Type")}
                            </h6>
                            <CUstomSelect
                              options={options}
                              handleFunction={paymentTypeHandler}
                            />
                          </div>

                          {selectedPaymentType && (
                            <div className="tradex-space-y-2">
                              <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                                {t("Currencey Type")}
                              </h6>

                              <Select
                                options={
                                  selectedPaymentType === 1
                                    ? settings?.currency
                                    : settings?.assets
                                }
                                classNamePrefix={"custom-select"}
                                value={selectedCurrencyType}
                                onChange={handleCurrencyType}
                              />
                            </div>
                          )}

                          <div className="tradex-space-y-2">
                            <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                              {t("Price")}
                            </h6>

                            <input
                              type="number"
                              min={1}
                              placeholder={t("Enter Price")}
                              className=" tradex-w-full !tradex-bg-transparent tradex-text-sm tradex-min-h-[48px] tradex-flex tradex-items-center tradex-border !tradex-border-background-primary tradex-rounded tradex-text-body tradex-leading-5 tradex-px-3 tradex-py-[14px]"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                            />
                          </div>

                          <div className="tradex-space-y-2">
                            <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                              {t("Status")}
                            </h6>
                            <CUstomSelect
                              options={status}
                              defaultValue={status[0]}
                              handleFunction={(event: any) =>
                                setSelectedStatus(event.value)
                              }
                            />
                          </div>

                          {selectedPaymentType === 1 && (
                            <div className="tradex-space-y-2">
                              <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                                {t("Payment Method")}
                              </h6>

                              <Select
                                options={settings?.payment_method}
                                classNamePrefix={"custom-select"}
                                isMulti={true}
                                value={selectedPayment}
                                onChange={handlePayment}
                              />
                            </div>
                          )}

                          <div className="tradex-space-y-2">
                            <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                              {t("Country")}
                            </h6>
                            <CUstomSelect
                              options={settings?.country}
                              isSearchable={true}
                              isMulti={true}
                              handleFunction={handleCountry}
                            />
                          </div>

                          <div className="tradex-space-y-2">
                            <h6 className="tradex-text-base tradex-leading-[22px] !tradex-text-title tradex-font-semibold !tradex-mb-0">
                              {t("Time Limit")}
                            </h6>
                            <CUstomSelect
                              options={settings?.payment_time}
                              handleFunction={(event: any) =>
                                setSelectedTime(event.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" tradex-mt-6 tradex-flex tradex-gap-6">
                  <button
                    className="tradex-min-w-[150px] tradex-min-h-[56px] tradex-rounded tradex-text-primary tradex-border tradex-border-primary tradex-text-base tradex-leading-[22px] tradex-font-bold"
                    onClick={() => router.push(`/p2p/gift-card/lists`)}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    className="tradex-min-w-[150px] tradex-min-h-[56px] tradex-rounded tradex-bg-primary tradex-text-white tradex-text-base tradex-leading-[22px] tradex-font-bold"
                    onClick={createAdsHandler}
                  >
                    {t("Create")}
                  </button>
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
