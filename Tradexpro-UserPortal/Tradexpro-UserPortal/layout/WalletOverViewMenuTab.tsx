import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";

const WalletOverViewMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className=" tradex-flex tradex-flex-wrap tradex-w-fit tradex-border tradex-rounded-md tradex-shadow-sm tradex-bg-black tradex-border-primary-30 tradex-px-3 tradex-py-2.5 tradex-gap-4">
        <Link href="/wallet-overview">
          <li
            className={`${
              router.pathname == "/wallet-overview" ? "!tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer`}
          >
            <a className="!tradex-text-white !tradex-text-sm">
              {t("Overview")}
            </a>
          </li>
        </Link>
        <Link href="/user/my-wallet">
          <li
            className={`${
              router.pathname == "/user/my-wallet" ? "!tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer`}
          >
            <a className="!tradex-text-white !tradex-text-sm">{t("Spot")}</a>
          </li>
        </Link>
        {Number(settings?.enable_future_trade) === 1 && (
          <Link href="/futures/wallet-list">
            <li
              className={`${
                router.pathname == "/futures/wallet-list"
                  ? "!tradex-bg-primary"
                  : ""
              } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer`}
            >
              <a className="!tradex-text-white !tradex-text-sm">
                {t("Futures")}
              </a>
            </li>
          </Link>
        )}

        {parseInt(settings.p2p_module) === 1 && (
          <Link href="/p2p/p2p-wallet">
            <li
              className={`${
                router.pathname == "/p2p/p2p-wallet" ? "!tradex-bg-primary" : ""
              } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer`}
            >
              <a className="!tradex-text-white !tradex-text-sm">{t("P2P")}</a>
            </li>
          </Link>
        )}
        <Link href={`/user/check-deposit`}>
          <li className="tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer">
            <a className="!tradex-text-white !tradex-text-sm">Check Deposit</a>
          </li>
        </Link>
        <Link href={`/user/wallet-history?type=deposit`}>
          <li className="tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer">
            <a className="!tradex-text-white !tradex-text-sm">
              Deposit History
            </a>
          </li>
        </Link>
        <Link href={`/user/wallet-history?type=withdrawal`}>
          <li className="tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer">
            <a className="!tradex-text-white !tradex-text-sm">
              Withdrawal History
            </a>
          </li>
        </Link>
        <Link href={`/user/transaction-history`}>
          <li className="tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5 tradex-cursor-pointer">
            <a className="!tradex-text-white !tradex-text-sm">
              Transaction History
            </a>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default WalletOverViewMenuTab;
