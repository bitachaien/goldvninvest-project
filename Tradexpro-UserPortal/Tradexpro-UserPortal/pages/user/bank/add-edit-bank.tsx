import Footer from "components/common/footer";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { parseCookies } from "nookies";
import React, { useState } from "react";
import { customPage, landingPage } from "service/landing-page";
import { GetUserInfoByTokenServer } from "service/user";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  addEditBankDetailsAction,
  deleteBankAction,
} from "state/actions/fiat-deposit-withawal";
import { getBankList, getBankListSSr } from "service/deposit";
import { FaTrash } from "react-icons/fa";
import ProfileHeader from "components/profile/ProfileHeader";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import UserProfileSidebar from "components/profile/UserProfileSidebar";

const AddBank = ({ id, data }: any) => {
  const { t } = useTranslation("common");
  const [loading, setLoading]: any = useState<any>(false);
  const [deleteloading, setdeleteloading]: any = useState<any>(false);
  const router = useRouter();

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <UserProfileSidebar />
              <div className="lg:tradex-col-span-2 tradex-space-y-6">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                      {router.query.id ? t("Edit Bank") : t("Add New Bank")}
                    </h2>
                  </div>
                  <Formik
                    initialValues={{
                      id: id ? id : null,
                      account_holder_name: id ? data.account_holder_name : "",
                      account_holder_address: id
                        ? data.account_holder_address
                        : "",
                      bank_name: id ? data.account_holder_address : "",
                      bank_address: id ? data.bank_address : "",
                      country: id ? data.country : "",
                      swift_code: id ? data.swift_code : "",
                      iban: id ? data.iban : "",
                      note: id ? data.note : "",
                    }}
                    validationSchema={Yup.object({
                      account_holder_name: Yup.string().required(
                        t("Field is required")
                      ),
                      account_holder_address: Yup.string().required(
                        t("Field is required")
                      ),
                      bank_name: Yup.string().required(t("Field is required")),
                      bank_address: Yup.string().required(
                        t("Field is required")
                      ),
                      country: Yup.string().required(t("Field is required")),
                      swift_code: Yup.string().required(t("Field is required")),
                      iban: Yup.string().required(t("Field is required")),
                      // note: Yup.string().required(t("Field is required")),
                    })}
                    onSubmit={(values) => {
                      addEditBankDetailsAction(values, setLoading);
                    }}
                  >
                    {({ errors, touched, setFieldValue }) => (
                      <Form className=" tradex-space-y-12">
                        <div className="tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Acount Holder Name")}
                            </label>
                            <Field
                              type="text"
                              name="account_holder_name"
                              className={`tradex-input-field ${
                                touched.account_holder_name &&
                                errors.account_holder_name
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Account Holder Address")}
                            </label>
                            <Field
                              type="text"
                              name="account_holder_address"
                              className={`tradex-input-field ${
                                touched.account_holder_address &&
                                errors.account_holder_address
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Bank Name")}
                            </label>
                            <Field
                              type="text"
                              name="bank_name"
                              className={`tradex-input-field ${
                                touched.bank_name && errors.bank_name
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Bank Address")}
                            </label>
                            <Field
                              type="text"
                              name="bank_address"
                              className={`tradex-input-field ${
                                touched.bank_address && errors.bank_address
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Country")}
                            </label>
                            <Field
                              type="text"
                              name="country"
                              className={`tradex-input-field ${
                                touched.country && errors.country
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Swift Code")}
                            </label>
                            <Field
                              type="text"
                              name="swift_code"
                              className={`tradex-input-field ${
                                touched.swift_code && errors.swift_code
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("IBAN")}
                            </label>
                            <Field
                              type="text"
                              name="iban"
                              className={`tradex-input-field ${
                                touched.iban && errors.iban
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label className="tradex-input-label" htmlFor="">
                              {t("Note")}
                            </label>
                            <Field
                              type="text"
                              name="note"
                              className={`tradex-input-field ${
                                touched.note && errors.note
                                  ? "!tradex-border !tradex-border-red-500 !tradex-border-solid"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div className=" tradex-flex tradex-gap-6 tradex-items-center">
                          <button
                            type="submit"
                            className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white tradex-text-base tradex-font-semibold"
                          >
                            {loading
                              ? t("Submitting..")
                              : id
                              ? t("Edit Bank")
                              : t("Create Bank")}
                          </button>
                          {id && (
                            <button
                              type="button"
                              className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-red-500 tradex-text-white tradex-text-base tradex-font-semibold"
                              onClick={() =>
                                deleteBankAction(setdeleteloading, id)
                              }
                            >
                              {deleteloading
                                ? t("Submitting..")
                                : t("Delete Bank")}
                            </button>
                          )}
                        </div>
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
  await SSRAuthCheck(ctx, "/user/profile");
  const cookies = parseCookies(ctx);

  const { id } = ctx.query;
  let listRes;
  if (id) {
    listRes = await getBankListSSr(id, cookies.token);
  }

  return {
    props: {
      id: id ? id : null,
      data: id ? listRes.data : null,
    },
  };
};
export default AddBank;
