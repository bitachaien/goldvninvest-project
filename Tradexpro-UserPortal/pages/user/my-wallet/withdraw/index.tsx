import CheckDeposit from "components/check-deposit/CheckDeposit";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import FAQ from "components/FAQ";
import DepositComp from "components/MyWallet/DepositComp";
import WithdrawComp from "components/MyWallet/WithdrawComp";
import Wallethistory from "components/wallet/wallet-history";
import WalletLayout from "components/wallet/WalletLayout";
import { CURRENCY_TYPE_CRYPTO, FAQ_TYPE_DEPOSIT, FAQ_TYPE_WITHDRAWN } from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getFaqList } from "service/faq";
import { UserSettingsApi } from "service/settings";
import { GetUserInfoByTokenServer } from "service/user";
import {
  getCoinListForDepositAndWithdrawalApi,
  MyWalletProcessSidebar,
} from "service/wallet";
import { RootState } from "state/store";

export default function Withdraw({ withdrawFaq }: any) {
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);
  const [fullPage, setFullPage] = useState(false);
  const [processData, setProcessData]: any = useState([]);
  const [isG2faError, setIsG2faError] = useState(false);

  const router = useRouter();
  const [coinLists, setCoinLists] = useState<any>([]);
  const [isGettingCoinLists, setIsGettingCoinLists] = useState<boolean>(true);

  const getCoinListHandler = async () => {
    setIsGettingCoinLists(true);
    try {
      const response = await getCoinListForDepositAndWithdrawalApi(
        `is_withdrawal=true&currency_type=${CURRENCY_TYPE_CRYPTO}`
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

  const CheckG2faEnabled = async () => {
    if (parseInt(settings.two_factor_withdraw) !== 1) return true;
    const { data } = await UserSettingsApi();
    const { user } = data;
    if (
      !user.google2fa_secret &&
      parseInt(settings.two_factor_withdraw) === 1
    ) {
      // setErrorMessage({
      //   status: true,
      //   message: "Google 2FA is not enabled, Please enable Google 2FA fist",
      // });
      setIsG2faError(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!settings) return;
    (async function () {
      const isG2faEnabled = await CheckG2faEnabled();
      if (!isG2faEnabled) {
        setIsGettingCoinLists(false);
        return;
      }
      await getCoinListHandler();
    })();
  }, [settings]);

  const checkFullPageStatus = () => {
    const faqStatus = Number(settings.withdrawal_faq_status ?? 0);
    const progressStatus = Number(
      processData?.data?.progress_status_for_withdrawal ?? 0
    );
    const progressStatusList = processData?.data?.progress_status_list ?? [];

    if (faqStatus !== 1 && progressStatus !== 1) {
      setFullPage(true);
      return;
    }

    if (withdrawFaq?.length === 0 && !progressStatusList.length) {
      setFullPage(true);
    }
  };

  const getProcess = async () => {
    const processData = await MyWalletProcessSidebar("withdraw");
    setProcessData(processData);
  };
  useEffect(() => {
    getProcess();
  }, []);

  useEffect(() => {
    checkFullPageStatus();
  }, [
    settings.withdrawal_faq_status,
    withdrawFaq?.length,
    processData?.data?.progress_status_list,
    processData?.data?.progress_status_for_withdrawal,
  ]);

  if (isGettingCoinLists)
    return (
      <WalletLayout>
        <SectionLoading />
      </WalletLayout>
    );

  return (
    <>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
              {t("Withdraw")}
            </h2>
            <div
              onClick={() => {
                router.back();
              }}
              className=" tradex-flex tradex-gap-1 tradex-items-center tradex-cursor-pointer"
            >
              <BiArrowBack />
              <h5 className="tradex-text-xl tradex-leading-6 tradex-font-medium !tradex-text-title">
                {t("My Wallet")}
              </h5>
            </div>
          </div>

          <div
            className={`tradex-grid  tradex-gap-4 ${
              fullPage ? "tradex-grid-cols-1" : "md:tradex-grid-cols-2"
            }`}
          >
            {isG2faError ? (
              <div className=" tradex-p-3 rounded tradex-bg-yellow-100 tradex-text-sm">
                <p className=" tradex-text-yellow-900">
                  {t("Google 2FA is not enabled")}.{" "}
                  {t("Please enable Google 2FA first")}. {t("Click")}{" "}
                  <Link href={`/user/settings`}>
                    <a className=" tradex-underline tradex-font-bold !tradex-text-yellow-900">
                      [{t("here")}]
                    </a>
                  </Link>{" "}
                  {t("to enable it")}.
                </p>
              </div>
            ) : (
              <WithdrawComp coinLists={coinLists} />
            )}
            {fullPage === false && (
              <div>
                {parseInt(settings.withdrawal_faq_status) === 1 &&
                  withdrawFaq?.length > 0 && (
                    <div className={`box-one single-box visible mb-25`}>
                      <div className="my-wallet-new rounded px-0">
                        <FAQ faqs={withdrawFaq} />
                      </div>
                    </div>
                  )}

                {processData?.data?.progress_status_list?.length > 0 && (
                  <div className="mt-3">
                    <h4>{t("Deposit Step's")}</h4>

                    <div className="flexItem">
                      <div>
                        {processData?.data?.progress_status_list?.map(
                          (item: any, index: number) => (
                            <div
                              key={`progress${index}`}
                              className={"timeLineLists"}
                            >
                              <div
                                className={`${
                                  processData?.data?.progress_status_list
                                    ?.length ==
                                  index + 1
                                    ? "timeLineIcon removeBeforeCSS"
                                    : "timeLineIcon"
                                }`}
                              >
                                <i className="fa-sharp fa-solid fa-circle-check active"></i>
                              </div>
                              <div className="progressContent">
                                <h5>{item.title}</h5>
                                <span>{item.description}</span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <Wallethistory type="withdrawal" />
        </div>
      </WalletLayout>

      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/my-wallet/withdraw");
  const cookies = parseCookies(ctx);
  const response = await GetUserInfoByTokenServer(cookies.token);
  const FAQ = await getFaqList();
  let withdrawFaq: any[] = [];
  FAQ.data?.data?.map((faq: any) => {
    if (faq?.faq_type_id === FAQ_TYPE_WITHDRAWN) {
      withdrawFaq.push(faq);
    }
  });

  return {
    props: {
      user: response.user,
      withdrawFaq: withdrawFaq,
    },
  };
};
