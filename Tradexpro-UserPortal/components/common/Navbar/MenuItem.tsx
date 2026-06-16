import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function MenuItem({ title, icon, href }: any) {
  const router = useRouter();
  return (
    <Link href={href}>
      <li className={router.pathname == href ? "cp-user-active-page" : ""}>
        <a href="" className="menu-hover">
          <span className="cp-user-icon">{icon}</span>
          <span>{title}</span>
        </a>
      </li>
    </Link>
  );
}
