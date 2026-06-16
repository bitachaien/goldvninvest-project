import { CUSTOM_PAGE_LINK_PAGE } from "helpers/core-constants";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const socialDefaltData = [
  {
    id: 7,
    media_title: "instagram",
    media_link: "https://www.instagram.com/",
    media_icon: "/instagram_1.svg",
    status: 1,
    created_at: "2023-05-29T07:00:22.000000Z",
    updated_at: "2023-06-02T11:47:27.000000Z",
  },
  {
    id: 6,
    media_title: "Printerest",
    media_link: "https://www.pinterest.com/",
    media_icon: "/social_1.svg",
    status: 1,
    created_at: "2023-05-29T06:57:13.000000Z",
    updated_at: "2023-06-02T11:46:53.000000Z",
  },
  {
    id: 5,
    media_title: "Discord",
    media_link: "https://discord.com/",
    media_icon: "/discord_1.svg",
    status: 1,
    created_at: "2023-05-29T06:51:16.000000Z",
    updated_at: "2023-06-02T11:48:17.000000Z",
  },
  {
    id: 4,
    media_title: "Linkedin",
    media_link: "https://www.linkedin.com/",
    media_icon: "/linkedin_123.svg",
    status: 1,
    created_at: "2022-07-23T10:16:17.000000Z",
    updated_at: "2023-06-02T11:52:09.000000Z",
  },
  {
    id: 3,
    media_title: "Youtube",
    media_link: "https://www.youtube.com/",
    media_icon: "/youtube_1.svg",
    status: 1,
    created_at: "2022-07-23T10:14:50.000000Z",
    updated_at: "2023-06-02T11:53:13.000000Z",
  },
  {
    id: 2,
    media_title: "Twitter",
    media_link: "https://twitter.com/",
    media_icon: "/twitter_1.svg",
    status: 1,
    created_at: "2022-07-23T10:13:54.000000Z",
    updated_at: "2023-02-23T09:46:15.000000Z",
  },
  {
    id: 1,
    media_title: "Facebook",
    media_link: "https://www.facebook.com/",
    media_icon: "/facebook-logo_1.svg",
    status: 1,
    created_at: "2022-05-05T12:16:31.000000Z",
    updated_at: "2023-06-02T11:52:41.000000Z",
  },
];

const Footer = ({ isTopPaddingEnable = true }: any) => {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);
  const { isLoggedIn, customPageData, logo, socialData, copyright_text } =
    useSelector((state: RootState) => state.user);

  return (
    <>
      {customPageData && copyright_text && (
        <footer
          className={`tradex-bg-background-footer tradex-space-y-[80px] tradex-pb-[44px] ${
            isTopPaddingEnable
              ? "tradex-pt-[80px] md:tradex-pt-[160px] "
              : "tradex-pt-[80px]"
          }`}
        >
          <div className="tradex-container">
            <div className=" tradex-grid xl:tradex-grid-cols-12  tradex-gap-10">
              <div className=" xl:tradex-col-span-3 tradex-space-y-20">
                <Link href="/">
                  <a href="">
                    <img
                      src={logo || "/green_logo.png"}
                      className=" tradex-max-h-[64px] tradex-object-cover tradex-object-center"
                      alt=""
                    />
                  </a>
                </Link>
                <div className=" tradex-space-y-6">
                  <div className=" tradex-flex tradex-items-center tradex-gap-2">
                    <h4 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-white tradex-font-bold">
                      {customPageData?.custom_page_list[4]?.name
                        ? customPageData?.custom_page_list[4]?.name
                        : t("Community")}
                    </h4>
                    <div className="tradex-w-[95px] tradex-h-[2px] tradex-bg-white"></div>
                  </div>
                  <div className=" tradex-flex tradex-items-center tradex-gap-4 tradex-flex-wrap">
                    {socialData?.length > 0 ? (
                      socialData?.map((social: any, index: any) => (
                        <a
                          href={social.media_link}
                          target="_blank"
                          rel="noreferrer"
                          key={index}
                        >
                          <img
                            src={social.media_icon}
                            alt={social.media_title}
                            width={24}
                            className=" tradex-object-cover tradex-object-center"
                          />
                        </a>
                      ))
                    ) : process.env.NEXT_PUBLIC_DEMO_MODE == "1" ? (
                      socialDefaltData?.map((social: any, index: any) => (
                        <a
                          href={social.media_link}
                          target="_blank"
                          rel="noreferrer"
                          key={index}
                        >
                          <img
                            src={social.media_icon}
                            alt={social.media_title}
                            width={24}
                            className=" tradex-object-cover tradex-object-center"
                          />
                        </a>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className=" xl:tradex-col-span-9 tradex-grid md:tradex-grid-cols-2 xl:tradex-grid-cols-4 tradex-gap-5 lg:tradex-gap-10">
                <div className=" tradex-space-y-3 lg:tradex-space-y-10">
                  <div className=" tradex-flex tradex-items-center tradex-gap-2">
                    <h4 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-white tradex-font-bold">
                      {customPageData?.custom_page_list[0]?.name
                        ? customPageData?.custom_page_list[0]?.name
                        : t("About Us")}
                    </h4>
                    <div className="tradex-w-[48px] tradex-h-[2px] tradex-bg-white"></div>
                  </div>
                  <div className=" tradex-flex tradex-flex-col tradex-gap-y-4">
                    {parseInt(settings?.blog_news_module) === 1 && (
                      <Link href={"/blog"}>
                        <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                          {t("Blog")}
                        </a>
                      </Link>
                    )}
                    {parseInt(settings?.enable_staking) === 1 && (
                      <Link href={"/staking"}>
                        <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                          {t("Staking")}
                        </a>
                      </Link>
                    )}

                    {parseInt(settings?.knowledgebase_support_module) === 1 && (
                      <Link href={isLoggedIn === true ? "/support" : "/signin"}>
                        <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                          {t("Support")}
                        </a>
                      </Link>
                    )}
                    {parseInt(settings?.knowledgebase_support_module) === 1 && (
                      <Link href={"/knowledgebase"}>
                        <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                          {t("Knowledgebase")}
                        </a>
                      </Link>
                    )}
                    {parseInt(settings?.blog_news_module) === 1 && (
                      <Link href={"/news"}>
                        <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                          {t("News")}
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
                <div className=" tradex-space-y-3 lg:tradex-space-y-10">
                  <div className=" tradex-flex tradex-items-center tradex-gap-2">
                    <h4 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-white tradex-font-bold">
                      {customPageData?.custom_page_list[1]?.name
                        ? customPageData?.custom_page_list[1]?.name
                        : t("Products")}
                    </h4>
                    <div className="tradex-w-[48px] tradex-h-[2px] tradex-bg-white"></div>
                  </div>
                  <div className=" tradex-flex tradex-flex-col tradex-gap-y-4">
                    {customPageData?.links?.map(
                      (item: any, index: any) =>
                        item.type === 1 && (
                          <div key={index}>
                            {item.page_type === CUSTOM_PAGE_LINK_PAGE ? (
                              <Link href={"/" + item.key}>
                                <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                                  {item.title}
                                </a>
                              </Link>
                            ) : (
                              <a
                                href={item.page_link}
                                target="_blank"
                                rel="noreferrer"
                                className=" tradex-text-base !tradex-text-white tradex-font-medium"
                              >
                                {item.title}
                              </a>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className=" tradex-space-y-3 lg:tradex-space-y-10">
                  <div className=" tradex-flex tradex-items-center tradex-gap-2">
                    <h4 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-white tradex-font-bold">
                      {customPageData?.custom_page_list[2]?.name
                        ? customPageData?.custom_page_list[2]?.name
                        : t("Service")}
                    </h4>
                    <div className="tradex-w-[48px] tradex-h-[2px] tradex-bg-white"></div>
                  </div>
                  <div className=" tradex-flex tradex-flex-col tradex-gap-y-4">
                    {customPageData?.links?.map(
                      (item: any, index: any) =>
                        item.type === 2 && (
                          <div key={index}>
                            {item.page_type === CUSTOM_PAGE_LINK_PAGE ? (
                              <Link href={"/" + item.key}>
                                <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                                  {item.title}
                                </a>
                              </Link>
                            ) : (
                              <a
                                href={item.page_link}
                                target="_blank"
                                rel="noreferrer"
                                className=" tradex-text-base !tradex-text-white tradex-font-medium"
                              >
                                {item.title}
                              </a>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className=" tradex-space-y-3 lg:tradex-space-y-10">
                  <div className=" tradex-flex tradex-items-center tradex-gap-2">
                    <h4 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-white tradex-font-bold">
                      {customPageData?.custom_page_list[3]?.name
                        ? customPageData?.custom_page_list[3]?.name
                        : t("Support")}
                    </h4>
                    <div className="tradex-w-[48px] tradex-h-[2px] tradex-bg-white"></div>
                  </div>
                  <div className=" tradex-flex tradex-flex-col tradex-gap-y-4">
                    {customPageData?.links?.map(
                      (item: any, index: any) =>
                        item.type === 3 && (
                          <div key={index}>
                            {item.page_type === CUSTOM_PAGE_LINK_PAGE ? (
                              <Link href={"/" + item.key}>
                                <a className=" tradex-text-base !tradex-text-white tradex-font-medium">
                                  {item.title}
                                </a>
                              </Link>
                            ) : (
                              <a
                                href={item.page_link}
                                target="_blank"
                                rel="noreferrer"
                                className=" tradex-text-base !tradex-text-white tradex-font-medium"
                              >
                                {item.title}
                              </a>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tradex-container tradex-pt-6 tradex-border-t tradex-border-[#D9D9D9]/50 tradex-flex tradex-justify-center">
            <p className=" tradex-text-base tradex-leading-[30px] tradex-font-medium tradex-text-white">
              {(copyright_text && copyright_text) || t("Copyright@2022")}{" "}
              <span className=" tradex-text-primary tradex-underline">
                {settings?.app_title ?? t("TradexPro")}
              </span>
            </p>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
