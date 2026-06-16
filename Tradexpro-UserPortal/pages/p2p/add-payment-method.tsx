import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import P2PSidebar from "components/P2P/P2pHome/P2PSidebar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoArrowBack } from "react-icons/io5";
import { useAddEditP2PBankDetailsAction } from "state/actions/p2p";

const AddPaymentMethod = ({ bank_id }: any) => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { loading, formik, bankFormLists, selectedBank } =
    useAddEditP2PBankDetailsAction(bank_id || "");

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative tradex-z-10">
            <div className=" tradex-grid tradex-grid-cols-1 lg:tradex-grid-cols-3 tradex-gap-6">
              <P2PSidebar />
              <div className=" lg:tradex-col-span-2 tradex-space-y-8 tradex-h-full">
                <div className="tradex-h-full tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                  <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary tradex-space-y-4">
                    <h2 className=" tradex-text-[32px] tradex-leading-[38px] tradex-font-bold !tradex-text-title">
                      {bank_id
                        ? t("Edit payment method")
                        : t("Add payment method")}
                    </h2>
                    <Link href={`/p2p/p2p-profile`}>
                      <div className=" tradex-flex tradex-gap-3 tradex-items-center tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body tradex-cursor-pointer">
                        <IoArrowBack />
                        {t("Back")}
                      </div>
                    </Link>
                  </div>
                  <form
                    onSubmit={formik.handleSubmit}
                    className="tradex-space-y-12"
                  >
                    <div className="tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
                      <div className=" tradex-space-y-2 md:tradex-col-span-2">
                        <label className=" tradex-input-label tradex-mb-0">
                          {t("Select bank")}
                        </label>
                        <select
                          name="form_id"
                          className={`tradex-input-field !tradex-bg-background-primary !tradex-border-solid !tradex-border !tradex-border-background-primary `}
                          value={formik.values.form_id}
                          onChange={formik.handleChange}
                          disabled={!!bank_id}
                        >
                          <option value="">{t("Select bank")}</option>
                          {bankFormLists?.map((item: any, index: number) => (
                            <option value={item?.bank_form?.id} key={index}>
                              {item?.bank_form?.title}
                            </option>
                          ))}
                        </select>
                        {formik.touched.form_id && formik.errors.form_id ? (
                          <p className="tradex-text-red-500 tradex-text-sm">
                            {formik.errors.form_id}
                          </p>
                        ) : null}
                      </div>
                      {selectedBank?.bank_form?.fields?.map((field: any) => (
                        <div key={field.id} className="tradex-space-y-2">
                          <label className="tradex-input-label tradex-mb-0">
                            {field.title}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              name={field.slug}
                              className="tradex-input-field"
                              value={formik.values[field.slug]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          ) : (
                            <input
                              type={field.data_type}
                              name={field.slug}
                              className="tradex-input-field"
                              value={formik.values[field.slug]}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          )}

                          {formik.touched[field.slug] &&
                          formik.errors[field.slug] ? (
                            <p className="tradex-text-red-500 tradex-text-sm">
                              {formik.errors[field.slug]}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <div className=" tradex-flex tradex-gap-6 tradex-items-center">
                      <button
                        type="submit"
                        className="tradex-w-full tradex-flex tradex-items-center tradex-justify-center tradex-min-h-[56px] tradex-py-4 tradex-rounded-lg tradex-bg-primary tradex-text-white tradex-text-base tradex-font-semibold"
                      >
                        {loading
                          ? t("Submitting..")
                          : bank_id
                          ? t("Edit Payment")
                          : t("Create Payment")}
                      </button>
                    </div>
                  </form>
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
  await SSRAuthCheck(ctx, "/p2p");
  const { id } = ctx.query;

  return {
    props: {
      bank_id: id ? id : null,
    },
  };
};
export default AddPaymentMethod;
