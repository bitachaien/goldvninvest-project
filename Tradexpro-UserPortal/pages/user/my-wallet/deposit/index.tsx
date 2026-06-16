import CheckDeposit from "components/check-deposit/CheckDeposit";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import FAQ from "components/FAQ";
import DepositComp from "components/MyWallet/DepositComp";
import Wallethistory from "components/wallet/wallet-history";
import WalletLayout from "components/wallet/WalletLayout";
import { CURRENCY_TYPE_CRYPTO, FAQ_TYPE_DEPOSIT } from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { toast } from "react-toastify";
import { getFaqList } from "service/faq";
import { GetUserInfoByTokenServer } from "service/user";
import { getCoinListForDepositAndWithdrawalApi } from "service/wallet";

export default function Deposit({ depositFaq }: any) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [coinLists, setCoinLists] = useState<any>([]);
  const [isGettingCoinLists, setIsGettingCoinLists] = useState<boolean>(true);

  const getCoinListHandler = async () => {
    setIsGettingCoinLists(true);
    try {
      const response = await getCoinListForDepositAndWithdrawalApi(
        `is_deposit=true&currency_type=${CURRENCY_TYPE_CRYPTO}`
      );
      if (response?.data?.length == 0) {
        router.push("/user/my-wallet");
        return;
      }
      if (!response?.success) {
        toast.error(response?.message);
        router.push("/user/my-wallet");
        return;
      }
      setCoinLists(response?.data);
      setIsGettingCoinLists(false);
    } catch (error) {
      toast.error(`Something went wrong`);
      router.push("/user/my-wallet");
      setIsGettingCoinLists(false);
    }
  };

  useEffect(() => {
    getCoinListHandler();
  }, []);

  if (isGettingCoinLists)
    return (
      <WalletLayout>
        <SectionLoading />
      </WalletLayout>
    );

  return (
    <>
      <WalletLayout>
        <DepositComp coinLists={coinLists} depositFaq={depositFaq} />

        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <Wallethistory type="deposit" />
        </div>
      </WalletLayout>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet/deposit");
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);
  const FAQ = await getFaqList();
  let depositFaq: any[] = [];
  FAQ.data?.data?.map((faq: any) => {
    if (faq?.faq_type_id === FAQ_TYPE_DEPOSIT) {
      depositFaq.push(faq);
    }
  });

  return {
    props: {
      user: response.user,
      depositFaq: depositFaq,
    },
  };
};
