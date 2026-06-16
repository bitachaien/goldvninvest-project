import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BsChevronRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getBlogHomePageDataApi } from "service/landing-page";
import { RootState } from "state/store";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { formateDateMunite } from "common";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import SectionLoading from "components/common/SectionLoading";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import { FaArrowRight } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";

const CommunityHome = () => {
  const { settings } = useSelector((state: RootState) => state.common);
  const { t } = useTranslation("common");

  const [blogList, setBlogList] = useState<any>([]);
  const [isSuccess, setIsSuccess] = useState<any>(false);
  const [loading, setLoading] = useState(false);

  const {
    blog_section_heading,
    blog_section_description,
    blog_section_banner_description,
    blog_section_banner_image,
  } = settings;

  useEffect(() => {
    getBlogHomePageData();
  }, []);

  const getBlogHomePageData = async () => {
    setLoading(true);
    const response = await getBlogHomePageDataApi();
    if (!response.success) {
      setLoading(false);
      return;
    }
    setBlogList(response.data);
    setLoading(false);
    setIsSuccess(true);
  };

  const itemVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  if (loading) return <SectionLoading />;

  if (!isSuccess) return <></>;

  if (blogList?.length == 0) return <></>;

  return (
    <section className="tradex-pt-[60px] md:tradex-pt-[120px] tradex-relative tradex-z-10">
      <div className="tradex-container tradex-space-y-10">
        <div className=" tradex-flex tradex-justify-between tradex-items-center">
          <h3 className="tradex-max-w-[485px] tradex-text-[24px] tradex-leading-[32px] md:tradex-text-[32px] md:tradex-leading-[48px] xl:tradex-text-[48px] xl:tradex-leading-[60px] !tradex-text-title tradex-font-bold">
            {blog_section_heading || t("Latest Crypto News and Blogs")}
          </h3>
          <Link href={`/blog`}>
            <a className="tradex-bg-title tradex-min-w-fit tradex-py-2 tradex-px-3 md:tradex-py-4 md:tradex-px-6 tradex-flex tradex-gap-2 tradex-items-center tradex-text-xs md:tradex-text-base md:tradex-leading-6 tradex-font-semibold !tradex-text-background-main tradex-border tradex-border-title tradex-rounded-lg hover:tradex-bg-primary hover:!tradex-text-white hover:tradex-border-primary">
              <span>{t("View More")}</span>
              <span>
                <FaArrowRight size={14} />
              </span>
            </a>
          </Link>
        </div>
        <div className="tradex-grid lg:tradex-grid-cols-2 tradex-gap-6">
          <Link href={`blog/${blogList[0]?.slug}`}>
            <a className="tradex-rounded-lg tradex-space-y-6 tradex-overflow-hidden tradex-border tradex-border-background-primary hover:tradex-shadow-[2px_2px_50px_0px_#0000000F] tradex-transition-all tradex-duration-[260ms] tradex-ease-[cubic-bezier(0.42,0,0.58,1)] tradex-delay-[0s]">
              <div>
                <img
                  src={
                    blogList[0]?.thumbnail ||
                    "/bitcoin-cryptocurrency-investing-concept.png"
                  }
                  className="tradex-max-h-[190px] md:tradex-max-h-[360px] tradex-w-full tradex-object-cover tradex-object-center"
                  alt=""
                />
              </div>
              <div className="tradex-p-4 tradex-space-y-2">
                <div className=" tradex-flex tradex-justify-between tradex-items-center">
                  <p className=" tradex-flex tradex-items-center tradex-gap-0.5 md:tradex-gap-2 !tradex-text-title">
                    <span>
                      <IoIosTimer className=" tradex-w-4 md:tradex-w-5 md:tradex-h-5" />
                    </span>{" "}
                    <span className=" tradex-text-xs md:tradex-text-base tradex-font-medium ">
                      {blogList[0]?.publish_at
                        ? formateDateMunite(blogList[0]?.publish_at)
                        : t("a year ago")}
                    </span>
                  </p>
                  {/* <p className=" tradex-flex tradex-items-center tradex-gap-2">
                    <span>
                      <img
                        src="/man_icon.png"
                        className="tradex-w-4 tradex-max-h-4 md:tradex-max-w-5 md:tradex-max-h-5 tradex-object-cover tradex-object-center"
                        alt=""
                      />
                    </span>
                    <span className="tradex-text-xs md:tradex-text-base tradex-font-medium !tradex-text-title">
                      Market Insight
                    </span>
                  </p> */}
                </div>
                <div className=" tradex-space-y-1 md:tradex-space-y-4">
                  <h4 className=" tradex-text-base tradex-leading-[22px] md:tradex-text-2xl 2xl:tradex-text-[32px] !tradex-text-title tradex-font-semibold 2xl:tradex-leading-[44px] tradex-line-clamp-2">
                    {blogList[0]?.title}
                  </h4>
                  <p className=" tradex-line-clamp-3 tradex-text-xs md:tradex-text-base !tradex-text-body">
                    {blogList[0]?.body ||
                      ` Tradexpro Exchange is a complete crypto coins exchange
                    platform developed Laravel It works via coin payment. There
                    is no need for any personal node a connect with a coin
                    payment merchant account. Our system is`}
                  </p>
                </div>
              </div>
            </a>
          </Link>
          <div className=" tradex-space-y-6">
            {blogList.map(
              (item: any, index: any) =>
                index > 0 &&
                index < 4 && (
                  <div
                    key={index}
                    className={`tradex-flex tradex-gap-10 tradex-justify-between tradex-min-h-[105px] md:tradex-min-h-[192px] tradex-rounded-lg tradex-overflow-hidden tradex-border tradex-border-background-primary hover:tradex-shadow-[2px_2px_50px_0px_#0000000F] tradex-transition-all tradex-duration-[260ms] tradex-ease-[cubic-bezier(0.42,0,0.58,1)] tradex-delay-[0s]`}
                  >
                    <div className="tradex-pl-6 tradex-py-6 tradex-flex tradex-flex-col tradex-gap-y-5 tradex-justify-center">
                      <div className=" tradex-space-y-2">
                        <p className=" tradex-flex tradex-items-center tradex-gap-2 !tradex-text-title">
                          <span>
                            <IoIosTimer size={20} />
                          </span>{" "}
                          <span className="tradex-text-xs md:tradex-text-base tradex-font-medium ">
                            {item?.publish_at
                              ? formateDateMunite(item?.publish_at)
                              : t("a year ago")}
                          </span>
                        </p>
                        <h4 className=" tradex-text-sm md:tradex-text-lg 2xl:tradex-text-[22px]  2xl:tradex-leading-[30px] !tradex-text-title tradex-font-semibold tradex-line-clamp-2">
                          {item?.title}
                        </h4>
                      </div>
                      <Link href={`blog/${item?.slug}`}>
                        <button className=" tradex-flex tradex-items-center tradex-text-xs md:tradex-text-base tradex-font-semibold tradex-gap-2 !tradex-text-title tradex-cursor-pointer">
                          <span>{t("Read More")}</span>
                          <span>
                            <FaArrowRight size={14} />
                          </span>
                        </button>
                      </Link>
                    </div>
                    <div className="tradex-min-w-[125px] md:tradex-min-w-[237px]">
                      <img
                        src={
                          item?.thumbnail ||
                          "/bitcoin-cryptocurrency-investing-concept.png"
                        }
                        className=" tradex-max-w-[125px] md:tradex-max-w-[237px] tradex-h-full tradex-w-full tradex-object-cover tradex-object-center"
                        alt=""
                      />
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHome;
