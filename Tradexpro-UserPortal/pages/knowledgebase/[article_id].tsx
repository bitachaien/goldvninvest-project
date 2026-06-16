import { formateData } from "common";
import { ArticalCard } from "components/Knowledgebase/article-card";
import Footer from "components/common/footer";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import { articleDetails } from "service/knowledgebase";
import { customPage, landingPage } from "service/landing-page";
import { getNewsDetails } from "service/news";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/router";

const KnowledgebaseArticleDetails = ({ articleDetails }: any) => {
  const { t } = useTranslation("common");

  const router = useRouter();

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[80px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-space-y-8">
            <div
              className={` tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6 ${
                articleDetails?.related_article_list?.length > 0 &&
                "tradex-grid"
              }`}
            >
              <div className=" lg:tradex-col-span-2">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-8">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Article Details")}
                    </h2>

                    <div
                      onClick={() => {
                        router.back();
                      }}
                      className=" tradex-cursor-pointer tradex-flex tradex-gap-2 tradex-items-center tradex-text-xl tradex-leading-6 tradex-text-body tradex-font-semibold"
                    >
                      <IoMdArrowBack />
                      {t("Back")}
                    </div>
                  </div>

                  <div className=" tradex-space-y-8 tradex-py-10 tradex-px-4 tradex-border tradex-border-background-primary tradex-rounded-lg">
                    {articleDetails.article_details?.feature_image_url && (
                      <img
                        className=" tradex-rounded-lg tradex-max-h-[398px] tradex-h-full tradex-w-full tradex-object-cover tradex-object-center"
                        src={articleDetails.article_details?.feature_image_url}
                        alt=""
                      />
                    )}
                    <div className=" tradex-space-y-4">
                      <div className=" tradex-flex tradex-gap-3 tradex-items-start">
                        <div className=" tradex-min-w-10">
                          <img src="/article_img_knowladge.svg" alt="" />
                        </div>
                        <div className=" tradex-space-y-2">
                          <h3 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-title">
                            {articleDetails.article_details?.title}
                          </h3>
                          <p className="tradex-text-primary tradex-text-sm tradex-leading-[18px] tradex-font-bold">
                            {formateData(
                              articleDetails.article_details.created_at
                            )}
                          </p>
                        </div>
                      </div>
                      <div
                        className=" blog-details-content !tradex-text-base !tradex-leading-6 !tradex-text-body"
                        dangerouslySetInnerHTML={{
                          // __html: clean(details.description),
                          __html: articleDetails.article_details.description,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              {articleDetails.related_article_list?.length > 0 && (
                <div className=" tradex-space-y-10">
                  <div className="tradex-space-y-4">
                    <p className=" tradex-text-xl tradex-leading-7 tradex-text-title tradex-font-bold">
                      {t("Related article")}
                    </p>
                    <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-py-6 tradex-px-3 tradex-space-y-4">
                      {articleDetails.related_article_list.map(
                        (article: any, index: any) => (
                          <Link
                            key={index}
                            href={"/knowledgebase/" + article.unique_code}
                          >
                            <div className=" tradex-pb-3 tradex-border-b tradex-border-background-primary last:tradex-border-b-0 last:tradex-pb-0 tradex-cursor-pointer tradex-flex tradex-gap-3 tradex-items-start">
                              <div className=" tradex-min-w-10">
                                <img src="/article_img_knowladge.svg" alt="" />
                              </div>
                              <div className=" tradex-space-y-2">
                                <h3 className=" tradex-text-lg tradex-leading-[22px] !tradex-text-title">
                                  {article?.title}
                                </h3>
                                <p className="tradex-text-primary tradex-text-xs tradex-leading-[18px] tradex-font-bold">
                                  {formateData(article.created_at)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
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
  const { article_id } = ctx.params;
  const Details = await articleDetails(article_id);
  const commonRes = await pageAvailabilityCheck();
  if (parseInt(commonRes.knowledgebase_support_module) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      articleDetails: Details.data,
    },
  };
};
export default KnowledgebaseArticleDetails;
