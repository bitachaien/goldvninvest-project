import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
const profileTabs = [
  {
    name: "My Profile",
    url: `/user/profile`,
  },
  {
    name: "Edit Profile",
    url: `/user/edit-profile`,
  },
  {
    name: "Phone Verification",
    url: `/user/phone-verification`,
  },
  {
    name: "Security",
    url: `/user/security`,
  },
  {
    name: "KYC Verification",
    url: `/user/personal-verification`,
  },
  {
    name: "Bank List",
    url: `/user/bank/list`,
  },
  {
    name: "Change Password",
    url: `/user/change-password`,
  },
];
export default function UserProfileSidebar({
  photo,
  first_name,
  last_name,
  email,
  showUserInfo = false,
  uploadFile = null,
  isEditEnabled = false,
}: any) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { settings } = useSelector((state: RootState) => state.common);

  return (
    <div className=" tradex-h-fit tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-12 tradex-pb-6 tradex-space-y-8">
      {showUserInfo && (
        <div className=" tradex-flex tradex-flex-col tradex-justify-center tradex-items-center tradex-gap-6 ">
          <div className=" tradex-min-w-[140px] tradex-relative">
            <img
              src={photo}
              className=" tradex-w-[140px] tradex-h-[140px] tradex-max-w-[140px] tradex-max-h-[140px] tradex-object-cover tradex-object-center tradex-rounded-full tradex-border-solid tradex-border-[3px] tradex-border-primary"
              alt=""
            />
            {!isEditEnabled ? (
              <div className=" tradex-w-6 tradex-h-6 tradex-border-2 tradex-border-white tradex-bg-primary tradex-rounded-full tradex-absolute tradex-right-0 tradex-bottom-[15px]"></div>
            ) : (
              <div className=" tradex-cursor-pointer tradex-absolute tradex-right-0 tradex-bottom-[15px] tradex-max-h-7">
                <input
                  type="file"
                  name="file"
                  id="upload-user-img"
                  onChange={(e) => uploadFile(e)}
                  hidden
                />
                <label
                  htmlFor="upload-user-img"
                  className="tradex-cursor-pointer"
                >
                  <img src="/active_user_icon.png" alt="" />
                </label>
              </div>
            )}
          </div>
          <div className=" tradex-space-y-1 tradex-text-center">
            <h3 className=" tradex-text-[32px] !tradex-text-title tradex-leading-[38px] tradex-font-bold">
              {first_name + " " + last_name}
            </h3>
            <p className=" tradex-text-xl !tradex-text-title tradex-leading-6">
              {email}
            </p>
          </div>
        </div>
      )}
      <div className=" tradex-space-y-4">
        {profileTabs.map((profileTab: any, index: number) => (
          <Link href={profileTab?.url} key={index}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary !tradex-text-title tradex-text-xl tradex-leading-6 ${
                router.pathname == profileTab?.url &&
                "tradex-bg-primary !tradex-text-white"
              }`}
            >
              {t(profileTab?.name)}
            </a>
          </Link>
        ))}

        {parseInt(settings?.knowledgebase_support_module) === 1 && (
          <Link href={`/support`}>
            <a
              className={` tradex-inline-block tradex-w-full tradex-py-3 tradex-px-2.5 tradex-rounded tradex-bg-background-primary tradex-text-title tradex-text-xl tradex-leading-6`}
            >
              {t("Support")}
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
