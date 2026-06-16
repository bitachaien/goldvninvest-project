import { RiPagesLine } from "react-icons/ri";
import { HiOutlineHome, HiUsers } from "react-icons/hi";
import Link from "next/link";
import { MdPayment } from "react-icons/md";
import useTranslation from "next-translate/useTranslation";
export const StakingTopBar = () => {
  const { t } = useTranslation("common");

  return (
    <div className="p2p_top_bg py-3">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className="d-flex justify-content-center justify-content-md-end topBarList staking-topbar-list">
              <li>
                <Link href="/staking">
                  <a>
                    <HiOutlineHome />
                    {t("Home")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/staking/earnings">
                  <a>
                    <RiPagesLine />
                    {t("Reports")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/staking/my-investments">
                  <a>
                    <HiUsers />
                    {t("My Investments")}
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/staking/payment-list">
                  <a>
                    <MdPayment />
                    {t("My Earnings")}
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
