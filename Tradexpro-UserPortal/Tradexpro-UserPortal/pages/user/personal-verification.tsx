import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import NidModal from "components/profile/personal-verification/NidModal";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getKycDetailsAction } from "state/actions/user";
import useTranslation from "next-translate/useTranslation";
import { MdPersonAddDisabled } from "react-icons/md";
import { BsPersonCheck } from "react-icons/bs";
import { KycActiveList } from "service/user";
import {
  KYC_DRIVING_VERIFICATION,
  KYC_EMAIL_VERIFICATION,
  KYC_NID_VERIFICATION,
  KYC_PASSPORT_VERIFICATION,
  KYC_PHONE_VERIFICATION,
  KYC_TYPE_DISABLE,
  KYC_TYPE_MANUAL,
  KYC_TYPE_PERSONA,
  KYC_VOTERS_CARD_VERIFICATION,
} from "helpers/core-constants";
import Footer from "components/common/footer";
import ImageComponent from "components/common/ImageComponent";
import SectionLoading from "components/common/SectionLoading";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import PhoneVerifyCheckSvg from "components/icons/PhoneVerifyCheckSvg";
import KycVerifySuccessSvg from "components/icons/KycVerifySuccessSvg";
import PhoneVerficationSvg from "components/icons/PhoneVerficationSvg";
import DisabledIcon from "components/icons/DisabledIcon";
import KycDisabledSvg from "components/icons/KycDisabledSvg";

const Persona = dynamic(
  () => import("components/profile/personal-verification/Persoona"),
  { ssr: false }
);
const PersonalVerification: NextPage = () => {
  const { t } = useTranslation("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personaVerified, setPersonaVerified] = useState(false);
  const [type, setType] = useState<string>("");
  const [verificationType, setVerificationType] = useState<number>();
  const [kycDetails, setKycDetails] = useState<any>();
  const [kycActiveList, setKycActiveList] = useState<any>([]);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getKycDetailsAction(
        setKycDetails,
        setKycActiveList,
        setLoading,
        setVerificationType,
        setPersonaVerified
      )
    );
  }, []);

  useEffect(() => {
    if (!isUploadSuccess) return;
    dispatch(
      getKycDetailsAction(
        setKycDetails,
        setKycActiveList,
        setLoading,
        setVerificationType,
        setPersonaVerified
      )
    );
  }, [isUploadSuccess]);

  const getStatusColor = (status: string) => {
    if (status == "Pending") {
      return `tradex-bg-yellow-500`;
    }
    if (status == "Approved") {
      return `tradex-bg-green-500`;
    }
    return `tradex-bg-red-500`;
  };

  console.log("kycActiveList", kycActiveList, kycDetails);

  return (
    <>
      <div className="tradex-relative">
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <UserProfileSidebar showUserInfo={false} />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className=" tradex-h-full tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-6">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Personal Verification")}
                    </h2>
                    {verificationType === KYC_TYPE_MANUAL && (
                      <p className=" tradex-text-xl tradex-leading-6 tradex-text-title tradex-font-medium">
                        {t("Select Your ID Type")}
                      </p>
                    )}
                  </div>
                  {verificationType === KYC_TYPE_MANUAL && (
                    <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
                      {kycActiveList?.map(
                        (item: any, index: number) =>
                          item.type != KYC_PHONE_VERIFICATION &&
                          item.type != KYC_EMAIL_VERIFICATION && (
                            <div
                              key={index}
                              className=" tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-cursor-pointer"
                              onClick={() => {
                                {
                                  item.type == KYC_PASSPORT_VERIFICATION &&
                                    kycDetails?.passport?.status;
                                  setType("passport");
                                }
                                {
                                  item.type == KYC_DRIVING_VERIFICATION &&
                                    setType("driving");
                                }
                                {
                                  item.type == KYC_NID_VERIFICATION &&
                                    setType("nid");
                                }
                                {
                                  item.type == KYC_VOTERS_CARD_VERIFICATION &&
                                    setType("voter");
                                }
                                setIsModalOpen(true);
                              }}
                            >
                              <p
                                className={`
                                ${
                                  item.type == KYC_PASSPORT_VERIFICATION &&
                                  getStatusColor(kycDetails?.passport?.status)
                                }
                                ${
                                  item.type == KYC_DRIVING_VERIFICATION &&
                                  getStatusColor(kycDetails?.driving?.status)
                                }
                                ${
                                  item.type == KYC_NID_VERIFICATION &&
                                  getStatusColor(kycDetails?.nid?.status)
                                }
                                ${
                                  item.type == KYC_VOTERS_CARD_VERIFICATION &&
                                  getStatusColor(kycDetails?.voter?.status)
                                }
                                
                                tradex-mb-3 tradex-h-[25px] tradex-flex tradex-items-center tradex-justify-center tradex-w-fit tradex-text-white tradex-p-2 tradex-rounded-tl-lg tradex-rounded-br-lg`}
                              >
                                {item.type == KYC_PASSPORT_VERIFICATION &&
                                  kycDetails?.passport?.status}
                                {item.type == KYC_DRIVING_VERIFICATION &&
                                  kycDetails?.driving?.status}
                                {item.type == KYC_NID_VERIFICATION &&
                                  kycDetails?.nid?.status}
                                {item.type == KYC_VOTERS_CARD_VERIFICATION &&
                                  kycDetails?.voter?.status}
                              </p>
                              <div className=" tradex-px-7 tradex-pb-6 tradex-border-b tradex-border-background-primary">
                                <img
                                  src={
                                    item.image || "/personal_verify_default.png"
                                  }
                                  className=" tradex-max-h-[125px] tradex-object-cover tradex-object-center tradex-w-full tradex-rounded-lg"
                                  alt=""
                                />
                              </div>
                              <p className=" tradex-py-2 tradex-text-center tradex-text-title tradex-text-lg tradex-leading-[22px] tradex-font-medium">
                                {item.name}
                              </p>
                            </div>
                          )
                      )}
                    </div>
                  )}
                  {verificationType === KYC_TYPE_PERSONA && (
                    <>
                      {!personaVerified &&
                        kycDetails?.perona_credentials_details && (
                          <Persona
                            personaDetails={
                              kycDetails?.perona_credentials_details
                            }
                            setPersonaVerified={setPersonaVerified}
                          />
                        )}
                      {personaVerified && (
                        <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6 tradex-items-center">
                          <div className="tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-4 tradex-bg-background-primary tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-4 tradex-pb-8 tradex-rounded-lg">
                            <PhoneVerifyCheckSvg />
                            <div className=" tradex-space-y-2 tradex-text-center">
                              <p className=" tradex-text-2xl tradex-leading-[30px] tradex-text-title tradex-font-semibold">
                                {t("Kyc Verified Successfully")}
                              </p>
                            </div>
                          </div>

                          <KycVerifySuccessSvg />
                        </div>
                      )}
                    </>
                  )}
                  {verificationType === KYC_TYPE_DISABLE && (
                    <div className=" tradex-grid md:tradex-grid-cols-5 tradex-items-center">
                      <div className=" md:tradex-col-span-2">
                        <div className="tradex-flex tradex-flex-col tradex-items-center tradex-justify-center tradex-gap-y-4 tradex-bg-background-primary tradex-border tradex-border-background-primary tradex-px-4 tradex-pt-4 tradex-pb-8 tradex-rounded-lg">
                          <DisabledIcon />
                          <div className=" tradex-space-y-2 tradex-text-center">
                            <p className=" tradex-text-2xl tradex-leading-[30px] tradex-text-title tradex-font-semibold">
                              {t("Kyc disabled")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className=" md:tradex-col-span-3">
                        <KycDisabledSvg />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      {verificationType === KYC_TYPE_MANUAL && isModalOpen && (
        <NidModal
          type={type}
          kycDetails={kycDetails}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          setIsUploadSuccess={setIsUploadSuccess}
        />
      )}
      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/user/personal-verification");
  return {
    props: {},
  };
};

export default PersonalVerification;
