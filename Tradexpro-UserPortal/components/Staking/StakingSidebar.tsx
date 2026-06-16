import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
const profileTabs = [
  {
    name: "Home",
    url: `/staking`,
  },
  {
    name: "Reports",
    url: `/staking/earnings`,
  },
  {
    name: "My Investments",
    url: `/staking/my-investments`,
  },
  {
    name: "My Earnings",
    url: `/staking/payment-list`,
  },
];
export default function StakingSidebar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);
  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      <div className=" tradex-space-y-4">
        {profileTabs?.map((tab: any, index: any) => (
          <Link href={tab.url} key={index}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == tab.url &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {t(tab?.name)}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
