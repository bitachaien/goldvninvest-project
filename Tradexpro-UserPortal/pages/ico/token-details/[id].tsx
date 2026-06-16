import { Breadcrumb } from "components/Breadcrumb";
import { SingleLaunchPad } from "components/ico/SingleLaunchPad";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getLaunchpadListDetailsAction } from "state/actions/launchpad";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { customPage, landingPage } from "service/landing-page";
import { parseCookies } from "nookies";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function SingleLaunchPadPage({
  customPageData,
  socialData,
  copyright_text,
}: any) {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [loading, setLoading] = useState(true);
  const [launchpadListDetails, setLaunchpadListDetails]: any = useState([]);
  useEffect(() => {
    getLaunchpadListDetailsAction(
      setLaunchpadListDetails,
      router.query.id,
      setLoading
    );
  }, []);

  return (
    <>
      {loading ? (
        <SectionLoading />
      ) : (
        <>
          <div className={` tradex-relative`}>
            <section className="tradex-pt-[50px] tradex-relative">
              <TopLeftInnerPageCircle />
              <TopRightInnerPageCircle />
              <div className=" tradex-container tradex-relative tradex-z-10">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className=" tradex-space-y-4">
                    <div className=" tradex-space-y-2">
                      <h2 className="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                        {launchpadListDetails?.data?.phase_title}
                      </h2>
                      <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
                        {launchpadListDetails?.data?.description}
                      </p>
                    </div>
                    <div className=" tradex-flex tradex-items-center tradex-gap-5">
                      <Link href={"/ico"}>
                        <div className=" tradex-cursor-pointer tradex-flex tradex-gap-2 tradex-items-center tradex-text-title">
                          <FaArrowLeft />
                          <h2 className=" tradex-text-xl tradex-leading-6 !tradex-text-title">
                            {t("Homepage")}
                          </h2>
                        </div>
                      </Link>
                      <div className=" tradex-w-full tradex-h-[1px] tradex-bg-background-primary"></div>
                    </div>
                  </div>

                  {/* <Breadcrumb leftButton={true} leftUrl="/ico" /> */}
                  <SingleLaunchPad data={launchpadListDetails?.data} />
                </div>
              </div>
            </section>
            <StartTrending />
            <BottomLeftInnerPageCircle />
            <BottomRigtInnerPageCircle />
          </div>

          <Footer />
        </>
      )}
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/profile");
  const { id, edit } = ctx.query;
  return {
    props: {
      id: id,
      edit: edit ? edit : null,
    },
  };
};
