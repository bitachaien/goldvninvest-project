import { SupportChat } from "components/Support/support-chat";
import { TicketNote } from "components/Support/ticket-note";
import { TicketUserInfo } from "components/Support/ticket-user-info";
import SectionLoading from "components/common/SectionLoading";
import { setsupportChat, setSupportSingleChat } from "state/reducer/user";

import {
  SSRAuthCheck,
  pageAvailabilityCheck,
} from "middlewares/ssr-authentication-check";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  siteSettingResource,
  supportTicketConversationDetails,
  supportTicketConversationSend,
} from "service/knowledgebase";
import { RootState } from "state/store";
import { useDispatch, useSelector } from "react-redux";
import { customPage, landingPage } from "service/landing-page";
import Footer from "components/common/footer";
import SupportSidebar from "layout/supportSidebar";
import TopLeftInnerPageCircle from "components/TopLeftInnerPageCircle";
import TopRightInnerPageCircle from "components/TopRightInnerPageCircle";
import SupportLeftSidebar from "components/Support/SupportLeftSidebar";
import StartTrending from "components/StartTrending";
import BottomLeftInnerPageCircle from "components/BottomLeftInnerPageCircle";
import BottomRigtInnerPageCircle from "components/BottomRigtInnerPageCircle";
import { SupportChatBox } from "components/Support/SupportChatBox";
let socketCall = 0;
const SupportTicketDetails = () => {
  const [TicketDetails, setTicketDetails] = useState<any>();
  const [Notes, setNotes] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<any>();
  const dispatch = useDispatch();
  const { supportChat: conversationDetails } = useSelector(
    (state: RootState) => state.user
  );
  const router = useRouter();
  const sendMessage = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("ticket_unique_code", TicketDetails.unique_code);
    file && formData.append("files_name[1]", file);
    setMessage("");
    setFile("");
    await supportTicketConversationSend(formData);
  };

  async function listenMessages() {
    //@ts-ignore
    window.Pusher = Pusher;
    //@ts-ignore
    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "test",
      wsHost: process.env.NEXT_PUBLIC_HOST_SOCKET,
      wsPort: process.env.NEXT_PUBLIC_WSS_PORT
        ? process.env.NEXT_PUBLIC_WSS_PORT
        : 6006,
      wssPort: 443,
      forceTLS: false,
      cluster: "mt1",
      disableStats: true,
      enabledTransports: ["ws", "wss"],
    });
    //@ts-ignore
    window.Echo.channel(
      `New-Message-${localStorage.getItem("user_id")}-${
        TicketDetails?.unique_code
      }`
    ).listen(".Conversation", (e: any) => {
      dispatch(setSupportSingleChat(e.data));
    });
  }
  useEffect(() => {
    if (socketCall === 0 && TicketDetails?.unique_code) {
      listenMessages();
      socketCall = 1;
    }
  });
  const supportTicketConversationDetailsAction = async (
    unique_code: any,
    setTicketDetails: any,
    setLoading: any,
    setNotes: any
  ) => {
    setLoading(true);
    const { data } = await supportTicketConversationDetails(unique_code);
    setTicketDetails(data.ticket_details);
    dispatch(setsupportChat(data.conversation_list));
    setNotes(data?.ticket_note_list);
    setLoading(false);
  };
  useEffect(() => {
    router.query.ticket_id &&
      supportTicketConversationDetailsAction(
        router.query.ticket_id,
        setTicketDetails,
        setLoading,
        setNotes
      );
  }, [router.query.ticket_id]);
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
                {loading === true ? (
                  <SectionLoading />
                ) : (
                  <div className=" tradex-grid tradex-grid-cols-1 md:tradex-grid-cols-12 tradex-gap-6">
                    <div className=" md:tradex-col-span-7 xl:tradex-col-span-8">
                      <SupportChatBox
                        conversationDetails={conversationDetails}
                        sendMessage={sendMessage}
                        setMessage={setMessage}
                        message={message}
                        setFile={setFile}
                        ticketDetails={TicketDetails}
                      />
                    </div>
                    <div className="md:tradex-col-span-5 xl:tradex-col-span-4">
                      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-shadow-[2px_2px_23px_0px_#6C6C6C0D] tradex-px-4 tradex-pt-6 tradex-pb-6 tradex-space-y-6">
                        <TicketUserInfo ticketDetails={TicketDetails} />
                        <TicketNote
                          ticketDetails={TicketDetails}
                          notes={Notes}
                          setNotes={setNotes}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
export default SupportTicketDetails;
