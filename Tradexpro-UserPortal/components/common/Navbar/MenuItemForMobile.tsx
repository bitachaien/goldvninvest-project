import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
export default function MenuItemForMobile({
  title,
  href,
  onClickHandler,
}: any) {
  const router = useRouter();

  return (
    <Link href={href}>
      <li className={router.pathname == href ? "active-navbar" : ""}>
        <a
          href=""
          className="px-3 py-2 text-primary-color-two"
          onClick={onClickHandler}
        >
          <span>{title}</span>
        </a>
      </li>
    </Link>
  );
}
