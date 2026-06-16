import React, { useRef, useState } from "react";
//@ts-ignore
import Persona from "persona";
import useTranslation from "next-translate/useTranslation";
import { ThirdPartyKycVerifiedAction } from "state/actions/user";
import { BsPersonBoundingBox } from "react-icons/bs";
import PhoneVerficationSvg from "components/icons/PhoneVerficationSvg";

const PersonaComponent = ({ personaDetails, setPersonaVerified }: any) => {
  const [options, setOptions] = useState({
    templateId: personaDetails?.PERSONA_KYC_TEMPLATED_ID,
  });
  const { t } = useTranslation("common");

  const embeddedClientRef = useRef(null);
  const createClient = () => {
    //@ts-ignore
    const client = new Persona.Client({
      ...options,
      environment: "sandbox",
      //@ts-ignore
      onLoad: (error) => {
        if (error) {
          console.error(
            `Failed with code: ${error.code} and message ${error.message}`
          );
        }

        client.open();
      },
      //@ts-ignore
      onStart: (inquiryId) => {},
      //@ts-ignore
      onComplete: (inquiryId) => {
        ThirdPartyKycVerifiedAction(
          String(inquiryId.inquiryId),
          setPersonaVerified
        );
      },
      //@ts-ignore
      onEvent: (name, meta) => {
        switch (name) {
          case "start":
            break;
          default:
        }
      },
    });
    //@ts-ignore
    embeddedClientRef.current = client;
    //@ts-ignore
    window.exit = (force) =>
      //@ts-ignore
      client ? client.exit(force) : alert("Initialize client first");
  };
  return (
    <>
      <div className=" tradex-grid tradex-grid-cols-5 tradex-items-center">
        <div className=" tradex-col-span-2">
          <div className="tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-4 tradex-bg-background-primary tradex-border tradex-border-background-primary tradex-px-4 tradex-py-8 tradex-rounded-lg">
            <p className=" tradex-text-2xl tradex-leading-[30px] tradex-text-title tradex-font-semibold">
              {t("Verify your identity")}
            </p>
            <button
              type="submit"
              className=" tradex-w-fit tradex-px-12 tradex-py-2.5 tradex-rounded-lg tradex-bg-primary tradex-text-sm tradex-leading-5 tradex-font-bold tradex-text-white"
              onClick={createClient}
            >
              {t("Start")}
            </button>
          </div>
        </div>
        <div className=" tradex-col-span-3">
          <PhoneVerficationSvg />
        </div>
      </div>
    </>
  );
};

export default PersonaComponent;
