import useTranslation from "next-translate/useTranslation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { notification } from "service/notification";
import { RootState } from "state/store";
import { GetServerSideProps } from "next";
import { customPage, landingPage } from "service/landing-page";
import { SSRAuthCheck } from "middlewares/ssr-authentication-check";
import Footer from "components/common/footer";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
const NotificationPage = () => {
  const { t } = useTranslation("common");
  const { notificationData } = useSelector((state: RootState) => state.user);

  return (
    <>
      <div className={` tradex-relative`}>
        <section className="tradex-pt-[50px] tradex-relative">
          <TopLeftInnerPageCircle />
          <TopRightInnerPageCircle />
          <div className=" tradex-container tradex-relative">
            <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D]  tradex-px-5 md:tradex-px-10 tradex-pt-6 tradex-pb-12 tradex-space-y-6">
              <h2 className=" tradex-text-[32px] tradex-leading-[38px] md:tradex-text-[40px] md:tradex-leading-[48px] tradex-font-bold !tradex-text-title">
                {t("All notifications")}
              </h2>
              {notificationData?.length > 0 ? (
                <div className=" tradex-space-y-4">
                  {notificationData?.map((item: any, index: any) => (
                    <div
                      key={index}
                      className=" tradex-px-4 tradex-py-6 tradex-rounded-lg tradex-border tradex-border-background-primary tradex-space-y-6"
                    >
                      <div className=" tradex-pb-4 tradex-border-b tradex-border-background-primary">
                        <p className=" tradex-text-base sm:tradex-text-xl tradex-font-semibold tradex-text-primary tradex-flex tradex-gap-2 tradex-items-center">
                          <div className=" tradex-min-w-[25px]">
                            <IoMdNotificationsOutline size={25} />
                          </div>
                          <span>{item?.title}</span>
                        </p>
                      </div>
                      <div className=" tradex-flex tradex-flex-col sm:tradex-flex-row tradex-justify-between tradex-gap-4">
                        <p className=" tradex-text-body  tradex-text-sm sm:tradex-text-base">
                          {item?.notification_body}
                        </p>
                        <p className="tradex-text-primary  tradex-text-sm sm:tradex-text-base tradex-font-semibold tradex-text-nowrap">
                          {moment(item.created_at).format("DD MMM YYYY")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <NoItemFound message="No notification's" />
              )}
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
  await SSRAuthCheck(ctx, "/user/notification");
  return {
    props: {},
  };
};
export default NotificationPage;
