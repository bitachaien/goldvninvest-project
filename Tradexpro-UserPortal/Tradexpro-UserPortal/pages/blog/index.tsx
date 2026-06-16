import CardSection from "components/Blog/CardSection";
import SliderCover from "components/Blog/SliderCover";
import TabSection from "components/Blog/TabSection";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import { Search } from "components/common/search";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { getBlogNewsSettings } from "service/news";
import { BlogHomePageAction, BlogSearchAction } from "state/actions/blog";

const Index = ({}: any) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [featuredBlogs, setfeaturedBlogs] = useState<any>();
  const [categories, setcategories] = useState();
  const [BlogNewsSettings, setBlogNewsSettings] = useState<any>(false);
  const [recentBlogsState, setRecentBlogState] = useState([]);

  const getIt = async () => {
    setLoading(true);
    const { FeaturedBlogs, RecentBlogs, Categories } =
      await BlogHomePageAction();
    setfeaturedBlogs(FeaturedBlogs.data);
    setRecentBlogState(RecentBlogs.data.data);
    setcategories(Categories.data);
    const { data: BlogNewsSettings } = await getBlogNewsSettings();
    setBlogNewsSettings(BlogNewsSettings);
    setLoading(false);
  };
  useEffect(() => {
    getIt();
  }, []);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-space-y-8">
            <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-3 tradex-gap-6">
              <div
                className={
                  parseInt(BlogNewsSettings?.blog_search_enable) === 1
                    ? " md:tradex-col-span-2"
                    : "md:tradex-col-span-3"
                }
              >
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-2">
                  <h2 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                    {BlogNewsSettings?.blog_feature_heading ||
                      t("Tradexpro Exchange Blog")}
                  </h2>
                  <p className="   tradex-max-w-[600px] tradex-text-sm sm:tradex-text-base tradex-leading-[22px] tradex-text-body">
                    {BlogNewsSettings?.blog_feature_description ||
                      t(
                        `Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?`
                      )}
                  </p>
                </div>
              </div>
              {parseInt(BlogNewsSettings?.blog_search_enable) === 1 && (
                <div className="tradex-space-y-4">
                  <p className=" tradex-text-xl tradex-leading-7 tradex-text-title tradex-font-bold">
                    {t("Search Now")}
                  </p>
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-p-6">
                    <Search
                      searchFunction={BlogSearchAction}
                      linkName={"blog"}
                    />
                  </div>
                </div>
              )}
            </div>

            <SliderCover
              featuredblogs={featuredBlogs?.data}
              loading={loading}
            />
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-8">
              {categories && (
                <TabSection
                  categories={categories}
                  setRecentBlogState={setRecentBlogState}
                  setLoading={setLoading}
                />
              )}

              <CardSection blogs={recentBlogsState} loading={loading} />
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
  // const { FeaturedBlogs, RecentBlogs, Categories } = await BlogHomePageAction(
  //   ctx.locale
  // );
  // const cookies = parseCookies(ctx);
  // const response = await GetUserInfoByTokenServer(cookies.token);
  // const { data: BlogNewsSettings } = await getBlogNewsSettings();
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
      // featuredBlogs: FeaturedBlogs.data,
      // recentBlogs: RecentBlogs.data,
      // categories: Categories?.data,
      // BlogNewsSettings: BlogNewsSettings,
    },
  };
};
export default Index;
