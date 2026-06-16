import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function P2PSidebar() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const profileTabs = [
    {
      name: t("Home"),
      url: `/p2p`,
    },
    {
      name: t("Orders"),
      url: `/p2p/my-order`,
    },
    {
      name: t("P2P User Center"),
      url: `/p2p/p2p-profile`,
    },
    {
      name: t("P2P Wallet"),
      url: `/p2p/p2p-wallet`,
    },
    {
      name: t("Gift Card"),
      url: `/p2p/gift-card`,
    },
    {
      name: t("Ad Create"),
      url: `/p2p/add-post`,
    },
    {
      name: t("My Buy Ads"),
      url: `/p2p/my-buy-ads`,
    },
    {
      name: t("My Sell Ads"),
      url: `/p2p/my-sell-ads`,
    },
  ];
  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      <div className=" tradex-space-y-4">
        {profileTabs.map((profileTab: any, index: number) => (
          <Link href={profileTab?.url} key={index}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == profileTab?.url &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {profileTab?.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
