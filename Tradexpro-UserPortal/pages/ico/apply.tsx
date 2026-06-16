import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SectionLoading from "components/common/SectionLoading";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import {
  FORM_CHECKBOX,
  FORM_FILE,
  FORM_INPUT_TEXT,
  FORM_RADIO,
  FORM_SELECT,
  FORM_TEXT_AREA,
} from "helpers/core-constants";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { MdOutlineFileUpload } from "react-icons/md";
import { customPage, landingPage } from "service/landing-page";
import {
  launchpadDynamicFromAction,
  launchpadDynamicFromSubmitAction,
} from "state/actions/launchpad";

const Apply = () => {
  const [loading, setLoading] = useState(true);
  const [launchpadForm, setLaunchpadForm] = useState<any>([]);
  const [formFields, setFormFields] = useState<any>([]);
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    launchpadDynamicFromAction(
      setLaunchpadForm,
      formFields,
      setFormFields,
      setLoading
    );
  }, []);

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            {loading ? (
              <SectionLoading />
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  launchpadDynamicFromSubmitAction(
                    formFields,
                    launchpadForm.dynamic_form
                  );
                }}
                className=" tradex-space-y-8"
              >
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className="tradex-space-y-5 tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <div className=" tradex-space-y-2">
                      <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                        {t(
                          `${
                            launchpadForm?.dynamic_form_for_ico_title === false
                              ? t("Apply For Launchpad")
                              : launchpadForm.dynamic_form_for_ico_title
                          }`
                        )}
                      </h4>
                      <div
                        onClick={() => {
                          router.back();
                        }}
                        className=" tradex-flex tradex-gap-1 tradex-items-center cursor-pointer tradex-text-base tradex-text-body"
                      >
                        <BiArrowBack />
                        {t("Back")}
                      </div>
                    </div>
                    <p className=" tradex-text-lg tradex-text-title">
                      {launchpadForm?.dynamic_form_for_ico_description === false
                        ? t(
                            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, "
                          )
                        : launchpadForm.dynamic_form_for_ico_description}
                    </p>
                  </div>
                  <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-2 tradex-gap-6">
                    {launchpadForm?.dynamic_form.map((item: any) =>
                      item.type === FORM_INPUT_TEXT ? (
                        <div className="tradex-space-y-2" key={item?.id}>
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {item?.title}
                          </label>
                          <input
                            type="text"
                            className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent"
                            id=""
                            required={item?.required === 1 ? true : false}
                            onChange={(e) => {
                              setFormFields({
                                ...formFields,
                                [item.id]: {
                                  value: e.target.value,
                                  form_id: item.id,
                                },
                              });
                            }}
                          />
                        </div>
                      ) : item.type === FORM_SELECT ? (
                        <div className="tradex-space-y-2" key={item?.id}>
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {item?.title}
                          </label>
                          <select
                            className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main"
                            name=""
                            id=""
                            required={item?.required === 1 ? true : false}
                            onChange={(e) => {
                              setFormFields({
                                ...formFields,
                                [item.id]: {
                                  value: e.target.value,
                                  form_id: item.id,
                                },
                              });
                            }}
                          >
                            <option value="">{t("Select one")}</option>

                            {item.optionList.map((select: any, index: any) => (
                              <option value={select} key={index}>
                                {select}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : item.type === FORM_RADIO ? (
                        <div className="tradex-space-y-2" key={item?.id}>
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {item?.title}
                          </label>
                          <div className="radio-item">
                            {item?.optionList?.map(
                              (radioItem: any, index: number) => (
                                <fieldset className="radio-inline" key={index}>
                                  <input
                                    className=""
                                    type="radio"
                                    name="radio"
                                    defaultChecked={index === 0}
                                    required={
                                      item?.required === 1 ? true : false
                                    }
                                    onClick={(e) => {
                                      setFormFields({
                                        ...formFields,
                                        [item.id]: {
                                          value: radioItem,
                                          form_id: item.id,
                                        },
                                      });
                                    }}
                                  />
                                  <span>{radioItem}</span>
                                </fieldset>
                              )
                            )}
                          </div>
                        </div>
                      ) : item.type === FORM_CHECKBOX ? (
                        <div className="tradex-space-y-2" key={item?.id}>
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {item?.title}
                          </label>
                          <div className="radio-item">
                            {item?.optionList?.map(
                              (CheckItem: any, index: number) => (
                                <div className="radio-inline" key={index}>
                                  <input
                                    className=""
                                    type="checkbox"
                                    required={
                                      formFields[item.id].value.length === 0 &&
                                      item.required === 1
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      let allChecked =
                                        formFields[item.id].value;
                                      if (e.target.checked === false) {
                                        allChecked = allChecked.filter(
                                          (mapItem: string) =>
                                            mapItem != CheckItem
                                        );
                                      } else {
                                        allChecked.push(CheckItem);
                                      }
                                      setFormFields({
                                        ...formFields,
                                        [item.id]: {
                                          value: allChecked,
                                          form_id: item.id,
                                        },
                                      });
                                    }}
                                  />
                                  <span>{CheckItem}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ) : item.type === FORM_FILE ? (
                        <>
                          <div className="tradex-space-y-2" key={item?.id}>
                            <label
                              className=" tradex-block tradex-w-full"
                              htmlFor="upload_image"
                            >
                              <div className=" tradex-flex tradex-gap-2.5 tradex-items-end tradex-w-full">
                                <div className=" tradex-space-y-2 tradex-w-full">
                                  <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                                    {t(item?.title)}
                                  </p>
                                  <div className=" tradex-p-2 tradex-min-h-[65px] tradex-w-full tradex-border tradex-border-dashed tradex-border-primary tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-gap-2">
                                    <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
                                      {formFields[item.id]?.value?.name ||
                                        t("Choose File")}
                                    </p>
                                    {!formFields[item.id]?.value?.name && (
                                      <MdOutlineFileUpload className=" tradex-text-primary" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </label>
                            <input
                              type="file"
                              id="upload_image"
                              className={` tradex-hidden`}
                              required={item?.required === 1 ? true : false}
                              onChange={(e: any) => {
                                setFormFields({
                                  ...formFields,
                                  [item.id]: {
                                    value: e.target.files[0],
                                    form_id: item.id,
                                  },
                                });
                              }}
                            />
                          </div>
                        </>
                      ) : item.type === FORM_TEXT_AREA ? (
                        <div className="tradex-space-y-2" key={item?.id}>
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {item?.title}
                          </label>
                          <textarea
                            className="tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent"
                            required
                            onChange={(e) => {
                              setFormFields({
                                ...formFields,
                                [item.id]: {
                                  value: e.target.value,
                                  form_id: item.id,
                                },
                              });
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </div>

                <button
                  className="primary-btn !tradex-text-white"
                  type="submit"
                >
                  {t("Apply Now")}
                </button>
              </form>
            )}
          </div>
        </section>
        <StartTrending />
        <BottomLeftInnerPageCircle />
        <BottomRigtInnerPageCircle />
      </div>

      <Footer />
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  await SSRAuthCheck(ctx, "/ico/apply");
  return {
    props: {},
  };
};

export default Apply;
