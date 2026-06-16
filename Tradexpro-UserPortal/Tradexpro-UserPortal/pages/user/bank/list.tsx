import { formatCurrency } from "common";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import Footer from "components/common/footer";
import TableLoading from "components/common/SectionLoading";
import CustomDataTable from "components/Datatable";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import ProfileHeader from "components/profile/ProfileHeader";
import UserProfileSidebar from "components/profile/UserProfileSidebar";
import StartTrending from "components/StartTrending";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import ProfileSidebar from "layout/profile-sidebar";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import moment from "moment";
import { GetServerSideProps } from "next";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { TiArrowRepeat } from "react-icons/ti";
import { customPage, landingPage } from "service/landing-page";
import { GetUserInfoByTokenServer } from "service/user";
import { geyBankListAction } from "state/actions/fiat-deposit-withawal";

const List = () => {
  const { t } = useTranslation("common");
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [selectedLimit, setSelectedLimit] = useState<any>("10");

  type searchType = string;
  const [bankList, setBankList] = useState([]);
  const [search, setSearch] = React.useState<searchType>("");
  const columns = [
    {
      Header: t("Account holder name"),
      Cell: ({ row }: any) => row?.original?.account_holder_name,
      sortable: true,
    },
    {
      Header: t("Bank name"),
      Cell: ({ row }: any) => row?.original?.bank_name,
      sortable: true,
    },

    {
      Header: t("Country"),
      Cell: ({ row }: any) => row?.original?.country,
      sortable: true,
    },
    {
      Header: t("Date"),
      Cell: ({ row }: any) =>
        moment(row.original?.created_at).format("YYYY-MM-DD HH:mm:ss"),
      sortable: true,
    },
    {
      Header: t("Actions"),
      Cell: ({ row }: any) => (
        <td>
          <div className="active-link">
            <Link href={`/user/bank/add-edit-bank?id=${row.original?.id}`}>
              <span className="toolTip" title="Edit bank">
                <AiOutlineEdit size={20} />
              </span>
            </Link>
          </div>
        </td>
      ),
    },
  ];
  useEffect(() => {
    geyBankListAction(setBankList, setProcessing);
  }, []);

  console.log("bankList", bankList);

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
                    <div className=" tradex-space-y-6">
                      <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                        {t("Bank List")}
                      </h2>
                      <div className=" tradex-flex tradex-flex-col md:tradex-flex-row tradex-gap-4 tradex-justify-between md:tradex-items-center">
                        <div className=" tradex-flex tradex-flex-col md:tradex-flex-row md:tradex-items-center tradex-gap-6">
                          <div>
                            <label className="!tradex-mb-0 tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body">
                              {t("Show")}
                              <select
                                className=" tradex-ml-4 !tradex-bg-background-main tradex-py-2.5 tradex-px-5 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5 tradex-text-title"
                                placeholder="10"
                                onChange={(e) => {
                                  setSelectedLimit(e.target.value);
                                }}
                                value={selectedLimit}
                              >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                              </select>
                            </label>
                          </div>

                          <div>
                            <label className=" !tradex-mb-0 tradex-flex tradex-items-center tradex-text-xl tradex-leading-6 tradex-font-semibold tradex-text-body">
                              {t("Search:")}
                              <input
                                type="search"
                                aria-controls="table"
                                className=" !tradex-bg-transparent tradex-ml-4 tradex-py-2.5 tradex-px-3 tradex-border !tradex-border-background-primary tradex-rounded tradex-text-sm tradex-leading-5"
                                value={search || ""}
                                onChange={(e) => setSearch(e.target.value)}
                              />
                            </label>
                          </div>
                        </div>
                        <Link href={"/user/bank/add-edit-bank"}>
                          <a className=" tradex-w-fit tradex-py-2.5 tradex-px-4 tradex-bg-primary tradex-rounded !tradex-text-white tradex-text-sm tradex-leading-5 tradex-font-semibold">
                            <span>{t("Add Bank")}</span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className=" tradex-overflow-x-auto">
                    <table className="tradex-w-full">
                      <thead className="">
                        <tr className="tradex-h-[44px]">
                          <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                            {t("Account holder name")}
                          </th>
                          <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                            {t("Bank name")}:
                          </th>
                          <th className=" tradex-text-base tradex-leading-5 tradex-text-title tradex-font-semibold tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                            {t("Country")}
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
                        {bankList?.map((item: any, index: number) => (
                          <tr
                            key={`userAct${index}`}
                            className="tradex-border-y tradex-h-[50px] tradex-border-background-primary"
                          >
                            <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {item.account_holder_name}
                            </td>
                            <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {item.bank_name}
                            </td>
                            <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {item.country}
                            </td>
                            <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              {moment(item.created_at).format("DD MMM YYYY")}
                            </td>
                            <td className="tradex-text-sm tradex-leading-4 tradex-text-body tradex-text-nowrap tradex-pr-4 last:tradex-pr-4">
                              <span className=" tradex-cursor-pointer">
                                <Link
                                  href={`/user/bank/add-edit-bank?id=${item?.id}`}
                                >
                                  <a
                                    className=" tradex-flex tradex-justify-center tradex-items-center  !tradex-text-primary "
                                    title="Edit bank"
                                  >
                                    <AiOutlineEdit size={20} />
                                  </a>
                                </Link>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
