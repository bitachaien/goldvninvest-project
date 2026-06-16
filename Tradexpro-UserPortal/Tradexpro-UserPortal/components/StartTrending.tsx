import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function StartTrending() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <section className=" tradex-mx-2 xl:tradex-mx-0  tradex-pt-[60px] md:tradex-pt-[120px] -tradex-mb-[40px] md:-tradex-mb-[80px]">
      <div
        className={` tradex-bg-primary tradex-container tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-2 md:tradex-gap-8 tradex-rounded-lg tradex-min-h-[120px] md:tradex-min-h-[220px]  tradex-relative tradex-overflow-hidden`}
      >
        <img
          src="/start_trend_left.png"
          className=" tradex-absolute tradex-left-0"
          alt=""
        />
        <h2 className="tradex-text-[18px] tradex-leading-[26px] md:tradex-text-[40px] md:tradex-leading-[60px] tradex-font-bold !tradex-text-white tradex-relative tradex-z-10">
          {t("Start Your Crypto Journey Now!")}
        </h2>

        <div className="tradex-flex tradex-gap-4 sm:tradex-gap-6 tradex-items-center tradex-relative tradex-z-10">
          {!isLoggedIn && (
            <Link href="/signup">
              <button className="tradex-px-3 tradex-py-2 md:tradex-px-10 md:tradex-py-4 tradex-rounded-lg tradex-bg-white tradex-text-black tradex-text-xs md:tradex-text-base tradex-font-bold">
                {t("Sign Up")}
              </button>
            </Link>
          )}
          <a
            href={
              router.locale !== "en"
                ? `/${router.locale}/exchange/dashboard`
                : "/exchange/dashboard"
            }
          >
            <button className="tradex-px-3 tradex-py-2 md:tradex-px-10 md:tradex-py-4 tradex-rounded-lg tradex-bg-white tradex-text-black tradex-text-xs md:tradex-text-base tradex-font-bold">
              {t("Trade Now")}
            </button>
          </a>
        </div>
        <img
          src="/start_trend_right.png"
          className=" tradex-absolute tradex-right-0"
          alt=""
        />
      </div>
    </section>
  );
}
