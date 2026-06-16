import type { GetServerSideProps, NextPage } from "next";
import ProfileSidebar from "layout/profile-sidebar";
import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import countries from "lib/values/country.json";
import { useDispatch, useSelector } from "react-redux";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { RootState } from "state/store";
import { Formik, Field, Form } from "formik";
import { UpdateUserInfoByTokenAction } from "state/actions/user";
import useTranslation from "next-translate/useTranslation";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import { toast } from "react-toastify";
import ProfileHeader from "components/profile/ProfileHeader";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
const Edit: NextPage = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const uploadFile = (e: any) => {
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("File size must be less than 2MB"));
      return;
    }
    const formdata = new FormData();
    formdata.append("photo", file);
    formdata.append("first_name", user.first_name);
    formdata.append("last_name", user.last_name);
    formdata.append("nickname", user.nickname);
    formdata.append("email", user.email);
    formdata.append("country", user.country);
    formdata.append("gender", user.gender);
    formdata.append("phone", user.phone);
    dispatch(UpdateUserInfoByTokenAction(formdata));
  };
  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <UserProfileSidebar
                photo={user?.photo}
                first_name={user?.first_name}
                last_name={user?.last_name}
                email={user?.email}
                showUserInfo={true}
                uploadFile={uploadFile}
                isEditEnabled={true}
              />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {t("Edit Profile")}
                    </h2>
                  </div>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      first_name: user?.first_name,
                      last_name: user?.last_name,
                      nickname: user?.nickname,
                      country: user?.country,
                      gender: user?.gender,
                      phone: user?.phone,
                    }}
                    onSubmit={async (values) => {
                      dispatch(UpdateUserInfoByTokenAction(values));
                    }}
                  >
                    {({ setFieldValue }) => (
                      <Form className=" tradex-space-y-12">
                        <div className="tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label">
                              {t("First Name")}
                            </label>
                            <Field
                              type="text"
                              name="first_name"
                              className=" tradex-input-field"
                              placeholder={t("First Name")}
                              id="first_name"
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label">
                              {t("Last Name")}
                            </label>
                            <Field
                              type="text"
                              name="last_name"
                              className="tradex-input-field"
                              placeholder={t("Last Name")}
                              id="last_name"
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label">
                              {t("NickName")}
                            </label>
                            <Field
                              type="text"
                              name="nickname"
                              className="tradex-input-field"
                              placeholder={t("Nick Name")}
                              id="nickname"
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label">
                              {t("Phone")}
                            </label>

                            <PhoneInput
                              country={"us"}
                              value={user?.phone}
                              onChange={(phone) => {
                                setFieldValue("phone", phone);
                              }}
                              inputClass="tradex-input-field !tradex-pl-[50px]"
                              dropdownClass="!tradex-bg-background-primary"
                              buttonClass="!tradex-bg-background-primary hover:!tradex-bg-background-primary !tradex-border-background-primary"
                            />

                            <p className=" tradex-text-sm tradex-leading-5 tradex-text-body">
                              {t(
                                "Please add phone number with country phone code but not (+ sign.) Ex. for portugal 351*****"
                              )}
                            </p>
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label">
                              {t("Country")}
                            </label>
                            <div className="cp-select-area">
                              <Field
                                as="select"
                                name="country"
                                id="country"
                                className="tradex-input-field"
                              >
                                {countries.map((country: any) => (
                                  <option
                                    key={country.value}
                                    value={country.value.toUpperCase()}
                                    selected={country.value === user?.country}
                                  >
                                    {country.name}
                                  </option>
                                ))}
                              </Field>
                            </div>
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label">
                              {t("Gender")}
                            </label>
                            <div className="cp-select-area">
                              <Field
                                className="tradex-input-field"
                                name="gender"
                                id=""
                                as="select"
                              >
                                <option selected={user?.gender === 1} value={1}>
                                  {t("Male")}
                                </option>
                                <option selected={user?.gender === 2} value={2}>
                                  {t("Female")}
                                </option>
                                <option selected={user?.gender === 3} value={3}>
                                  {t("Others")}
                                </option>
                              </Field>
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className=" tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white"
                        >
                          <span className=" tradex-text-base tradex-font-semibold">
                            {t("Update Profile")}
                          </span>
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
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
  await SSRAuthCheck(ctx, "/user/edit-profile");
  return {
    props: {},
  };
};

export default Edit;
