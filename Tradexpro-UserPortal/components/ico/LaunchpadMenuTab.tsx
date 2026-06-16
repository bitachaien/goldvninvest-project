import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const LaunchpadMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className="wallet-overview-tab-menu">
        <Link href="/ico/applied-launchpad">
          <li
            className={
              router.pathname == "/ico/applied-launchpad" ? "active" : ""
            }
          >
            <a href="/ico/applied-launchpad">{t("Applied launchpad")}</a>
          </li>
        </Link>
        <Link href="/ico/ico-tokens">
          <li className={router.pathname == "/ico/ico-tokens" ? "active" : ""}>
            <a href="/ico/ico-phase">{t("Ico Tokens")}</a>
          </li>
        </Link>
        <Link href="/ico/token-buy-history">
          <li
            className={
              router.pathname == "/ico/token-buy-history" ? "active" : ""
            }
          >
            <a href="/ico/ico-phase">{t("Token Buy History")}</a>
          </li>
        </Link>
        <Link href="/ico/token-wallet">
          <li
            className={router.pathname == "/ico/token-wallet" ? "active" : ""}
          >
            <a href="/ico/ico-phase">{t("Token Wallet")}</a>
          </li>
        </Link>
        <Link href="/ico/withdraw">
          <li className={router.pathname == "/ico/withdraw" ? "active" : ""}>
            <a href="/ico/ico-phase">{t("Withdraw")}</a>
          </li>
        </Link>
        <Link href="/ico/withdraw-lists">
          <li
            className={router.pathname == "/ico/withdraw-lists" ? "active" : ""}
          >
            <a href="/ico/ico-phase">{t("Withdraw Lists")}</a>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default LaunchpadMenuTab;
