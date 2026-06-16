import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import type { GetServerSideProps, NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { getFaqList } from "service/faq";
import { customPage, landingPage } from "service/landing-page";

const Index: NextPage = ({ faq }: any) => {
  const { t } = useTranslation("common");
  const [active, setActive] = useState<number>(1);
  const handleActive = (index: number) => {
    if (index === active) {
      setActive(0);
    } else {
      setActive(index);
    }
  };

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10 tradex-space-y-16">
            <div className=" tradex-flex tradex-gap-6 tradex-items-center">
              <h2 className="!tradex-text-title tradex-text-3xl sm:tradex-text-[40px] sm:tradex-leading-[48px] tradex-font-bold tradex-text-nowrap">
                {t("Frequently Asked Questions")}
              </h2>
              <hr className=" tradex-w-full tradex-bg-background-primary" />
            </div>
            <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
              <div>
                <img src="/faq_default_image.png" alt="faq-image" />
              </div>
              <div className="accordion" id="accordionExample">
                {faq?.data?.map((item: any, index: number) => (
                  <div key={`faq${index}`} className="">
                    <div className="card">
                      <div
                        className="card-header"
                        id="headingOne"
                        onClick={() => handleActive(index + 1)}
                      >
                        <h5 className="mb-0 header-align">
                          <button
                            className="btn btn-link collapsed"
                            data-toggle="collapse"
                            data-target={`#collapseOne1${index + 1}`}
                            aria-expanded="true"
                            aria-controls="collapseOne"
                          >
                            {item.question}
                          </button>
                          <i
                            className={`fas ${
                              active === index + 1
                                ? "fa-caret-up"
                                : "fa-caret-down"
                            } mright-5`}
                          ></i>
                        </h5>
                      </div>

                      <div
                        id={`collapseOne1${index + 1}`}
                        className={`collapse ${index + 1 === 1 && "show"}`}
                        aria-labelledby="headingOne"
                        data-parent="#accordionExample"
                      >
                        <div className="card-body">{item.answer}</div>
                      </div>
                    </div>
                  </div>
                ))}
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
  const { data: faqs } = await getFaqList();
  return {
    props: {
      faq: faqs,
    },
  };
};

export default Index;
