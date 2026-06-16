import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { useRouter } from "next/router";
import { launchpadCreateUpdatePhaseAction } from "state/actions/launchpad";
import { GetCoinListApi } from "service/wallet";
import { icoListDetails, phaseListDetails } from "service/launchpad";
import { parseCookies } from "nookies";
import LaunchpadHeader from "components/ico/LaunchpadHeader";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import Footer from "components/common/footer";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { MdOutlineFileUpload } from "react-icons/md";
import { CiCalendarDate } from "react-icons/ci";

const CreateEditPhase = ({ id, edit, data }: any) => {
  const { t } = useTranslation("common");
  const [coinList, setCoinList] = useState([]);
  const [phaseForm, setphaseForm]: any = useState<any>({
    id: edit ? data.id : null,
    ico_token_id: edit ? data.ico_token_id : id,
    coin_price: edit ? data.coin_price : "",
    coin_currency: edit ? data.coin_currency : "",
    total_token_supply: edit ? data.total_token_supply : "",
    phase_title: edit ? data.phase_title : "",
    start_date: edit ? data.start_date : "",
    end_date: edit ? data.end_date : "",
    description: edit ? data.description : "",
    video_link: edit ? data.video_link : "",
    maximum_purchase_price: edit ? data.maximum_purchase_price : "",
    minimum_purchase_price: edit ? data.minimum_purchase_price : "",
    image: "",
    editImage: edit ? data.image : "",
    social_link: {
      1: edit ? JSON.parse(data.social_link).Facebook : "",
      2: edit ? JSON.parse(data.social_link).Twitter : "",
      3: edit ? JSON.parse(data.social_link).Linkedin : "",
    },
  });
  const [formFields, setFormFields] = useState<any>([]);
  const [loading, setLoading]: any = useState<any>(false);
  const router = useRouter();
  const getCoinList = async () => {
    const coinResponse = await GetCoinListApi();
    setCoinList(coinResponse.data);
  };
  useEffect(() => {
    getCoinList();
  }, []);
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
                <form
                  className="tradex-space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    launchpadCreateUpdatePhaseAction(phaseForm, setLoading, id);
                  }}
                >
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                    <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                      {t(
                        `${
                          router.query.edit === "true" ? "Edit" : "Create New"
                        }  Phase`
                      )}
                    </h4>
                    <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Coin price")}
                        </label>
                        <input
                          type="number"
                          name="coin_price"
                          required
                          value={phaseForm.coin_price}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              coin_price: e.target.value,
                            });
                          }}
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Select Coin Currency")}
                        </label>
                        <select
                          name="coin_currency"
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main`}
                          required
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              coin_currency: e.target.value,
                            });
                          }}
                        >
                          <option value="">{t("Select currency")}</option>
                          {coinList.map((item: any, index: any) => (
                            <option
                              key={index}
                              selected={
                                phaseForm.coin_currency === item.coin_type
                              }
                              value={item.coin_type}
                            >
                              {item?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Maximum purchase amount")}
                        </label>
                        <input
                          type="number"
                          name="maximum_price"
                          required
                          value={phaseForm.maximum_purchase_price}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              maximum_purchase_price: e.target.value,
                            });
                          }}
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Minimum purchase amount")}
                        </label>
                        <input
                          type="number"
                          name="maximum_price"
                          required
                          value={phaseForm.minimum_purchase_price}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              minimum_purchase_price: e.target.value,
                            });
                          }}
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Phase Title")}
                        </label>
                        <input
                          type="text"
                          name="phase_title"
                          required
                          value={phaseForm.phase_title}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              phase_title: e.target.value,
                            });
                          }}
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Total Token Supply")}
                        </label>
                        <input
                          type="number"
                          name="total_token_supply"
                          required
                          value={phaseForm.total_token_supply}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              total_token_supply: e.target.value,
                            });
                          }}
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                        />
                      </div>

                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Start Date")}
                        </label>
                        <div className=" tradex-w-full tradex-relative">
                          <input
                            type="date"
                            name="start_date"
                            required
                            value={phaseForm.start_date}
                            onChange={(e) => {
                              setphaseForm({
                                ...phaseForm,
                                start_date: e.target.value,
                              });
                            }}
                            className={` ico-phase-date-type tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          />
                          <span className=" tradex-pointer-events-none tradex-absolute tradex-right-[10px] -tradex-translate-y-1/2 tradex-top-1/2">
                            <CiCalendarDate
                              size={20}
                              className=" tradex-text-body"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("End Date")}
                        </label>
                        <div className="tradex-w-full tradex-relative">
                          <input
                            type="date"
                            name="end_date"
                            value={phaseForm.end_date}
                            onChange={(e) => {
                              setphaseForm({
                                ...phaseForm,
                                end_date: e.target.value,
                              });
                            }}
                            className={`ico-phase-date-type tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          />
                          <span className=" tradex-pointer-events-none tradex-absolute tradex-right-[10px] -tradex-translate-y-1/2 tradex-top-1/2">
                            <CiCalendarDate
                              size={20}
                              className=" tradex-text-body"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="tradex-space-y-2 md:tradex-col-span-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Description")}
                        </label>
                        <textarea
                          name="description"
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          required
                          value={phaseForm.description}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              description: e.target.value,
                            });
                          }}
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
                          {t("Video Link")}
                        </label>
                        <input
                          type="text"
                          name="video_link"
                          value={phaseForm.video_link}
                          onChange={(e) => {
                            setphaseForm({
                              ...phaseForm,
                              video_link: e.target.value,
                            });
                          }}
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                        />
                      </div>

                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Facebook Link")}
                        </label>
                        <input
                          type="text"
                          name="social_link"
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          value={phaseForm.social_link["1"]}
                          onChange={(e: any) => {
                            setphaseForm({
                              ...phaseForm,
                              social_link: {
                                ...phaseForm.social_link,
                                ["1"]: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Twitter Link")}
                        </label>
                        <input
                          type="text"
                          name="social_link"
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          value={phaseForm.social_link["2"]}
                          onChange={(e: any) => {
                            setphaseForm({
                              ...phaseForm,
                              social_link: {
                                ...phaseForm.social_link,
                                ["2"]: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label
                          className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                          htmlFor=""
                        >
                          {t("Linkedin Link")}
                        </label>
                        <input
                          type="text"
                          name="social_link"
                          className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          value={phaseForm.social_link["3"]}
                          onChange={(e: any) => {
                            setphaseForm({
                              ...phaseForm,
                              social_link: {
                                ...phaseForm.social_link,
                                ["3"]: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <div className="tradex-space-y-2 md:tradex-col-span-2">
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
                            {(phaseForm.editImage || phaseForm.image) && (
                              <div className=" tradex-min-w-[85px]">
                                <img
                                  src={
                                    phaseForm.image
                                      ? URL.createObjectURL(phaseForm.image)
                                      : phaseForm.editImage
                                  }
                                  className=" tradex-w-[85px] tradex-h-[89px] tradex-object-cover tradex-object-center tradex-rounded"
                                />
                              </div>
                            )}
                          </div>
                        </label>
                        <input
                          type="file"
                          name="image"
                          id="upload_image"
                          required={!phaseForm.editImage}
                          className={` tradex-hidden`}
                          onChange={(e: any) => {
                            setphaseForm({
                              ...phaseForm,
                              image: e.target.files[0],
                            });
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
                      ? t("Edit Phase")
                      : t("Create Phase")}
                  </button>
                </form>
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
  const cookies = parseCookies(ctx);
  let icoList: any;
  if (edit) {
    icoList = await phaseListDetails(id, cookies.token);
  }
  return {
    props: {
      id: id,
      edit: edit ? edit : null,
      data: edit ? icoList.data : {},
    },
  };
};
export default CreateEditPhase;
