import { RiPagesLine } from "react-icons/ri";
import { HiOutlineHome, HiUsers } from "react-icons/hi";
import Link from "next/link";
import { AiOutlineGift, AiOutlineWallet } from "react-icons/ai";
import { GrHomeRounded } from "react-icons/gr";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
export const P2pTopBar = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  return (
    <div className="py-3">
      <div className="container-4xl">
        <div className="row">
          <div className="col-12">
            <ul className="topBarList p2p-top-bar-root-cls">
              <div className="p2p-top-bar-item-cls">
                <li>
                  <Link href="/p2p">
                    <a
                      className={`${
                        router.pathname == "/p2p" && "text-primary-color"
                      } `}
                    >
                      <HiOutlineHome />
                      {t("Home")}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/p2p/my-order">
                    <a
                      className={`${
                        router.pathname == "/p2p/my-order" &&
                        "text-primary-color"
                      } `}
                    >
                      <RiPagesLine />
                      {t("Orders")}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/p2p/p2p-profile">
                    <a
                      className={`${
                        router.pathname == "/p2p/p2p-profile" &&
                        "text-primary-color"
                      } `}
                    >
                      <HiUsers />
                      {t("P2P User Center")}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/p2p/p2p-wallet">
                    <a
                      className={`${
                        router.pathname == "/p2p/p2p-wallet" &&
                        "text-primary-color"
                      } `}
                    >
                      <AiOutlineWallet />
                      {t("P2P Wallet")}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/p2p/gift-card">
                    <a
                      className={`${
                        router.pathname == "/p2p/gift-card" &&
                        "text-primary-color"
                      } `}
                    >
                      <AiOutlineGift />
                      {t("Gift Card")}
                    </a>
                  </Link>
                </li>
              </div>
              <li className="position-relative">
                <a
                  href=""
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  {t("More")}
                </a>
                <div className="dropdown-menu secendary-dropdown-bg">
                  <Link href="/p2p/add-post">
                    <a className="dropdown-item menu-hover">{t("Ad Create")}</a>
                  </Link>
                  <Link href="/p2p/my-buy-ads">
                    <a className="dropdown-item menu-hover">
                      {t("My Buy Ads")}
                    </a>
                  </Link>
                  <Link href="/p2p/my-sell-ads">
                    <a className="dropdown-item menu-hover">
                      {t("My Sell Ads")}
                    </a>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
