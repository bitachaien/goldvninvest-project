import { tabs } from "helpers/core-constants";
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
export default function ReportSidebar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      <div className=" tradex-space-y-4">
        {tabs?.map((tab: any, index: any) => (
          <Link href={tab.link} key={index}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == tab.link &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {t(tab?.label)}
            </a>
          </Link>
        ))}
        {parseInt(settings?.swap_status) === 1 && (
          <Link href={"/user/swap-history"}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == "/user/swap-history" &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {t("Swap History")}
            </a>
          </Link>
        )}
        {settings?.navbar?.reports?.fiatDepositHistory?.status &&
          parseInt(settings.currency_deposit_status) === 1 && (
            <Link href={"/user/currency-deposit-history"}>
              <a
                className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                  router.pathname == "/user/currency-deposit-history" &&
                  "tradex-bg-primary !tradex-text-white"
                }`}
              >
                {t("Fiat To Crypto deposit History")}
              </a>
            </Link>
          )}
        {settings?.navbar?.reports?.fiatWithdrawalHistory?.status &&
          parseInt(settings.currency_deposit_status) === 1 && (
            <Link href={"/user/currency-withdraw-history"}>
              <a
                className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                  router.pathname == "/user/currency-withdraw-history" &&
                  "tradex-bg-primary !tradex-text-white"
                }`}
              >
                {t("Crypto To Fiat withdrawal History")}
              </a>
            </Link>
          )}
      </div>
    </div>
  );
}
