import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const FiatMenuNav = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className="tradex-border tradex-space-y-4 sm:tradex-space-y-0 sm:tradex-flex tradex-w-full sm:tradex-w-fit tradex-rounded-md tradex-shadow-sm tradex-bg-background-primary tradex-border-primary-30 tradex-px-3 tradex-py-2.5 tradex-gap-4">
        <Link href="/fiat-deposit">
          <li
            className={`${
              router.pathname == "/fiat-deposit" ? " tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a href="/fiat-deposit" className="!tradex-text-white !tradex-text-sm">{t("Fiat To Crypto Deposit")}</a>
          </li>
        </Link>
        <Link href="/fiat-withdrawal">
          <li
            className={`${
              router.pathname == "/fiat-withdrawal" ? " tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a href="/fiat-withdrawal" className="!tradex-text-white !tradex-text-sm">{t("Crypto To Fiat Withdrawal")}</a>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default FiatMenuNav;
