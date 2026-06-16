import Footer from "components/common/footer";
import WalletLayout from "components/wallet/WalletLayout";
import { SEND } from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { walletBalanceTransfer } from "service/p2p";
import { RootState } from "state/store";

const Exchange = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [amount, setAmount] = useState(0);
  const { type, coin } = router.query;
  const { settings } = useSelector((state: RootState) => state.common);
  const getBalance = async () => {
    const response = await walletBalanceTransfer(type, coin, amount);
    if (response.success) {
      toast.success(response.message);
      router.push("/p2p/p2p-wallet");
    } else {
      toast.error(response.message);
    }
  };
  return (
    <>
      <WalletLayout>
        <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
          <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
            <div>
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {/* @ts-ignore */}
                {parseInt(type) === SEND
                  ? t("Send Balance")
                  : t("Recieve Balance")}
              </h2>
              {/* @ts-ignore */}
              {parseInt(type) === SEND ? (
                <p className=" tradex-text-sm tradex-text-body">
                  {t("Retrieve")} {coin} {t("from P2P wallet to spot wallet")}
                </p>
              ) : (
                <p className=" tradex-text-sm tradex-text-body">
                  {t("Receive")} {coin}{" "}
                  {t("from spot wallet to P2P wallet and start P2P trading")}
                </p>
              )}
            </div>
            <Link href="/p2p/p2p-wallet">
              <div className=" tradex-flex tradex-gap-1 tradex-items-center tradex-cursor-pointer">
                <IoIosArrowBack />
                <h5 className="tradex-text-xl tradex-leading-6 tradex-font-medium !tradex-text-title">
                  {t("P2P Wallet")}
                </h5>
              </div>
            </Link>
          </div>
          <div className=" tradex-space-y-6">
            <input
              type="number"
              placeholder={t("Enter amount")}
              value={amount}
              onChange={(e) => {
                setAmount(parseFloat(e.target.value));
              }}
              className="tradex-input-field"
            />
            <button
              className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
              onClick={getBalance}
            >
              {t("Exchange")}
            </button>
          </div>
        </div>
      </WalletLayout>
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/p2p");

  return {
    props: {},
  };
};
export default Exchange;
