import Footer from "components/common/footer";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";

import React from "react";

import WalletLayout from "components/wallet/WalletLayout";
import CheckDeposit from "components/check-deposit/CheckDeposit";

export default function CheckDeposits() {
  return (
    <div>
      <WalletLayout>
        <CheckDeposit titleClass="tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title" />
      </WalletLayout>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/check-deposit");

  return {
    props: {},
  };
};
