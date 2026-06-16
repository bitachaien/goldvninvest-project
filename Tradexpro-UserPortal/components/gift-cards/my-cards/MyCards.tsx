import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import MyCardModal from "../modal/MyCardModal";
import SendCryptoCardModal from "../modal/SendCryptoCardModal";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function MyCards({ myCards, hanldeMyCards }: any) {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSendCryptoCardModalOpen, setIsSendCryptoCardModalOpen] =
    useState(false);
  const [giftCardData, setGiftCardData] = useState({});
  const myCardHandle = (cardData: any) => {
    setGiftCardData(cardData);
    setIsModalOpen(true);
  };

  const sendCryptoCardModalHandler = () => {
    setIsSendCryptoCardModalOpen(true);
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="tradex-container tradex-relative tradex-z-10 tradex-py-[80px]">
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-6 md:tradex-items-center tradex-justify-between tradex-pb-4 tradex-border-b tradex-border-background-primary">
            <div className=" tradex-space-y-3">
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                {t("My Cards")}
              </h2>
              <p className=" tradex-text-xl tradex-leading-6 tradex-text-body">
                {t("Send a crypto gift card for any occasion")}
              </p>
            </div>
            <Link href={isLoggedIn ? `/gift-cards/my-cards` : "/signin"}>
              <a className=" tradex-px-5 tradex-capitalize tradex-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-gap-2 tradex-rounded tradex-bg-primary !tradex-text-white tradex-text-base">
                <span>
                  {t("All")}({myCards.length})
                </span>

                <BsArrowRight />
              </a>
            </Link>
          </div>
          <div>
            {myCards.length > 0 ? (
              <>
                <div className=" tradex-grid tradex-gap-6 tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-3">
                  {myCards.map((item: any, index: number) => (
                    <div
                      className=" tradex-group tradex-border tradex-border-background-primary tradex-rounded-lg"
                      onClick={() => myCardHandle(item)}
                      key={index}
                    >
                      <div className=" tradex-rounded-tl-lg tradex-rounded-tr-lg tradex-overflow-hidden">
                        <ImageComponent
                          src={item.banner.image || "/demo_gift_banner.png"}
                          height={220}
                        />
                      </div>
                      <div className="tradex-px-4 tradex-pt-4 tradex-pb-5 tradex-space-y-4">
                        <div className=" tradex-space-y-2">
                          <h4 className=" tradex-text-2xl tradex-leading-[30px] !tradex-text-title tradex-font-semibold">
                            {t(item.banner.title)}
                          </h4>
                          <p className=" tradex-text-base tradex-leading-[22px] tradex-text-body tradex-line-clamp-2">
                            {t(item.banner.sub_title)}
                          </p>
                        </div>
                        <button className=" tradex-h-9 tradex-px-2.5 tradex-flex tradex-justify-center tradex-items-center tradex-border tradex-border-title tradex-rounded tradex-text-xs tradex-text-title group-hover:tradex-border-primary group-hover:tradex-bg-primary group-hover:tradex-text-white">
                          {t("View Details")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-4">
                <NoItemFound />
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <MyCardModal
          giftCardData={giftCardData}
          setIsModalOpen={setIsModalOpen}
          sendCryptoCardModalHandler={sendCryptoCardModalHandler}
          isHome={true}
          modalFunc={hanldeMyCards}
        />
      )}
      {isSendCryptoCardModalOpen && (
        <SendCryptoCardModal
          setIsSendCryptoCardModalOpen={setIsSendCryptoCardModalOpen}
          giftCardData={giftCardData}
        />
      )}
    </>
  );
}
