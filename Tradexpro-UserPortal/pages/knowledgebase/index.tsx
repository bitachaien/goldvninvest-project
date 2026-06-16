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
import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteSettingResource } from "service/knowledgebase";
import { customPage, landingPage } from "service/landing-page";
import { getKnowledgebaseInfoAction } from "state/actions/knowlegdgbase";

const Knowledgebase = ({ resorce }: any) => {
  const [loading, setLoading] = useState(true);
  const [knowledgebase, setKnowledgebase] = useState([]);
  useEffect(() => {
    getKnowledgebaseInfoAction(setKnowledgebase, setLoading);
  }, []);
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
                {loading ? (
                  <SectionLoading />
                ) : (
                  <div className=" tradex-space-y-12">
                    {knowledgebase.map((section: any, key: any) => (
                      <div className=" tradex-space-y-6 " key={key}>
                        <div>
                          <Link
                            href={
                              "/knowledgebase/sub-category-list/" +
                              section.unique_code
                            }
                          >
                            <h3 className=" tradex-text-2xl md:tradex-text-[32px] md:tradex-leading-[38px] !tradex-text-title tradex-font-bold hover:!tradex-text-primary tradex-cursor-pointer">
                              {section?.name}
                            </h3>
                          </Link>
                        </div>
                        <div className=" tradex-grid md:tradex-grid-cols-2 xl:tradex-grid-cols-3 tradex-gap-6">
                          {section?.knb_sub_category.map(
                            (subCategory: any, index: any) => (
                              <KnowledgeCard
                                key={index}
                                subCategory={subCategory}
                              />
                            )
                          )}
                        </div>
                      </div>
                    ))}
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
export default Knowledgebase;
