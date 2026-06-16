import React, { useEffect, useState } from "react";
import { StakingTopBar } from "components/Staking/common/TopBar";
import OfferTable from "components/Staking/Home/OfferTable";
import FaqStaking from "components/Staking/Home/FaqStaking";
import Footer from "components/common/footer";
import { getOfferListAction } from "state/actions/staking";
import { GetServerSideProps } from "next";
import { LandingDetailsStaking } from "service/staking";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import StakingHeader from "components/Staking/StakingHeader";
import StakingLayout from "components/Staking/StakingLayout";
import StakingSidebar from "components/Staking/StakingSidebar";
import useTranslation from "next-translate/useTranslation";

const Index = ({ data }: any) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("common");
  return (
    <>
      <StakingLayout>
        <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
          <StakingSidebar />
          <div className="lg:tradex-col-span-2 tradex-space-y-6">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                  {data?.staking_landing_title || t("Staking")}
                </h2>
                {data?.staking_landing_description && (
                  <p className=" tradex-text-sm tradex-leading-[22px] tradex-text-body">
                    {data?.staking_landing_description}
                  </p>
                )}
              </div>
              <OfferTable isLoggedIn={isLoggedIn} />
            </div>
          </div>
        </div>
        <FaqStaking faq_list={data?.faq_list} />
      </StakingLayout>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const response = await LandingDetailsStaking();

  if (!response?.success) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const { data } = response;

  return {
    props: {
      data: data,
    },
  };
};
export default Index;
