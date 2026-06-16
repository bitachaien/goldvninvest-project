import { InvesmentOrderTable } from "components/Staking/MyOrders";
import StakingHeader from "components/Staking/StakingHeader";
import StakingLayout from "components/Staking/StakingLayout";
import StakingSidebar from "components/Staking/StakingSidebar";
import { StakingTopBar } from "components/Staking/common/TopBar";
import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { myOrderAction } from "state/actions/staking";

const MyOrder = () => {
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
                  {t("My Investments")}
                </h2>
              </div>
              <InvesmentOrderTable
                actionFunction={myOrderAction}
                filter={true}
              />
            </div>
          </div>
        </div>
      </StakingLayout>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/staking");

  return {
    props: {},
  };
};
export default MyOrder;
