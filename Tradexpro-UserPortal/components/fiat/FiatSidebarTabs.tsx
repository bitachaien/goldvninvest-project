import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
const fiatTabs = [
  {
    name: "Fiat To Crypto Deposit",
    url: `/fiat-deposit`,
  },
  {
    name: "Crypto To Fiat Withdrawal",
    url: `/fiat-withdrawal`,
  },
];
export default function FiatSidebarTabs() {
  const { t } = useTranslation("common");
  const router = useRouter();
  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      <div className=" tradex-space-y-4">
        {fiatTabs.map((tab: any, index: number) => (
          <Link href={tab?.url} key={index}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == tab?.url &&
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
