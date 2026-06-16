import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
const profileTabs = [
  {
    name: "My Profile",
    url: `/user/profile`,
  },
  {
    name: "Edit Profile",
    url: `/user/edit-profile`,
  },
  {
    name: "Phone Verification",
    url: `/user/phone-verification`,
  },
  {
    name: "Security",
    url: `/user/security`,
  },
  {
    name: "KYC Verification",
    url: `/user/personal-verification`,
  },
  {
    name: "Bank List",
    url: `/user/bank/list`,
  },
  {
    name: "Change Password",
    url: `/user/change-password`,
  },
];
export default function WalletSidebar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);
  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      <div className=" tradex-space-y-4">
        <Link href="/wallet-overview">
          <a
            className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
              router.pathname == "/wallet-overview" &&
              "tradex-bg-primary !tradex-text-white"
            }`}
          >
            {t("Overview")}
          </a>
        </Link>
        <Link href="/user/my-wallet">
          <a
            className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
              router.pathname == "/user/my-wallet" &&
              "tradex-bg-primary !tradex-text-white"
            }`}
          >
            {t("Spot")}
          </a>
        </Link>
        {Number(settings?.enable_future_trade) === 1 && (
          <Link href="/futures/wallet-list">
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == "/futures/wallet-list" &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {t("Futures")}
            </a>
          </Link>
        )}

        {parseInt(settings.p2p_module) === 1 && (
          <Link href="/p2p/p2p-wallet">
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == "/p2p/p2p-wallet" &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {t("P2P")}
            </a>
          </Link>
        )}
        <Link href={`/user/check-deposit`}>
          <a
            className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
              router.pathname == `/user/check-deposit` &&
              "tradex-bg-primary !tradex-text-white"
            }`}
          >
            {t("Check Deposit")}
          </a>
        </Link>
        <Link href={`/user/wallet-history?type=deposit`}>
          <a
            className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
              router.pathname == `/user/wallet-history?type=deposit` &&
              "tradex-bg-primary !tradex-text-white"
            }`}
          >
            {t("Deposit History")}
          </a>
        </Link>
        <Link href={`/user/wallet-history?type=withdrawal`}>
          <a
            className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
              router.pathname == `/user/wallet-history?type=withdrawal` &&
              "tradex-bg-primary !tradex-text-white"
            }`}
          >
            {t("Withdrawal History")}
          </a>
        </Link>
        <Link href={`/user/transaction-history`}>
          <a
            className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
              router.pathname == `/user/transaction-history` &&
              "tradex-bg-primary !tradex-text-white"
            }`}
          >
            {t("Transaction History")}
          </a>
        </Link>
      </div>
    </div>
  );
}
