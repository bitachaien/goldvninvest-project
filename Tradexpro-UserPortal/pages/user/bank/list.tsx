import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import SectionLoading from "components/common/SectionLoading";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import React from "react";
// import DataTable from "react-data-table-component";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useDeleteBank, useGetBankListAction } from "state/actions/user-bank";

const List = () => {
  const { t } = useTranslation("common");

  const { error, loading, refetch, userBankLists } = useGetBankListAction();

  const { deleteBankAction, loading: isDeleteLoading } = useDeleteBank();

  const handleBankItemDelete = async (bank_id: any) => {
    if (!bank_id) return;
    const confirm = window.confirm("Are you sure you want to proceed?");
    if (!confirm) return;
    await deleteBankAction(bank_id);
    refetch();
  };

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
                <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
                  <div className=" tradex-pb-5 tradex-border-b tradex-border-background-primary">
                    <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 tradex-justify-between md:tradex-items-center">
                      <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                        {t("Bank List")}
                      </h2>
                      <Link href={"/user/bank/add-edit-bank"}>
                        <a className=" tradex-w-fit tradex-py-2.5 tradex-px-4 tradex-bg-primary tradex-rounded !tradex-text-white tradex-text-sm tradex-leading-5 tradex-font-semibold">
                          <span>{t("Add Bank")}</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                  <div className=" tradex-overflow-x-auto">
                    {loading ? (
                      <SectionLoading />
                    ) : (
                      <table className="tradex-w-full">
                        <thead className="">
                          <tr className="tradex-h-[44px]">
                            <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {t("Bank name")}
                            </th>

                            <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {t("Date")}
                            </th>
                            <th className=" tradex-text-center tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {t("Actions")}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {userBankLists?.map((item: any, index: number) => (
                            <tr
                              key={`userAct${index}`}
                              className="tradex-border-y tradex-h-[50px] tradex-border-background-primary"
                            >
                              <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {item.bank_form.title}
                              </td>

                              <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                {moment(item.created_at).format("DD MMM YYYY")}
                              </td>
                              <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                                <div className=" tradex-flex tradex-gap-2 tradex-items-center tradex-justify-center">
                                  <span className=" tradex-cursor-pointer">
                                    <Link
                                      href={`/user/bank/add-edit-bank?id=${item?.id}`}
                                    >
                                      <a
                                        className=" tradex-flex tradex-justify-center tradex-items-center  !tradex-text-primary "
                                        title={t("Edit bank")}
                                      >
                                        <AiOutlineEdit size={20} />
                                      </a>
                                    </Link>
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleBankItemDelete(item?.id)
                                    }
                                    disabled={isDeleteLoading}
                                    title={t("Delete bank")}
                                    className="tradex-cursor-pointer tradex-flex tradex-justify-center tradex-items-center  !tradex-text-red-700 "
                                  >
                                    <MdDelete size={20} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {userBankLists?.length == 0 && (
                            <tr>
                              <td colSpan={3}>
                                <div className=" tradex-p-5 tradex-text-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="tradex-mx-auto tradex-h-20 tradex-w-20 tradex-text-muted-400"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 48 48"
                                  >
                                    <circle
                                      cx="27.569"
                                      cy="23.856"
                                      r="7.378"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></circle>
                                    <path
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m32.786 29.073l1.88 1.88m-1.156 1.155l2.311-2.312l6.505 6.505l-2.312 2.312z"
                                    ></path>
                                    <path
                                      fill="none"
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M43.5 31.234V12.55a3.16 3.16 0 0 0-3.162-3.163H7.662A3.16 3.16 0 0 0 4.5 12.55v18.973a3.16 3.16 0 0 0 3.162 3.162h22.195"
                                    ></path>
                                  </svg>
                                  <p className="tradex-text-base tradex-font-medium tradex-text-title">
                                    {t("No Item Found")}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
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
  await SSRAuthCheck(ctx, "/user/profile");

  return {
    props: {},
  };
};
export default List;
