import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function SupportLeftSidebar() {
  const { t } = useTranslation("common");
  const profileTabs = [
    {
      name: t("Support Dashboard"),
      url: `/support`,
    },
    {
      name: t("Create Ticket"),
      url: `/support/ticket-create`,
    },
    {
      name: t("Knowledgebase"),
      url: `/knowledgebase`,
    },
    {
      name: t("Exchange"),
      url: `/exchange/dashboard`,
    },
    {
      name: t("Profile"),
      url: `/user/profile`,
    },
  ];
  const router = useRouter();
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
