import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const Hero = ({ data }: any) => {
  const { t } = useTranslation("common");
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  return (
    <>
      <div className=" tradex-mt-10 tradex-flex tradex-flex-col lg:tradex-flex-row tradex-gap-12 tradex-items-center sm:tradex-px-6">
        <div className=" tradex-order-2 xl:tradex-order-none xl:tradex-min-w-[600px] tradex-flex tradex-justify-center">
          <img
            src={data?.launchpad_main_image || "/ico_second_default.png"}
            className=" tradex-max-h-[455px]"
            alt=""
          />
        </div>
        <div className=" sm:tradex-px-8 lg:tradex-min-w-[500px] lg:tradex-max-w-[500px] xl:tradex-max-w-[665px] tradex-space-y-4 md:tradex-space-y-8">
          <div className=" tradex-space-y-2 md:tradex-space-y-3 2xl:tradex-space-y-6">
            <h5 className="tradex-text-[18px] tradex-leading-[26px] md:tradex-text-2xl xl:tradex-text-[40px] xl:tradex-leading-[60px] tradex-font-semibold !tradex-text-title">
              {data?.launchpad_second_title || t("Apply to launch your")}
            </h5>
            <p className="tradex-text-xs md:tradex-text-base md:tradex-leading-6 !tradex-text-body">
              {data?.launchpad_second_description ||
                t(`Tradexpro Exchange is a complete crypto coins exchange
                  platform developed with Laravel. It works via coin payment.
                  There is no need for any personal node, it will connect with a
                  coin payment merchant account. Our system is 100% secure and
                  dynamic. It supports all crypto currency wallets including
                  Coin Payment, Deposit, Withdrawal, Referral system, and
                  whatever you need.`)}
            </p>
          </div>
          {parseInt(data?.launchpad_apply_to_status) === 1 && (
            <Link href={`${isLoggedIn ? "/ico/apply" : "/signin"}`}>
              <a className=" !tradex-text-white tradex-group tradex-w-fit tradex-py-3 tradex-px-5 md:tradex-py-4 md:tradex-px-8 tradex-rounded-lg tradex-bg-primary tradex-flex tradex-items-center tradex-gap-2 hover:tradex-bg-primary  hover:!tradex-text-white">
                <span className="!tradex-text-white tradex-text-sm md:tradex-text-base md:tradex-leading-6  group-hover:!tradex-text-white">
                  {t(data?.launchpad_apply_to_button_text || "Know More")}
                </span>
                <span>
                  <FaArrowRight className=" tradex-w-3 md:tradex-w-[14px] !tradex-text-white  group-hover:!tradex-text-white" />
                </span>
              </a>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Hero;
