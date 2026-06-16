import { motion, useAnimation } from "framer-motion";
import ImageComponent from "components/common/ImageComponent";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import Link from "next/link";
import { GoArrowRight } from "react-icons/go";
import { TiArrowRight } from "react-icons/ti";
import AnimateCoverSvg from "components/AnimateCoverSvg";
import AnimateVTwo from "components/AnimateVTwo";
import TextAnimation from "components/TextAnimation";

const Cover = ({ landing, loggedin, landing_banner_image }: any) => {
  const { landing_title, landing_description } = landing;
  const router = useRouter();
  const { t } = useTranslation("common");
  const textControls = useAnimation();
  const imageControls = useAnimation();

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: any) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 2,
        delay: index * 0.5,
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    }),
  };

  useEffect(() => {
    // Trigger text animation with a delay
    textControls.start("visible");

    // Trigger image animation after a longer delay
    setTimeout(() => {
      imageControls.start("visible");
    }, 1500);
  }, [textControls, imageControls]);

  return (
    <div>
      {parseInt(landing?.landing_first_section_status) === 1 && (
        <section className="tradex-bg-background-primary tradex-min-h-[660px] tradex-relative">
          <div className=" tradex-bg-primary/30 tradex-w-[385px] tradex-h-[385px] tradex-rounded-full tradex-left-0 tradex-top-0 tradex-absolute z-[1] tradex-blur-[140px]"></div>

          <img
            src="./banner_top_left.png"
            className=" tradex-absolute tradex-top-0 tradex-left-0"
            alt=""
          />
          <div className=" tradex-container tradex-pt-8 md:tradex-pt-[80px] tradex-pb-[140px] tradex-flex tradex-flex-col lg:tradex-flex-row tradex-items-center tradex-relative tradex-z-10 tradex-gap-6 md:tradex-gap-0">
            <div className="xl:tradex-min-w-[700px] tradex-max-w-[700px] tradex-space-y-8 xl:tradex-space-y-[60px]">
              <div className=" tradex-space-y-2 md:tradex-space-y-6">
                <h1 className=" tradex-text-[32px] tradex-leading-[42px] md:tradex-text-[48px] md:tradex-leading-[64px] xl:tradex-text-[64px] xl:tradex-leading-[80px] !tradex-text-title">
                  {landing_title ? (
                    <TextAnimation text={landing_title} />
                  ) : (
                    <>
                      <TextAnimation text={`Make Easy Your`} />
                      <span className=" !tradex-text-primary">
                        {t("Buy Sell & Trade")}
                      </span>
                      <span>{t("Crypto Currency")}</span>
                    </>
                  )}
                </h1>
                <p className="tradex-max-w-[633px] tradex-text-xs tradex-leading-[18px] md:tradex-text-base md:tradex-leading-6 !tradex-text-body">
                  {landing_description ||
                    t(`Uncover the ultimate synergy of trading and investment success
                  with our all-in-one platform – where seamless functionality
                  meets informed decision-making`)}
                </p>
              </div>
              {!loggedin && (
                <Link
                  href={
                    router.locale !== "en"
                      ? `/${router.locale}/signup`
                      : "/signup"
                  }
                >
                  <a className=" tradex-w-fit tradex-px-6 tradex-py-3 md:tradex-px-8 md:tradex-py-4 tradex-bg-title tradex-flex tradex-justify-center tradex-gap-2 tradex-items-center tradex-rounded-lg !tradex-text-background-main hover:tradex-bg-primary hover:!tradex-text-white">
                    <span className=" tradex-text-sm md:tradex-text-base tradex-leading-6 tradex-font-semibold">
                      {t("Register Now")}
                    </span>
                    <span>
                      <TiArrowRight size={24} />
                    </span>
                  </a>
                </Link>
              )}
            </div>
            <div className=" tradex-flex tradex-justify-center tradex-w-full">
              {landing_banner_image ? (
                <img src={landing_banner_image || "./cover_img.png"} alt="" />
              ) : (
                <div className=" 2xl:-tradex-mt-[58px]">
                  <AnimateCoverSvg />
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Cover;
