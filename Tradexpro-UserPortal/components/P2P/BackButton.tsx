import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React from "react";
import { BiArrowBack } from "react-icons/bi";

const BackButton = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <div>
      <div
        onClick={() => {
          router.back();
        }}
        className="cursor-pointer"
      >
        <BiArrowBack />
        {t("Back")}
      </div>
    </div>
  );
};

export default BackButton;
