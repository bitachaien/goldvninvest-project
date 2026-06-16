import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { launchpadCreateUpdateTokenAction } from "state/actions/launchpad";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { useRouter } from "next/router";
import { getContractAddressDetails, icoListDetails } from "service/launchpad";
import { toast } from "react-toastify";
import Footer from "components/common/footer";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import { MdOutlineFileUpload } from "react-icons/md";

const TokenCreate = ({ id, edit, data }: any) => {
  const { t } = useTranslation("common");

  const [image, setImage]: any = useState<any>();
  const [loading, setLoading]: any = useState<any>(false);
  const [warning, setWarning] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-12 tradex-gap-6">
              <div className="lg:tradex-col-span-3">
                <LaunchpadSidebar />
              </div>
              <div className=" lg:tradex-col-span-9">
                <Formik
                  initialValues={{
                    id: edit ? data?.ico_phase_token?.id : "",
                    form_id: edit ? data?.ico_phase_token?.form_id : id,
                    // base_coin: edit ? data?.ico_phase_token?.base_coin : "",
                    token_name: edit ? data?.ico_phase_token?.token_name : "",
                    network_id: edit ? data?.ico_phase_token?.network_id : "",
                    wallet_address: edit
                      ? data?.ico_phase_token?.wallet_address
                      : "",
                    contract_address: edit
                      ? data?.ico_phase_token?.contract_address
                      : "",
                    wallet_private_key: edit
                      ? data?.ico_phase_token?.wallet_private_key
                      : "",
                    chain_id: edit ? data?.ico_phase_token?.chain_id : "",
                    image: "",
                    chain_link: edit ? data?.ico_phase_token?.chain_link : "",
                    decimal: edit ? data?.ico_phase_token?.decimal : "",
                    gas_limit: edit ? data?.ico_phase_token?.gas_limit : 430000,
                    details_rule: edit
                      ? data?.ico_phase_token?.details_rule
                      : "",
                    website_link: edit
                      ? data?.ico_phase_token?.website_link
                      : "",
                    token_symbol: edit ? data?.ico_phase_token?.coin_type : "",
                  }}
                  validationSchema={Yup.object({
                    // form_id: Yup.number().required(
                    //   t("ICO Submit Form ID is required")
                    // ),
                    // base_coin: Yup.string().required(t("Base Coin is required")),
                    // token_name: Yup.string().required(t("Token Name is required")),
                    // network: Yup.string().required(t("Network is required")),
                    // wallet_address: Yup.string().required(
                    //   t("Wallet Address is required")
                    // ),
                    // contract_address: Yup.string().required(
                    //   t("Contract Address is required")
                    // ),
                    // wallet_private_key: Yup.string().required(
                    //   t("Wallet Private Key is required")
                    // ),
                    // chain_id: Yup.string().required(t("Chain ID is required")),
                    // chain_link: Yup.string().required(t("Chain Link is required")),
                    // decimal: Yup.number().required(t("Decimal is required")),
                    // gas_limit: Yup.number().required(t("Gas Limit is required")),
                  })}
                  onSubmit={(values) => {
                    launchpadCreateUpdateTokenAction(values, setLoading, image);
                  }}
                >
                  {({ errors, touched, setFieldValue, values }) => (
                    <Form className=" tradex-space-y-8">
                      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                        <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                          {t(
                            `${
                              router.query.edit === "true" ? "Edit" : "Add New"
                            }  ICO Token`
                          )}
                        </h4>
                        <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                          {" "}
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Network")}
                            </label>
                            <Field
                              as="select"
                              name="network_id"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main ${
                                touched.network_id && errors.network_id
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onChange={(e: any) => {
                                setFieldValue("network_id", e.target.value);
                              }}
                            >
                              <option value="">
                                {t("Select Your Network")}
                              </option>
                              {data?.networks?.map((network: any) => (
                                <option value={network?.id} key={network?.id}>
                                  {network?.name}
                                </option>
                              ))}
                            </Field>
                          </div>
                          {/* <div className="">
                    <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold" htmlFor="">
                      {t(" Base Coin")}
                    </label>
                    <Field
                      as="select"
                      name="base_coin"
                      disabled
                      className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                        touched.base_coin && errors.base_coin
                          ? "is-invalid"
                          : ""
                      }`}
                    >
                      <option value="">{t("Select A Network")}</option>
                      <option value="BNB">{t("BNB")}</option>
                      <option value="ETH">{t("ETH")}</option>
                    </Field>
                  </div> */}
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Chain Link")}
                            </label>
                            <Field
                              type="text"
                              name="chain_link"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.chain_link && errors.chain_link
                                  ? "is-invalid"
                                  : ""
                              }`}
                              onBlur={async (e: any) => {
                                if (
                                  values.chain_link &&
                                  values.contract_address
                                ) {
                                  setWarning(true);
                                  const response =
                                    await getContractAddressDetails({
                                      contract_address: values.contract_address,
                                      chain_link: values.chain_link,
                                    });

                                  if (response.success == false) {
                                    toast.error(response.message);
                                  }
                                  setFieldValue(
                                    "decimal",
                                    response.data.token_decimal
                                  );
                                  setFieldValue(
                                    "token_name",
                                    response.data.name
                                  );

                                  setFieldValue(
                                    "token_symbol",
                                    response.data.symbol
                                  );
                                  setFieldValue(
                                    "chain_id",
                                    response.data.chain_id
                                  );
                                  setWarning(false);
                                }
                              }}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Contract Address")}
                            </label>
                            <Field
                              type="text"
                              name="contract_address"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.contract_address &&
                                errors.contract_address
                                  ? "is-invalid"
                                  : ""
                              }`}
                              // disabled={!values.chain_link}
                              onClick={() => {
                                if (!values.chain_link) {
                                  toast.warning("Please fill the chain link");
                                }
                              }}
                              onBlur={async (e: any) => {
                                if (
                                  values.chain_link &&
                                  values.contract_address
                                ) {
                                  setWarning(true);
                                  const response =
                                    await getContractAddressDetails({
                                      contract_address: values.contract_address,
                                      chain_link: values.chain_link,
                                    });

                                  if (response.success == false) {
                                    toast.error(response.message);
                                  }
                                  setFieldValue(
                                    "decimal",
                                    response.data.token_decimal
                                  );
                                  setFieldValue(
                                    "token_name",
                                    response.data.name
                                  );
                                  setFieldValue(
                                    "chain_id",
                                    response.data.chain_id
                                  );
                                  setFieldValue(
                                    "token_symbol",
                                    response.data.symbol
                                  );
                                  setWarning(false);
                                }
                              }}
                            />
                            {warning && (
                              <p className="text-warning">
                                {t("Validating contract address")}
                              </p>
                            )}
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Token Symbol")}
                            </label>
                            <Field
                              type="text"
                              name="token_symbol"
                              disabled
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.wallet_address && errors.wallet_address
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Token Name")}
                            </label>
                            <Field
                              type="text"
                              name="token_name"
                              disabled
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.token_name && errors.token_name
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Chain Id")}
                            </label>
                            <Field
                              type="text"
                              disabled
                              name="chain_id"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.chain_id && errors.chain_id
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Decimal")}
                            </label>
                            <Field
                              type="text"
                              name="decimal"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.decimal && errors.decimal
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Wallet Address")}
                            </label>
                            <Field
                              type="text"
                              name="wallet_address"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.wallet_address && errors.wallet_address
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Wallet Private Key")}
                            </label>
                            <Field
                              type="password"
                              name="wallet_private_key"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.wallet_private_key &&
                                errors.wallet_private_key
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Gas Limit")}
                            </label>
                            <Field
                              type="number"
                              name="gas_limit"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.gas_limit && errors.gas_limit
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Website Link")}
                            </label>
                            <Field
                              type="text"
                              name="website_link"
                              className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.website_link && errors.website_link
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                        <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                          <div className="tradex-space-y-2">
                            <label
                              className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                              htmlFor=""
                            >
                              {t("Details rule")}
                            </label>
                            <Field
                              as="textarea"
                              name="details_rule"
                              className={`tradex-block tradex-min-h-[89px] tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent ${
                                touched.details_rule && errors.details_rule
                                  ? "is-invalid"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="tradex-space-y-2">
                            <label
                              className=" tradex-block tradex-w-full"
                              htmlFor="upload_image"
                            >
                              <div className=" tradex-flex tradex-gap-2.5 tradex-items-end tradex-w-full">
                                <div className=" tradex-space-y-2 tradex-w-full">
                                  <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                                    {t("Upload Image")}
                                  </p>
                                  <div className=" tradex-min-h-[89px] tradex-w-full tradex-border tradex-border-dashed tradex-border-primary tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-gap-2">
                                    <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
                                      {t("Choose File")}
                                    </p>

                                    <MdOutlineFileUpload className=" tradex-text-primary" />
                                  </div>
                                </div>
                                <div className=" tradex-min-w-[85px]">
                                  {(data?.ico_phase_token?.image_path ||
                                    image) && (
                                    <img
                                      src={
                                        image
                                          ? URL.createObjectURL(image)
                                          : data?.ico_phase_token?.image_path
                                      }
                                      className=" tradex-w-[85px] tradex-h-[89px] tradex-object-cover tradex-object-center tradex-rounded"
                                    />
                                  )}
                                </div>
                              </div>
                            </label>
                            <input
                              type="file"
                              name="image"
                              id="upload_image"
                              required={edit ? false : !image}
                              className={` tradex-hidden`}
                              onChange={(e: any) => {
                                setImage(e.target.files[0]);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="primary-btn !tradex-text-white"
                      >
                        {loading
                          ? t("Loading..")
                          : edit
                          ? t("Edit")
                          : t("Create Token")}
                      </button>
                    </Form>
                  )}
                </Formik>
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
  const { id, edit } = ctx.query;
  await SSRAuthCheck(ctx, "/ico/applied-launchpad");
  const icoList = await icoListDetails(id);

  return {
    props: {
      id: id,
      edit: edit ? edit : null,
      data: icoList?.data ? icoList?.data : null,
    },
  };
};
export default TokenCreate;
