import StartTrending from "components/StartTrending";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const StartTradingNow = ({ landing, loggedin }: any) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { theme } = useSelector((state: RootState) => state.common);

  return (
    <div>
      {parseInt(landing?.landing_seventh_section_status) === 1 && (
        <StartTrending />
      )}
    </div>
  );
};

export default StartTradingNow;
