import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";

import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { getBlogNewsSettings, getNewsDetails } from "service/news";
import { GetServerSideProps } from "next";
import { formateData } from "common";
import SocialShare from "components/common/SocialShare";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import CommentSection from "components/Blog/CommentSection";
import { PostCommentAction } from "state/actions/news";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLoading } from "state/reducer/user";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { IoMdArrowBack } from "react-icons/io";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import VerticalNewsCard from "components/News/VerticalNewsCard";

const NewsDetails = ({ BlogNewsSettings }: any) => {
  const [newsDetails, setnewsDetails] = useState<any>();

  const { t } = useTranslation("common");
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const getDetails = async (id: any) => {
    // dispatch(setLoading(true));
    const newsDetails = await getNewsDetails(id);
    setnewsDetails(newsDetails?.data);
    // dispatch(setLoading(false));
  };
  useEffect(() => {
    id && getDetails(id);
  }, [id]);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[80px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-space-y-8">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <div className=" lg:tradex-col-span-2">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-8">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("News Details")}
                    </h2>
                    <Link href="/news">
                      <a className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-xl tradex-leading-6 tradex-text-body tradex-font-semibold">
                        <IoMdArrowBack />
                        {t("Back")}
                      </a>
                    </Link>
                  </div>

                  <div className=" tradex-space-y-6">
                    {newsDetails?.details?.thumbnail && (
                      <img
                        className=" tradex-rounded-lg tradex-max-h-[398px] tradex-h-full tradex-w-full tradex-object-cover tradex-object-center"
                        src={newsDetails?.details?.thumbnail}
                        alt=""
                      />
                    )}
                    <div className=" tradex-space-y-2">
                      <p className="tradex-text-primary tradex-text-sm tradex-leading-[18px] tradex-font-bold">
                        {formateData(newsDetails?.details?.created_at)}
                      </p>
                      <h3 className=" tradex-text-2xl tradex-leading-7 !tradex-text-title">
                        {newsDetails?.details?.title}
                      </h3>
                    </div>
                    <div
                      className=" blog-details-content !tradex-text-base !tradex-leading-6 !tradex-text-body"
                      dangerouslySetInnerHTML={{
                        __html: newsDetails?.details?.body,
                      }}
                    ></div>
                  </div>
                </div>
                {parseInt(BlogNewsSettings?.news_comment_enable) === 1 && (
                  <CommentSection
                    comments={newsDetails?.comments}
                    post_id={newsDetails?.details?.slug}
                    PostCommentAction={PostCommentAction}
                    comment_allow={newsDetails?.details?.comment_allow}
                  />
                )}
              </div>
              <div className=" tradex-space-y-10">
                <SocialShare
                  url={
                    process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL +
                    "news/" +
                    newsDetails?.details?.post_id
                  }
                />
                <div className="tradex-space-y-4">
                  <p className=" tradex-text-xl tradex-leading-7 tradex-text-title tradex-font-bold">
                    {t("Recent Posts")}
                  </p>
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-py-6 tradex-px-1.5 tradex-space-y-4">
                    {newsDetails?.related?.data?.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className=" tradex-border-b tradex-border-background-primary last:tradex-border-b-0 tradex-pb-4 last:tradex-pb-0"
                        >
                          <VerticalNewsCard news={item} />
                        </div>
                      )
                    )}
                  </div>
                </div>
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
  // await SSRAuthCheck(ctx, "/news");
  const { id } = ctx.params;
  // const newsDetails = await getNewsDetails(id);
  const { data: BlogNewsSettings } = await getBlogNewsSettings();
  const commonRes = await pageAvailabilityCheck();
  if (parseInt(commonRes.blog_news_module) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      // newsDetails: newsDetails.data,
      BlogNewsSettings: BlogNewsSettings,
    },
  };
};
export default NewsDetails;
