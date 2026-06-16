import useTranslation from "next-translate/useTranslation";
import React from "react";

export default function SupportTicketItemBadge({
  title,
  className = "tradex-bg-yellow-500",
}: any) {
  return (
    <span
      className={` tradex-float-end tradex-inline-block tradex-px-[7px] tradex-py-[3px] tradex-leading-[8px]  tradex-rounded-tr-lg tradex-rounded-tl-lg tradex-rounded-br-lg tradex-text-[8px] tradex-text-white ${className}`}
    >
      {title}
    </span>
  );
}
