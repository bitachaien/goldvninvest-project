import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

export default function P2PGiftCardSidebar() {
  const { t } = useTranslation("common");
  const navItems = [
    {
      name: t("P2P Home"),
      url: `/p2p`,
    },
    {
      name: t("Home"),
      url: `/p2p/gift-card`,
    },
    {
      name: t("Orders"),
      url: `/p2p/gift-card/ads/orders`,
    },
    {
      name: t("Gift Card Lists"),
      url: `/p2p/gift-card/lists`,
    },
    {
      name: t("My Gift Card Ads"),
      url: `/p2p/gift-card/my-adds`,
    },
  ];
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);
  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      <div className=" tradex-space-y-4">
        {navItems?.map((navItem: any, index: number) => (
          <Link href={navItem?.url} key={index}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == navItem?.url &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {navItem?.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
