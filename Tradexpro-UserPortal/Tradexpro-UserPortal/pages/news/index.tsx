import { NewsList } from "components/News/NewsList";
import { NewsSlider } from "components/News/NewsSlider";
import Footer from "components/common/footer";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { NewsHomePageAction } from "state/actions/news";
import Pagination from "components/Pagination/Pagination";
import { Search } from "components/common/search";
import { getBlogNewsSettings } from "service/news";
import { NewsSearchAction } from "state/actions/news";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";

const News = ({ BlogNewsSettings }: any) => {
  const { t } = useTranslation("common");
  const [PopularNewsData, setPopularNews] = useState<any>([]);
  const [categories, setcategories] = useState<any>([]);
  const [recentNewsData, setRecentNews] = useState<any>(
    // RecentNews?.data?.data ? RecentNews?.data?.data : []
    []
  );
  const [links, setLinks] = useState();
  // RecentNews?.data?.links ? RecentNews?.data?.links : []
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const getIt = async () => {
    setLoading(true);
    const { Categories, PopularNews, RecentNews } = await NewsHomePageAction();
    setRecentNews(RecentNews?.data?.data ? RecentNews?.data?.data : []);
    setPopularNews(PopularNews);
    setcategories(Categories?.data);
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
                  parseInt(BlogNewsSettings?.news_search_enable) === 1
                    ? " md:tradex-col-span-2"
                    : "md:tradex-col-span-3"
                }
              >
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-2">
                  <h2 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                    {t("Top news")}
                  </h2>
                  <p className=" tradex-max-w-[600px] tradex-text-sm sm:tradex-text-base tradex-leading-[22px] tradex-text-body">
                    {t(
                      `Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?`
                    )}
                  </p>
                </div>
              </div>
              {parseInt(BlogNewsSettings?.news_search_enable) === 1 && (
                <div className="tradex-space-y-4">
                  <p className=" tradex-text-xl tradex-leading-7 tradex-text-title tradex-font-bold">
                    {t("Search Now")}
                  </p>
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-p-6">
                    <Search
                      searchFunction={NewsSearchAction}
                      linkName={"news"}
                    />
                  </div>
                </div>
              )}
            </div>
            <NewsSlider PopularNews={PopularNewsData?.data?.data} />
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-8">
              <NewsList
                recentNewsData={recentNewsData}
                setRecentNews={setRecentNews}
                categories={categories}
                loading={loading}
                setLoading={setLoading}
                setLinks={setLinks}
                setSelected={setSelected}
                selected={selected}
              />
            </div>
            {recentNewsData.length !== 0 && (
              <Pagination
                setRecentNews={setRecentNews}
                links={links}
                setLinks={setLinks}
                setLoading={setLoading}
                selected={selected}
              />
            )}
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
  // const { Categories, PopularNews, RecentNews } = await NewsHomePageAction();
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
      // PopularNews: PopularNews,
      // RecentNews: RecentNews,
      // categories: Categories?.data,
      BlogNewsSettings: BlogNewsSettings,
    },
  };
};
export default News;
