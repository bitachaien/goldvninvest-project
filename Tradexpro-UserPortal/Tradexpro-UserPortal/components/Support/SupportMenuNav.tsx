import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const SupportMenuNav = ({ getDashbaordData }: any) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div className="container-4xl">
      <ul className="wallet-overview-tab-menu">
        {router.pathname == "/support" ? (
          <li
            className={router.pathname == "/support" ? "active" : ""}
            onClick={getDashbaordData}
          >
            <a>{t("Support Dashboard")}</a>
          </li>
        ) : (
          <Link href="/support">
            <li className={router.pathname == "/support" ? "active" : ""}>
              <a href="/support">{t("Support Dashboard")}</a>
            </li>
          </Link>
        )}

        <Link href="/support/ticket-create">
          <li
            className={
              router.pathname == "/support/ticket-create" ? "active" : ""
            }
          >
            <a href="/support/ticket-create">{t("Create Ticket")}</a>
          </li>
        </Link>
        <Link href="/knowledgebase">
          <li className={router.pathname == "/knowledgebase" ? "active" : ""}>
            <a href="/knowledgebase">{t("Knowledgebase")}</a>
          </li>
        </Link>
        <Link href="/exchange/dashboard">
          <li
            className={router.pathname == "/exchange/dashboard" ? "active" : ""}
          >
            <a href="/exchange/dashboard">{t("Exchange")}</a>
          </li>
        </Link>
        <Link href="/user/profile">
          <li className={router.pathname == "/user/profile" ? "active" : ""}>
            <a href="/user/profile">{t("Profile")}</a>
          </li>
        </Link>
        {/* user/profile */}
      </ul>
    </div>
  );
};

export default SupportMenuNav;
