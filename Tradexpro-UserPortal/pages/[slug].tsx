import { formateData } from "common";
import Footer from "components/common/footer";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import {
  CommonLandingCustomSettings,
  customPageWithSlug,
} from "service/landing-page";
import UnAuthNav from "components/common/unAuthNav";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import Navbar from "components/common/Navbar";
import { parseCookies } from "nookies";
//@ts-ignore
import sanitizeHtml from "sanitize-html";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const Bannerdetails = ({
  details,
  status,
  customPageData,
  socialData,
  copyright_text,
  customSettings,
  loggedin,
}: any) => {
  const { t } = useTranslation("common");

  const clean = (dirty: any) => {
    return sanitizeHtml(dirty, {
      allowedTags: [
        "b",
        "i",
        "em",
        "strong",
        "a",
        "font",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "div",
        "p",
        "br",
        "hr",
        "head",
      ],
      allowedAttributes: {
        a: ["href", "target", "style"],
        div: ["href", "target", "style"],
        b: ["href", "target", "style"],
        i: ["href", "target", "style"],
        em: ["href", "target", "style"],
        strong: ["href", "target", "style"],
        font: ["href", "target", "style"],
        h1: ["href", "target", "style"],
        h2: ["href", "target", "style"],
        h3: ["href", "target", "style"],
        h4: ["href", "target", "style"],
        h5: ["href", "target", "style"],
        h6: ["href", "target", "style"],
        p: ["href", "target", "style"],
      },
    });
  };
  const { user, logo } = useSelector((state: RootState) => state.user);

  if (status === false) {
    return (
      <div>
        {loggedin ? (
          <Navbar settings={customSettings} isLoggedIn={loggedin} />
        ) : (
          <UnAuthNav />
        )}
        <div className="notFound-container">
          {/* <h1 className="">404</h1> */}
          <img src="/not_found.svg" height={300} alt="" />
          <p className="">{t("Content Not Found")}</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div
              className={` ${
                details.image
                  ? "tradex-grid-cols-1 md:tradex-grid-cols-2"
                  : "tradex-grid-cols-1  "
              } tradex-grid tradex-gap-6`}
            >
              {details.image && (
                <div>
                  <img
                    src={details.image}
                    alt=""
                    className=" tradex-w-full tradex-object-cover tradex-object-center"
                  />
                </div>
              )}
              <div className=" tradex-space-y-2">
                <div className=" tradex-space-y-1">
                  <p className=" tradex-text-base md:tradex-text-lg tradex-leading-[26px] tradex-text-primary tradex-font-semibold">
                    {t("Last revised:")} {formateData(details.updated_at)}
                  </p>
                  <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold">
                    {details.title}
                  </h4>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: details.description,
                  }}
                ></div>
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
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const { slug } = ctx.query;

  let response: any;
  let CommonLanding;
  const cookies = parseCookies(ctx);
  try {
    const { data } = await customPageWithSlug(slug);
    response = data;
    const { data: Common } = await CommonLandingCustomSettings(ctx.locale);
    CommonLanding = Common;
  } catch (error) {}
  return {
    props: {
      details: response.data ?? null,
      status: response.success ?? false,
      customPageData: CommonLanding?.custom_page_settings
        ? CommonLanding.custom_page_settings
        : null,
      socialData: CommonLanding?.landing_settings?.media_list ?? [],
      copyright_text: CommonLanding?.landing_settings?.copyright_text
        ? CommonLanding?.landing_settings?.copyright_text
        : "",
      customSettings: CommonLanding?.common_settings ?? null,
      loggedin: cookies.token ? true : false,
    },
  };
};
export default Bannerdetails;
