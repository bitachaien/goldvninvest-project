import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import StartTrending from "components/StartTrending";
import SupportHeader from "components/Support/SupportHeader";
import SupportLeftSidebar from "components/Support/SupportLeftSidebar";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import Footer from "components/common/footer";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import SupportSidebar from "layout/supportSidebar";
import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { toast } from "react-toastify";
import {
  SupportCreateTicket,
  knowledgebaseSupportProjectList,
  siteSettingResource,
} from "service/knowledgebase";
import { customPage, landingPage } from "service/landing-page";

const TicketCreate = () => {
  const { t } = useTranslation("common");

  const [projectList, setProjectList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [options, setOptions] = useState<any>({
    project: "",
    title: "",
    description: "",
    purchase_code: "",
  });
  const [file, setFile] = useState<any>();
  const router = useRouter();
  const getProjectList = async () => {
    const { data } = await knowledgebaseSupportProjectList();
    setProjectList(data?.project_list);
    setCategoryList(data?.category);
  };
  const createTicket = async () => {
    if (!options?.category) {
      toast.error("Please Select Category");
      return;
    }
    if (!options?.project) {
      toast.error("Please Select Project");
      return;
    }
    if (!options?.title) {
      toast.error("Please Add Title");
      return;
    }
    if (!options?.description) {
      toast.error("Please Add Description");
      return;
    }
    const formData = new FormData();
    // if (!options.title || options.project || options.description) {
    //   toast.error("Please fill all the fields!");
    //   return;
    // }
    formData.append("title", options.title);
    formData.append("category_id", options.category);
    formData.append("project_id", options.project);
    formData.append("description", options.description);
    formData.append("file[1]", file);
    options.purchase_code &&
      formData.append("purchase_code", options.purchase_code);

    const data = await SupportCreateTicket(formData);
    if (data.success) {
      toast.success(data.message);
      router.push("/support");
    } else {
      toast.error(data.message);
    }
  };
  useEffect(() => {
    getProjectList();
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
                <SupportLeftSidebar />
              </div>
              <div className=" lg:tradex-col-span-9">
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <h4 className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] !tradex-text-title tradex-font-bold ">
                    {t("Create New Ticket")}
                  </h4>
                  <div className=" tradex-space-y-8">
                    <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                      <div className="tradex-space-y-2">
                        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                          {t("Choose Category")}
                        </label>
                        <select
                          id="inputState"
                          className="tradex-block tradex-min-h-12 tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              category: e.target.value,
                            });
                          }}
                        >
                          <option selected value={""}>
                            {t("Choose")}...
                          </option>
                          {categoryList.map((category: any, index: any) => (
                            <option key={index} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="tradex-space-y-2">
                        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                          {t("Choose Project")}
                        </label>
                        <select
                          id="inputState"
                          className="tradex-block tradex-min-h-12 tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-background-main"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              project: e.target.value,
                            });
                          }}
                        >
                          <option selected>{t("Choose")}...</option>
                          {projectList.map((project: any, index: any) => (
                            <option key={index} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="tradex-space-y-2">
                        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                          {t("Title")}
                        </label>
                        <input
                          className="tradex-block tradex-min-h-12 tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent"
                          type="text"
                          name="title"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              title: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                          {t("Purchase Code (optional)")}
                        </label>
                        <input
                          className="tradex-block tradex-min-h-12 tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent"
                          type="text"
                          name="purchase_code"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              purchase_code: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="tradex-space-y-2">
                        <label className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                          {t("Description")}
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          className="tradex-block tradex-min-h-[89px] tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded !tradex-bg-transparent"
                          onChange={(e: any) => {
                            setOptions({
                              ...options,
                              description: e.target.value,
                            });
                          }}
                        ></textarea>
                      </div>

                      <div className="tradex-space-y-2">
                        <label
                          className=" tradex-block tradex-w-full"
                          htmlFor="upload_image"
                        >
                          <div className=" tradex-flex tradex-gap-2.5 tradex-items-end tradex-w-full">
                            <div className=" tradex-space-y-2 tradex-w-full">
                              <p className="tradex-input-label !tradex-text-base !tradex-leading-[22px] !tradex-font-semibold">
                                {t("Attach File")}
                              </p>
                              <div className=" tradex-min-h-[89px] tradex-w-full tradex-border tradex-border-dashed tradex-border-primary tradex-rounded tradex-flex tradex-justify-center tradex-items-center tradex-gap-2">
                                <p className=" tradex-text-base tradex-leading-5 tradex-text-body">
                                  {t("Choose File")}
                                </p>

                                <MdOutlineFileUpload className=" tradex-text-primary" />
                              </div>
                            </div>
                            {file && (
                              <div className=" tradex-min-w-[85px]">
                                <img
                                  src={URL.createObjectURL(file)}
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
                          className={` tradex-hidden`}
                          onChange={(e: any) => {
                            setFile(e.target.files[0]);
                          }}
                        />
                      </div>
                    </div>
                    <button
                      className="primary-btn !tradex-text-white"
                      onClick={createTicket}
                    >
                      {t("Submit")}
                    </button>
                  </div>
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
  await SSRAuthCheck(ctx, "/support");
  const commonRes = await pageAvailabilityCheck();
  const resorce = await siteSettingResource();
  if (parseInt(commonRes.knowledgebase_support_module) !== 1) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      resorce: resorce,
    },
  };
};
export default TicketCreate;
