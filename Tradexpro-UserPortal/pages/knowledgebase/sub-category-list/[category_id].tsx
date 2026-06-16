import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { KnowledgeTopBanner } from "components/Knowledgebase/KnowledgeTopBanner";
import { KnowledgeCard } from "components/Knowledgebase/knowledge-card";
import { TopBanner } from "components/Knowledgebase/top-banner";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import { pageAvailabilityCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { siteSettingResource } from "service/knowledgebase";
import { customPage, landingPage } from "service/landing-page";
import { knowledgebaseSubcategoryListbyIdAction } from "state/actions/knowlegdgbase";

const KnowledgebaseCategory = ({ resorce }: any) => {
  const { t } = useTranslation("common");

  const [list, setList] = useState([]);
  const [details, setDetails] = useState<any>({});
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    router.query.category_id &&
      knowledgebaseSubcategoryListbyIdAction(
        setList,
        setDetails,
        setLoading,
        router.query.category_id
      );
  }, [router.query.category_id]);
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-space-y-12">
              <KnowledgeTopBanner resorce={resorce} />
              <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-6 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                {Loading ? (
                  <SectionLoading />
                ) : (
                  <div className=" tradex-space-y-12">
                    <div className=" tradex-space-y-6 ">
                      <h3 className="tradex-text-2xl md:tradex-text-[32px] md:tradex-leading-[38px] !tradex-text-title tradex-font-bold">
                        {details?.name}
                      </h3>
                      <div className=" tradex-grid md:tradex-grid-cols-2 xl:tradex-grid-cols-3 tradex-gap-6">
                        {list.map((Subcategory, index: any) => (
                          <KnowledgeCard
                            key={index}
                            subCategory={Subcategory}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
  const commonRes = await pageAvailabilityCheck();
  const resorce = await siteSettingResource();

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
      resorce: resorce,
    },
  };
};
export default KnowledgebaseCategory;
