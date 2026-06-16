import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const StakingHeaderMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div className="container-4xl">
      <ul className=" tradex-flex tradex-w-fit tradex-flex-wrap tradex-border tradex-rounded-md tradex-shadow-sm tradex-bg-background-primary tradex-border-primary-30 tradex-px-3 tradex-py-2.5  tradex-gap-4">
        <li
          className={`${
            router.asPath === "/staking" ? "!tradex-bg-primary" : ""
          } tradex-border tradex-rounded-md tradex-border-primary-30`}
        >
          <Link href="/staking">
            <a className="!tradex-text-white !tradex-text-sm tradex-px-3 tradex-py-1.5 tradex-inline-block">
              {t("Home")}
            </a>
          </Link>
        </li>
        <li
          className={`${
            router.asPath === "/staking/earnings" ? "!tradex-bg-primary" : ""
          } tradex-border tradex-rounded-md tradex-border-primary-30`}
        >
          <Link href="/staking/earnings">
            <a className="!tradex-text-white !tradex-text-sm tradex-px-3 tradex-py-1.5 tradex-inline-block">
              {t("Reports")}
            </a>
          </Link>
        </li>
        <li
          className={`${
            router.asPath === "/staking/my-investments"
              ? "!tradex-bg-primary"
              : ""
          } tradex-border tradex-rounded-md tradex-border-primary-30`}
        >
          <Link href="/staking/my-investments">
            <a className="!tradex-text-white !tradex-text-sm tradex-px-3 tradex-py-1.5 tradex-inline-block">
              {t("My Investments")}
            </a>
          </Link>
        </li>
        <li
          className={`${
            router.asPath === "/staking/payment-list"
              ? "!tradex-bg-primary"
              : ""
          } tradex-border tradex-rounded-md tradex-border-primary-30`}
        >
          <Link href="/staking/payment-list">
            <a className="!tradex-text-white !tradex-text-sm tradex-px-3 tradex-py-1.5 tradex-inline-block">
              {t("My Earnings")}
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StakingHeaderMenuTab;
