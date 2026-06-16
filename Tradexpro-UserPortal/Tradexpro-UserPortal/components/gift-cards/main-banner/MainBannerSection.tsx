import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import GiftCardModal from "../modal/GiftCardModal";
import request from "lib/request";
import { toast } from "react-toastify";
import SendCryptoCardModal from "../modal/SendCryptoCardModal";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { useRouter } from "next/router";
import {
  addGiftCardApi,
  checkGiftCardApi,
  redeemGiftCardApi,
} from "service/gift-cards";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";

export default function MainBannerSection({
  header,
  description,
  banner,
  gif_card_redeem_description,
  gif_card_add_card_description,
  gif_card_check_card_description,
}: any) {
  const router = useRouter();
  const [activeBtn, setActiveBtn] = useState("Redeem");
  const [code, setCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [giftCardData, setGiftCardData] = useState({});
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const handleGiftCard = async () => {
    if (!isLoggedIn) {
      router.push("/signin");
      return;
    }
    if (!code) return;
    const data = await checkGiftCardApi(code);
    if (!data.success) {
      setGiftCardData({});
      toast.error(data.message);
      return;
    }
    setGiftCardData(data.data);
    setIsModalOpen(true);
  };

  const handleGiftCardSubmit = () => {
    if (activeBtn === "Add") {
      addGiftCardHandler();
      return;
    }
    redeemGiftCardHandler();
  };

  const addGiftCardHandler = async () => {
    const data = await addGiftCardApi(code);
    if (data.success) {
      setCode("");
      setIsModalOpen(false);
      toast.success(data.message);
      return;
    }
    toast.error(data.message);
    setIsModalOpen(false);
  };

  const redeemGiftCardHandler = async () => {
    const data = await redeemGiftCardApi(code);
    if (data.success) {
      toast.success(data.message);
      setCode("");
      setIsModalOpen(false);
      return;
    }
    toast.error(data.message);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="tradex-bg-background-primary tradex-relative ">
        <TopLeftInnerPageCircle className=" tradex-z-0" />
        <TopRightInnerPageCircle className=" tradex-z-0" />
        <div className="tradex-container tradex-relative tradex-z-10 tradex-pt-8 md:tradex-pt-[80px] tradex-pb-[140px]">
          <div className=" tradex-grid lg:tradex-grid-cols-2 tradex-gap-6 tradex-items-center">
            <div className=" tradex-space-y-8">
              <div className=" tradex-space-y-4">
                <h2 className=" tradex-text-[48px] tradex-leading-[60px] tradex-font-bold !tradex-text-title">
                  {t(header || "Transfer your crypto asset  Gift Cards")}
                </h2>
                <p className=" tradex-text-xl tradex-text-body">
                  {t(
                    description ||
                      "Use gift cards to send your crypto assets to others using the templates designed for you."
                  )}
                </p>
                <Link href={isLoggedIn ? `/gift-cards/my-cards` : "/signin"}>
                  <a className=" tradex-w-fit tradex-px-5 tradex-py-[14px] tradex-bg-primary tradex-rounded-lg tradex-flex tradex-items-center tradex-gap-2 !tradex-text-white tradex-text-base tradex-font-semibold">
                    <span>{t("Send a crypto gift card")}</span>
                    <span>
                      <BsArrowRight />
                    </span>
                  </a>
                </Link>
              </div>
              <div className=" tradex-px-3 tradex-py-3 tradex-rounded-lg tradex-border tradex-border-border tradex-space-y-4">
                <div className=" tradex-flex tradex-gap-4 tradex-border-b tradex-border-border tradex-text-base tradex-font-medium tradex-text-body">
                  <span
                    className={`tradex-pb-2 tradex-cursor-pointer ${
                      activeBtn === "Redeem"
                        ? " tradex-border-b-2 tradex-border-primary tradex-text-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveBtn("Redeem");
                      setCode("");
                    }}
                  >
                    {t("Redeem to crypto")}{" "}
                  </span>
                  <span
                    className={`tradex-pb-2 tradex-cursor-pointer ${
                      activeBtn === "Add"
                        ? " tradex-border-b-2 tradex-border-primary tradex-text-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveBtn("Add");
                      setCode("");
                    }}
                  >
                    {t("Add Card")}
                  </span>
                  <span
                    className={`tradex-pb-2 tradex-cursor-pointer ${
                      activeBtn === "Check"
                        ? " tradex-border-b-2 tradex-border-primary tradex-text-primary"
                        : ""
                    }`}
                    onClick={() => {
                      setActiveBtn("Check");
                      setCode("");
                    }}
                  >
                    {t("Check Card")}
                  </span>
                </div>
                <div className="">
                  <label className=" tradex-text-base tradex-text-body">
                    {t("Redemption Code")}
                  </label>
                  <div className="w-full tradex-flex tradex-gap-4 tradex-items-center">
                    <input
                      type="text"
                      className="tradex-input-field !tradex-bg-transparent !tradex-border !tradex-border-solid !tradex-border-border !tradex-rounded !tradex-w-full"
                      onChange={(e) => setCode(e.target.value)}
                      value={code}
                    />
                    <button
                      className={`tradex-px-5 tradex-capitalize tradex-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-rounded tradex-bg-primary tradex-text-white tradex-text-base ${
                        !code && "cursor-not-allowed"
                      }`}
                      data-toggle="modal"
                      data-target="#giftCardModal"
                      disabled={code ? false : true}
                      onClick={handleGiftCard}
                    >
                      {t(`${activeBtn}`)}
                    </button>
                  </div>
                </div>
                <p className=" tradex-text-xs tradex-text-body">
                  {activeBtn === "Redeem" && gif_card_redeem_description}
                  {activeBtn === "Add" && gif_card_add_card_description}
                  {activeBtn === "Check" && gif_card_check_card_description}
                </p>
              </div>
            </div>
            <div>
              <img src={banner || "/gift_card_banner.png"} alt="" />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <GiftCardModal
          activeBtn={activeBtn}
          setIsModalOpen={setIsModalOpen}
          giftCardData={giftCardData}
          handleGiftCardSubmit={handleGiftCardSubmit}
        />
      )}
    </>
  );
}
