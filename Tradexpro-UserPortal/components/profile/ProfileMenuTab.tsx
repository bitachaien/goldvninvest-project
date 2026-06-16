import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { MdDashboardCustomize, MdPassword } from "react-icons/md";
import { FaPeopleArrows } from "react-icons/fa";

import { BiSupport, BiShapeCircle } from "react-icons/bi";

import { useRouter } from "next/router";
import { RootState } from "state/store";
import { useSelector } from "react-redux";
const ProfileMenuTab = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className="container-4xl">
      <ul className=" tradex-flex tradex-w-fit tradex-items-center tradex-flex-wrap tradex-border tradex-rounded-md tradex-shadow-sm tradex-bg-background-primary tradex-border-primary-30 tradex-px-3 tradex-py-2.5 tradex-gap-4">
        <Link href="/user/profile">
          <li
            className={`${
              router.pathname == "/user/profile" ? "!tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/profile"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("My Profile")}
            </a>
          </li>
        </Link>
        <Link href="/user/edit-profile">
          <li
            className={`${
              router.pathname == "/user/edit-profile"
                ? "!tradex-bg-primary"
                : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/edit-profile"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("Edit Profile")}
            </a>
          </li>
        </Link>
        <Link href="/user/phone-verification">
          <li
            className={`${
              router.pathname == "/user/phone-verification"
                ? "!tradex-bg-primary"
                : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/phone-verification"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("Phone Verification")}
            </a>
          </li>
        </Link>
        <Link href="/user/security">
          <li
            className={`${
              router.pathname == "/user/security" ? "!tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/security-setting"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("Security")}
            </a>
          </li>
        </Link>
        <Link href="/user/personal-verification">
          <li
            className={`${
              router.pathname == "/user/personal-verification" ? "!tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/profile-verification-list"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("KYC Verification")}
            </a>
          </li>
        </Link>

        <Link href="/user/bank/list">
          <li
            className={`${
              router.pathname == "/user/bank/list" ? "!tradex-bg-primary" : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/bank/list"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("Bank List")}
            </a>
          </li>
        </Link>

        <Link href="/user/change-password">
          <li
            className={`${
              router.pathname == "/user/change-password"
                ? "!tradex-bg-primary"
                : ""
            } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
          >
            <a
              href="/user/change-password"
              className="!tradex-text-white !tradex-text-sm"
            >
              {t("Change Password")}
            </a>
          </li>
        </Link>
        {parseInt(settings.knowledgebase_support_module) === 1 && (
          <Link href="/support">
            <li
              className={`${
                router.pathname == "/support" ? "!tradex-bg-primary" : ""
              } tradex-border tradex-rounded-md tradex-border-primary-30 tradex-px-3 tradex-py-1.5`}
            >
              <a href="/support" className="!tradex-text-white !tradex-text-sm">
                {t("Support")}
              </a>
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default ProfileMenuTab;
