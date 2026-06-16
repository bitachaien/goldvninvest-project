import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import Hero from "components/ico/Hero";
import LaunchPad from "components/ico/LaunchPad";
import LaunchTop from "components/ico/LaunchTop";
import SellingSection from "components/ico/SellingSection";
import {
  PHASE_SORT_BY_FEATURED,
  PHASE_SORT_BY_FUTURE,
  PHASE_SORT_BY_RECENT,
} from "helpers/core-constants";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import { customPage, landingPage } from "service/landing-page";
import {
  getLaunchpadLandingPageAction,
  getLaunchpadListAction,
} from "state/actions/launchpad";

const Index = () => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(true);
  const [launchpadLandingPage, setLaunchpadLandingPage]: any = useState([]);
  const [launchpadFeatureItem, setLaunchpadFeatureItem]: any = useState([]);
  const [launchpadUpcomingItem, setLaunchpadUpcomingItem]: any = useState([]);
  const [launchpadRecentItem, setLaunchpadRecentItem]: any = useState([]);
  useEffect(() => {
    getLaunchpadListAction(
      setLaunchpadRecentItem,
      setLaunchpadFeatureItem,
      setLaunchpadUpcomingItem,
      setLoading
    );
    getLaunchpadLandingPageAction(setLaunchpadLandingPage);
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots: any) => (
      <div style={{ bottom: "-35px" }}>
        <ul className=" launchepad-custom-dots">{dots}</ul>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            {loading ? (
              <SectionLoading />
            ) : (
              <div className="launchPad">
                <LaunchTop data={launchpadLandingPage?.data} />

                <Hero data={launchpadLandingPage?.data} />

                {launchpadFeatureItem.length > 0 && (
                  <div className=" tradex-space-y-6 tradex-mt-[80px]">
                    <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-justify-between tradex-items-center tradex-gap-6">
                      <h2 className="tradex-text-[32px] tradex-leading-[38px] !tradex-text-title tradex-font-bold ">
                        {t("Featured Item")}
                      </h2>
                      <Link
                        href={`/ico/view-all/lists?type=${PHASE_SORT_BY_FEATURED}`}
                      >
                        <a className=" tradex-px-3 tradex-py-2 md:tradex-py-4 md:tradex-px-6 tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-base md:tradex-leading-6 tradex-font-semibold tradex-border tradex-rounded-lg tradex-bg-primary !tradex-text-white tradex-border-primary">
                          <span>{t("View More")}</span>
                          <span>
                            <FaArrowRight className=" tradex-w-3 md:tradex-w-[14px]" />
                          </span>
                        </a>
                      </Link>
                    </div>
                    <Slider {...settings}>
                      {launchpadFeatureItem.map((item: any, index: number) => (
                        <div key={index}>
                          <LaunchPad
                            viewMore={false}
                            data={item}
                            core={PHASE_SORT_BY_FEATURED}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
                {launchpadRecentItem?.length > 0 && (
                  <div className="tradex-mt-[80px] tradex-space-y-6">
                    <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-justify-between tradex-items-center tradex-gap-6">
                      <h2 className="tradex-text-[32px] tradex-leading-[38px] !tradex-text-title tradex-font-bold ">
                        {t("Ongoing Item")}
                      </h2>
                      <Link
                        href={`/ico/view-all/lists?type=${PHASE_SORT_BY_RECENT}`}
                      >
                        <a className=" tradex-px-3 tradex-py-2 md:tradex-py-4 md:tradex-px-6 tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-base md:tradex-leading-6 tradex-font-semibold tradex-border tradex-rounded-lg tradex-bg-primary !tradex-text-white tradex-border-primary">
                          <span>{t("View More")}</span>
                          <span>
                            <FaArrowRight className=" tradex-w-3 md:tradex-w-[14px]" />
                          </span>
                        </a>
                      </Link>
                    </div>
                    <Slider {...settings}>
                      {launchpadRecentItem.map((item: any, index: number) => (
                        <div key={index}>
                          <LaunchPad
                            key={index}
                            viewMore={
                              launchpadRecentItem?.length == index + 1
                                ? true
                                : false
                            }
                            data={item}
                            core={PHASE_SORT_BY_RECENT}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
                {launchpadUpcomingItem.length > 0 && (
                  <div className="tradex-mt-[80px] tradex-space-y-6">
                    <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-justify-between tradex-items-center tradex-gap-6">
                      <h2 className="tradex-text-[32px] tradex-leading-[38px] !tradex-text-title tradex-font-bold ">
                        {t("Upcoming Item")}
                      </h2>
                      <Link
                        href={`/ico/view-all/lists?type=${PHASE_SORT_BY_FUTURE}`}
                      >
                        <a className=" tradex-px-3 tradex-py-2 md:tradex-py-4 md:tradex-px-6 tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-base md:tradex-leading-6 tradex-font-semibold tradex-border tradex-rounded-lg tradex-bg-primary !tradex-text-white tradex-border-primary">
                          <span>{t("View More")}</span>
                          <span>
                            <FaArrowRight className=" tradex-w-3 md:tradex-w-[14px]" />
                          </span>
                        </a>
                      </Link>
                    </div>
                    <Slider {...settings}>
                      {launchpadUpcomingItem.map((item: any, index: number) => (
                        <div key={index}>
                          <LaunchPad
                            key={index}
                            viewMore={
                              launchpadUpcomingItem?.length == index + 1
                                ? true
                                : false
                            }
                            data={item}
                            core={PHASE_SORT_BY_FUTURE}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}

                <SellingSection data={launchpadLandingPage?.data} />
              </div>
            )}
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
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { data } = await landingPage(ctx.locale);
  const cookies = parseCookies(ctx);
  return {
    props: {
      landing: data,
      bannerListdata: data.banner_list,
      announcementListdata: data.announcement_list,
      socialData: data.media_list,
      featureListdata: data.feature_list,
      asset_coin_pairs: data.asset_coin_pairs,
      hourly_coin_pairs: data.hourly_coin_pairs,
      latest_coin_pairs: data.latest_coin_pairs,
      loggedin: cookies.token ? true : false,
      landing_banner_image: data?.landing_banner_image
        ? data?.landing_banner_image
        : null,
    },
  };
};
export default Index;
