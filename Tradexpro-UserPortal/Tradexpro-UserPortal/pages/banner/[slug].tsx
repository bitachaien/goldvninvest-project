import { formateData } from "common";
import Footer from "components/common/footer";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { bannerDetailsBySlug } from "service/landing-page";
//@ts-ignore
import sanitizeHtml from "sanitize-html";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const Bannerdetails = ({ details, status }: any) => {
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
  if (status === false) {
    return (
      <>
        <div className={` tradex-relative`}>
          <section className="tradex-pt-[50px] tradex-relative">
            <TopLeftInnerPageCircle />
            <TopRightInnerPageCircle />
            <div className=" tradex-container tradex-relative tradex-z-10">
              <div className="tradex-text-center">
                <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold">{t("404 not found")}</h4>
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
  }
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 tradex-gap-6">
              <div>
                <img
                  src={details.image}
                  alt=""
                  className=" tradex-w-full tradex-object-cover tradex-object-center"
                />
              </div>
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
                    __html: clean(details.description),
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
  const { data } = await bannerDetailsBySlug(slug);
  return {
    props: {
      details: data.data,
      status: data.success,
    },
  };
};
export default Bannerdetails;
