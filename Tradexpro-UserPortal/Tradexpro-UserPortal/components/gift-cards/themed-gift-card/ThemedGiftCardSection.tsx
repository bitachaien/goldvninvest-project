import { NoItemFound } from "components/NoItemFound/NoItemFound";
import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
type item = {
  banner: string;
  uid: string;
};

export default function ThemedGiftCardSection({ giftCards }: any) {
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <>
      <div className="tradex-container tradex-relative tradex-z-10 -tradex-mt-[80px]">
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-6 md:tradex-items-center tradex-justify-between tradex-pb-4 tradex-border-b tradex-border-background-primary">
            <div className=" tradex-space-y-3">
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                {t("Themed Gift Cards")}
              </h2>
              <p className=" tradex-text-xl tradex-leading-6 tradex-text-body">
                {t("Send a crypto gift card for any occasion")}
              </p>
            </div>
            <Link href={`/gift-cards/theme-cards`}>
              <a className=" tradex-px-5 tradex-capitalize tradex-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-gap-2 tradex-rounded tradex-bg-primary !tradex-text-white tradex-text-base">
                <span>{t("View All Cards")}</span>

                <BsArrowRight />
              </a>
            </Link>
          </div>
          <div>
            {giftCards?.length > 0 ? (
              <>
                <div className=" tradex-grid tradex-gap-6 tradex-grid-cols-1 md:tradex-grid-cols-2 lg:tradex-grid-cols-4">
                  {giftCards.map((item: item, index: number) => (
                    <Link
                      href={
                        isLoggedIn ? `/gift-cards/buy/${item.uid}` : "/signin"
                      }
                      key={index}
                    >
                      <a className=" tradex-rounded-lg tradex-overflow-hidden">
                        <ImageComponent
                          src={item.banner || "/demo_gift_banner.png"}
                          height={300}
                        />
                      </a>
                    </Link>
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
    </>
  );
}
