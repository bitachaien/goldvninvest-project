import React, { useEffect, useState } from "react";
import BlogCard from "components/Blog/Card";
import { GetServerSideProps } from "next";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { getBlogDetails } from "service/blog";
import CommentSection from "components/Blog/CommentSection";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import { PostCommentAction } from "state/actions/blog";
import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import useTranslation from "next-translate/useTranslation";
import { formateData } from "common";
import SocialShare from "components/common/SocialShare";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLoading } from "state/reducer/user";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { IoMdArrowBack } from "react-icons/io";
import VerticalBlogCard from "components/Blog/VerticalBlogCard";

const BlogDetails = ({ BlogNewsSettings }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const [blogDetails, setblogDetails] = useState<any>();
  const getDetails = async (id: any) => {
    // dispatch(setLoading(true));
    const BlogDetails = await getBlogDetails(id);
    setblogDetails(BlogDetails);
    // dispatch(setLoading(false));
  };
  useEffect(() => {
    id && getDetails(id);
  }, [id]);

  console.log("BlogNewsSettings", blogDetails);

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
                      {t("Blog Details")}
                    </h2>
                    <Link href="/blog">
                      <a className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-xl tradex-leading-6 tradex-text-body tradex-font-semibold">
                        <IoMdArrowBack />
                        {t("Back")}
                      </a>
                    </Link>
                  </div>

                  <div className=" tradex-space-y-6">
                    {blogDetails?.data?.details?.thumbnail && (
                      <img
                        className=" tradex-rounded-lg tradex-max-h-[398px] tradex-h-full tradex-w-full tradex-object-cover tradex-object-center"
                        src={blogDetails?.data?.details?.thumbnail}
                        alt=""
                      />
                    )}
                    <div className=" tradex-space-y-2">
                      <p className="tradex-text-primary tradex-text-sm tradex-leading-[18px] tradex-font-bold">
                        {formateData(blogDetails?.data?.details?.created_at)}
                      </p>
                      <h3 className=" tradex-text-2xl tradex-leading-7 !tradex-text-title">
                        {blogDetails?.data?.details?.title}
                      </h3>
                    </div>
                    <div
                      className=" blog-details-content !tradex-text-base !tradex-leading-6 !tradex-text-body"
                      dangerouslySetInnerHTML={{
                        __html: blogDetails?.data?.details?.body,
                      }}
                    ></div>
                  </div>
                </div>
                {parseInt(blogDetails?.data?.details?.comment_allow) === 1 && (
                  <CommentSection
                    comments={blogDetails?.data?.comments}
                    post_id={blogDetails?.data?.details?.post_id}
                    PostCommentAction={PostCommentAction}
                    comment_allow={blogDetails?.data?.details?.comment_allow}
                  />
                )}
              </div>
              <div className=" tradex-space-y-10">
                <SocialShare
                  url={
                    process.env.NEXT_PUBLIC_HOSTED_CLIENT_URL +
                    "news/" +
                    blogDetails?.data?.details?.post_id
                  }
                />
                <div className="tradex-space-y-4">
                  <p className=" tradex-text-xl tradex-leading-7 tradex-text-title tradex-font-bold">
                    {t("More blog from here")}
                  </p>
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-py-6 tradex-px-1.5 tradex-space-y-4">
                    {blogDetails?.data?.related?.data?.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className=" tradex-border-b tradex-border-background-primary last:tradex-border-b-0 tradex-pb-4 last:tradex-pb-0"
                        >
                          <VerticalBlogCard blog={item} />
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
  // await SSRAuthCheck(ctx, "/blog");
  const { id } = ctx.params;
  // const BlogDetails = await getBlogDetails(id, ctx.locale);
  const { data } = await landingPage(ctx.locale);
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
      // blogDetails: BlogDetails,
      socialData: data.media_list,
    },
  };
};

export default BlogDetails;
