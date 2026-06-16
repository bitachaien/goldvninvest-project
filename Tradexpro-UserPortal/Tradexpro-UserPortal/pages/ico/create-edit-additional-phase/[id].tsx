import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { launchpadCreateUpdatePhaseAdditionalAction } from "state/actions/launchpad";
import { getAdditionalPhaseDetails } from "service/launchpad";
import { parseCookies } from "nookies";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import MarketOverviewHeader from "components/markets/MarketOverviewHeader";
import Footer from "components/common/footer";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import { IoMdAdd } from "react-icons/io";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import LaunchpadSidebar from "components/ico/LaunchpadSidebar";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { MdOutlineFileUpload } from "react-icons/md";

const CreateEditAdditionalPhase = ({ id, edit, data }: any) => {
  const { t } = useTranslation("common");

  const router = useRouter();

  const [inputFields, setInputFields] = useState<any>([
    { value: "", title: "", file: "" },
  ]);
  const [loading, setLoading]: any = useState<any>(false);
  const handleFormChange = (index: any, event: any) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };
  const handleFormFileChange = (index: any, event: any) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.files[0];
    setInputFields(data);
  };
  const addFields = () => {
    let newfield = { value: "", title: "", file: "" };
    setInputFields([...inputFields, newfield]);
  };

  const getEditData = () => {
    let tempArray: any = [];
    data.map((item: any) => {
      tempArray.push({ value: item.value, title: item.title, file: item.file });
    });
    setInputFields(tempArray);
  };
  useEffect(() => {
    if (edit) getEditData();
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

                    launchpadCreateUpdatePhaseAdditionalAction(
                      inputFields,
                      id,
                      setLoading
                    );
                  }}
                >
                  <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                    <div className=" tradex-flex tradex-gap-4 tradex-flex-col sm:tradex-flex-row sm:tradex-justify-between sm:tradex-items-center">
                      <h4 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                        {edit
                          ? t("Edit Additional Info")
                          : t("Add Additional Info")}
                      </h4>
                      <button
                        className="primary-btn !tradex-h-12 !tradex-px-[18px] !tradex-flex tradex-items-center tradex-justify-between tradex-gap-3 !tradex-text-white"
                        onClick={addFields}
                      >
                        {t("Add Field")}
                        <IoMdAdd />
                      </button>
                    </div>

                    {inputFields.map((item: any, index: any) => (
                      <div
                        key={index}
                        className="tradex-grid md:tradex-grid-cols-2 tradex-gap-y-4  tradex-gap-x-6 tradex-pb-6 tradex-border-b last:tradex-border-b-0 tradex-border-background-primary"
                      >
                        <div className="tradex-space-y-2">
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {t("Title")}
                          </label>
                          <input
                            type="text"
                            name="title"
                            placeholder={t("Title")}
                            required
                            value={item.title}
                            onChange={(event) => handleFormChange(index, event)}
                            className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          />
                        </div>
                        <div className="tradex-space-y-2">
                          <label
                            className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold"
                            htmlFor=""
                          >
                            {t("Value")}
                          </label>
                          <input
                            type="text"
                            name="value"
                            placeholder={t("Value")}
                            value={item.value}
                            required
                            onChange={(event) => handleFormChange(index, event)}
                            className={`tradex-block tradex-w-full tradex-px-2.5 tradex-py-1.5 tradex-min-h-12 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent`}
                          />
                        </div>
                        <div className="tradex-space-y-2 md:tradex-col-span-2">
                          <label
                            className=" tradex-block tradex-w-full"
                            htmlFor={`upload_image_${index}`}
                          >
                            <div className=" tradex-flex tradex-gap-2.5 tradex-items-end tradex-w-full">
                              <div className=" tradex-space-y-2 tradex-w-full">
                                <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                                  {t("File")}
                                </p>
                                <div className=" tradex-min-h-[89px] tradex-w-full tradex-border tradex-border-dashed tradex-border-primary tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-gap-2">
                                  <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
                                    {t("Choose File")}
                                  </p>

                                  <MdOutlineFileUpload className=" tradex-text-primary" />
                                </div>
                              </div>
                              {item?.file && (
                                <div className=" tradex-min-w-[85px]">
                                  <img
                                    src={
                                      typeof item?.file == "string"
                                        ? item?.file
                                        : URL.createObjectURL(item?.file)
                                    }
                                    className=" tradex-w-[85px] tradex-h-[89px] tradex-object-cover tradex-object-center tradex-rounded"
                                  />
                                </div>
                              )}
                            </div>
                          </label>
                          <input
                            type="file"
                            name="file"
                            id={`upload_image_${index}`}
                            className={` tradex-hidden`}
                            onChange={(event) =>
                              handleFormFileChange(index, event)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="primary-btn !tradex-text-white"
                  >
                    {loading
                      ? t("Loading..")
                      : edit
                      ? t("Edit aditional data")
                      : t("Add aditional data")}
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
  let additionalDetails = await getAdditionalPhaseDetails(id, cookies.token);

  return {
    props: {
      id: id,
      edit: additionalDetails.data.length > 0 ? true : false,
      data: additionalDetails.data.length > 0 ? additionalDetails.data : [],
    },
  };
};
export default CreateEditAdditionalPhase;
