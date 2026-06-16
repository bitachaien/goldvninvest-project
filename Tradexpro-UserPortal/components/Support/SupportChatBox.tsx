import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import { BsFillFileEarmarkImageFill, BsX } from "react-icons/bs";
import useTranslation from "next-translate/useTranslation";
import {
  TICKET_STATUS_CLOSE,
  TICKET_STATUS_OPEN,
  TICKET_STATUS_PENDING,
} from "helpers/core-constants";
import SupportTicketItemBadge from "./SupportTicketItemBadge";
import { formateDateMunite } from "common";

export const SupportChatBox = ({
  sendMessage,
  setMessage,
  setFile,
  message,
  col,
  ticketDetails,
}: any): JSX.Element => {
  // const messagesEndRef = useRef(null);
  const { t } = useTranslation("common");

  const { user } = useSelector((state: RootState) => state.user);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const scrollToBottom = () => {
    let container: any = document.querySelector("#conversations_list");
    container.scrollTop = container.scrollHeight;

    //@ts-ignore
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const { supportChat: conversationDetails } = useSelector(
    (state: RootState) => state.user
  );
  useEffect(() => {
    scrollToBottom();
  }, [conversationDetails]);

  const handleClearFile = () => {
    setFile(null);
    setImagePreview(null);
  };

  return (
    <>
      <div className=" tradex-flex tradex-flex-col tradex-bg-background-main tradex-border tradex-border-background-primary tradex-rounded-lg ">
        <div className=" tradex-px-4 tradex-py-3 tradex-bg-background-primary tradex-rounded-t-lg tradex-rounded-tr-lg tradex-min-h-12 tradex-flex tradex-items-center">
          {/* <h2 className=" tradex-text-base tradex-leading-5 !tradex-text-title">
            {user?.first_name} {user?.last_name}
          </h2> */}

          <div className=" tradex-flex tradex-items-start tradex-gap-1">
            <h6 className=" tradex-text-base tradex-leading-6 !tradex-text-title">
              <span className="mr-1"># {ticketDetails?.id}</span>
              <span>{ticketDetails?.title}</span>
              <div className=" tradex-ml-1.5 tradex-inline-block">
                {ticketDetails?.status === TICKET_STATUS_PENDING ? (
                  <SupportTicketItemBadge
                    title={t("Pending")}
                    className="tradex-bg-yellow-500"
                  />
                ) : ticketDetails?.status === TICKET_STATUS_OPEN ? (
                  <SupportTicketItemBadge
                    title={t("Open")}
                    className="tradex-bg-green-500"
                  />
                ) : ticketDetails?.status === TICKET_STATUS_CLOSE ? (
                  <SupportTicketItemBadge
                    title={t("Close")}
                    className="tradex-bg-red-500"
                  />
                ) : (
                  <SupportTicketItemBadge
                    title={t("Close forever")}
                    className="tradex-bg-red-500"
                  />
                )}
              </div>
            </h6>
          </div>
        </div>

        <div className=" tradex-h-full tradex-px-4 tradex-pb-4 tradex-pt-5  tradex-flex tradex-flex-col tradex-justify-between tradex-gap-6">
          <div
            className=" tradex-max-h-[500px] tradex-min-h-[500px] tradex-h-[500px] tradex-overflow-y-auto"
            id="conversations_list"
          >
            <div className="tradex-space-y-5" id="append_conversation">
              {conversationDetails?.map((chat: any) =>
                chat?.user?.id === user.id || chat?.user_id === user.id ? (
                  <>
                    <div className="tradex-pl-12">
                      <div className=" tradex-flex tradex-justify-end tradex-gap-3">
                        {chat?.message && (
                          <div
                            className=" tradex-mt-[5px] tradex-relative tradex-p-2 tradex-rounded-sm tradex-bg-primary  !tradex-text-white !tradex-text-sm !tradex-leading-[18px] after:tradex-absolute after:-tradex-right-[8px]  after:tradex-top-0 after:tradex-border-solid after:tradex-border-t-[10px] after:tradex-border-r-[10px] after:tradex-border-t-primary after:tradex-border-r-transparent"
                            dangerouslySetInnerHTML={{
                              __html: chat?.message,
                            }}
                          ></div>
                        )}

                        <div className=" tradex-min-w-8">
                          <img
                            className=" tradex-rounded-full tradex-min-w-8 tradex-min-h-8 tradex-h-8 tradex-w-8 tradex-max-w-8 tradex-max-h-8 tradex-object-cover tradex-object-center"
                            src={chat?.user?.photo}
                            alt=""
                          />
                        </div>
                      </div>

                      {chat?.conversation_attachment.map((image: any) =>
                        image.file_type === "img" ? (
                          <a
                            href={image?.file_link}
                            target="_blank"
                            rel="noreferrer"
                            className="tradex-flex tradex-justify-end tradex-pr-[40px]"
                          >
                            <img
                              height={100}
                              className="tradex-max-h-[100px] tradex-rounded-lg tradex-object-contain tradex-object-center"
                              src={image?.file_link}
                            />
                          </a>
                        ) : (
                          <a
                            href={image?.file_link}
                            target="_blank"
                            rel="noreferrer"
                            className="tradex-flex tradex-justify-end tradex-pr-[40px]"
                          >
                            {t("Download file")}
                          </a>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="tradex-pr-12">
                    <div className="tradex-flex tradex-justify-start tradex-gap-3">
                      <div className="tradex-min-w-8">
                        <img
                          className="tradex-rounded-full tradex-min-w-8 tradex-min-h-8 tradex-h-8 tradex-w-8 tradex-max-w-8 tradex-max-h-8 tradex-object-cover tradex-object-center"
                          src={chat?.user?.photo}
                          alt=""
                        />
                      </div>
                      {chat?.message && (
                        <div
                          className="tradex-mt-[5px] tradex-relative tradex-p-2 tradex-rounded-sm tradex-bg-background-primary  !tradex-text-title !tradex-text-sm !tradex-leading-[18px] after:tradex-absolute after:-tradex-left-[8px]  after:tradex-top-0 after:tradex-border-solid after:tradex-border-t-[10px] after:tradex-border-l-[10px] after:tradex-border-t-background-primary after:tradex-border-l-transparent"
                          dangerouslySetInnerHTML={{
                            __html: chat?.message,
                          }}
                        ></div>
                      )}
                    </div>

                    {chat?.conversation_attachment?.map((image: any) =>
                      image.file_type === "img" ? (
                        <a
                          href={image?.file_link}
                          target="_blank"
                          rel="noreferrer"
                          className="tradex-flex tradex-justify-start tradex-pl-[40px]"
                        >
                          <img
                            height={100}
                            className="tradex-max-h-[100px] tradex-rounded-lg tradex-object-contain tradex-object-center"
                            src={image?.file_link}
                          />
                        </a>
                      ) : (
                        <a
                          href={image?.file_link}
                          target="_blank"
                          rel="noreferrer"
                          className="tradex-flex tradex-justify-start tradex-pl-[40px]"
                        >
                          {t("Download file")}
                        </a>
                      )
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="">
            <div className="image_preview_container">
              {imagePreview && (
                <div className=" tradex-flex tradex-gap-2 tradex-items-start">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className=" tradex-max-h-12 tradex-object-contain tradex-object-center"
                  />
                  <button className="clear_button" onClick={handleClearFile}>
                    <BsX />
                  </button>
                </div>
              )}
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(e);
                  setImagePreview(null);
                }}
                className=" tradex-flex tradex-gap-4 tradex-items-center"
              >
                <input
                  type="text"
                  className=" tradex-min-h-12 tradex-flex tradex-items-center tradex-px-3 tradex-rounded-full tradex-bg-background-primary tradex-w-full"
                  id="send-message-box"
                  name="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  placeholder={t("Send a message")}
                />

                <div className=" tradex-h-fit tradex-flex tradex-items-center">
                  <input
                    type="file"
                    className=" tradex-hidden"
                    id="inputGroupFile01"
                    onChange={(e: any) => {
                      setFile(e.target.files[0]);

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setImagePreview(event.target?.result as string);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }}
                  />
                  <label className=" !tradex-mb-0" htmlFor="inputGroupFile01">
                    <svg
                      width="36"
                      height="37"
                      viewBox="0 0 36 37"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className=" tradex-max-h-8 tradex-max-w-8"
                    >
                      <path
                        d="M34.7501 13.8953C34.4184 13.8997 34.1015 14.0334 33.8669 14.268C33.6323 14.5025 33.4986 14.8194 33.4943 15.1512V25.1977L26.4952 17.194C26.0505 16.7205 25.5136 16.3432 24.9175 16.0853C24.3213 15.8274 23.6787 15.6943 23.0292 15.6943C22.3797 15.6943 21.737 15.8274 21.1409 16.0853C20.5448 16.3432 20.0078 16.7205 19.5631 17.194L14.7576 22.686L13.1836 20.7772C12.7499 20.2569 12.2071 19.8383 11.5937 19.5511C10.9803 19.2638 10.3112 19.1149 9.63384 19.1149C8.95649 19.1149 8.28742 19.2638 7.67399 19.5511C7.06057 19.8383 6.51778 20.2569 6.08407 20.7772L2.51756 25.0805V8.45349C2.52197 7.01158 3.09673 5.62998 4.11632 4.61039C5.13591 3.5908 6.51751 3.01604 7.95942 3.01163H21.3548C21.6878 3.01163 22.0072 2.87932 22.2428 2.64381C22.4783 2.4083 22.6106 2.08888 22.6106 1.75581C22.6106 1.42275 22.4783 1.10333 22.2428 0.867819C22.0072 0.632309 21.6878 0.5 21.3548 0.5H7.95942C5.85002 0.5 3.82702 1.33795 2.33545 2.82952C0.843885 4.32109 0.00593065 6.34409 0.00593065 8.45349V28.5465C-0.00197688 28.5739 -0.00197688 28.6029 0.00593065 28.6302C0.027983 30.7251 0.875662 32.7266 2.36485 34.2002C3.85403 35.6737 5.86445 36.5001 7.95942 36.5H28.0524C30.1388 36.4958 32.14 35.672 33.6246 34.2062C35.1092 32.7404 35.9584 30.7498 35.9892 28.6637V15.1512C35.985 14.8223 35.8536 14.5078 35.6226 14.2737C35.3916 14.0396 35.0789 13.904 34.7501 13.8953ZM28.0524 33.9884H7.95942C6.59161 33.984 5.27561 33.4647 4.27339 32.5339C3.27118 31.603 2.65626 30.3289 2.55105 28.9651L7.95942 22.3846C8.16199 22.159 8.40982 21.9785 8.68677 21.8549C8.96372 21.7313 9.26359 21.6675 9.56686 21.6675C9.87013 21.6675 10.17 21.7313 10.4469 21.8549C10.7239 21.9785 10.9717 22.159 11.1743 22.3846L13.7027 25.4321C13.8186 25.5731 13.9643 25.6868 14.1293 25.7649C14.2943 25.8431 14.4745 25.8838 14.6571 25.8842C15.0187 25.8642 15.3594 25.7088 15.6115 25.4488L21.3715 18.8516C21.5764 18.6358 21.8231 18.4639 22.0966 18.3465C22.3701 18.229 22.6646 18.1685 22.9622 18.1685C23.2598 18.1685 23.5543 18.229 23.8278 18.3465C24.1013 18.4639 24.348 18.6358 24.5529 18.8516L33.3771 28.8981C33.293 30.261 32.6981 31.542 31.7111 32.4855C30.7241 33.429 29.4177 33.9657 28.0524 33.9884Z"
                        fill="#454545"
                      />
                      <path
                        d="M5.0293 10.1279C5.0293 11.0386 5.29935 11.9289 5.80532 12.6861C6.31129 13.4433 7.03043 14.0335 7.87182 14.382C8.71321 14.7306 9.63906 14.8218 10.5323 14.6441C11.4255 14.4664 12.246 14.0279 12.8899 13.3839C13.5339 12.7399 13.9725 11.9194 14.1501 11.0262C14.3278 10.133 14.2366 9.20717 13.8881 8.36578C13.5396 7.52439 12.9494 6.80524 12.1922 6.29928C11.4349 5.79331 10.5447 5.52326 9.63395 5.52326C8.41272 5.52326 7.24151 6.00839 6.37797 6.87193C5.51443 7.73547 5.0293 8.90668 5.0293 10.1279ZM11.727 10.1279C11.727 10.5419 11.6042 10.9465 11.3742 11.2907C11.1442 11.6349 10.8174 11.9032 10.4349 12.0616C10.0525 12.22 9.63163 12.2615 9.22562 12.1807C8.81961 12.1 8.44667 11.9006 8.15396 11.6079C7.86124 11.3152 7.6619 10.9422 7.58114 10.5362C7.50038 10.1302 7.54183 9.70939 7.70025 9.32694C7.85866 8.94449 8.12693 8.61761 8.47113 8.38762C8.81532 8.15764 9.21999 8.03488 9.63395 8.03488C10.1891 8.03488 10.7214 8.2554 11.1139 8.64792C11.5065 9.04043 11.727 9.5728 11.727 10.1279Z"
                        fill="#454545"
                      />
                      <path
                        d="M24.7041 8.03488H28.4715V11.8023C28.4715 12.1354 28.6038 12.4548 28.8393 12.6903C29.0748 12.9258 29.3942 13.0581 29.7273 13.0581C30.0604 13.0581 30.3798 12.9258 30.6153 12.6903C30.8508 12.4548 30.9831 12.1354 30.9831 11.8023V8.03488H34.7506C35.0836 8.03488 35.4031 7.90258 35.6386 7.66706C35.8741 7.43155 36.0064 7.11213 36.0064 6.77907C36.0064 6.44601 35.8741 6.12659 35.6386 5.89108C35.4031 5.65556 35.0836 5.52326 34.7506 5.52326H30.9831V1.75581C30.9831 1.42275 30.8508 1.10333 30.6153 0.867819C30.3798 0.632309 30.0604 0.5 29.7273 0.5C29.3942 0.5 29.0748 0.632309 28.8393 0.867819C28.6038 1.10333 28.4715 1.42275 28.4715 1.75581V5.52326H24.7041C24.371 5.52326 24.0516 5.65556 23.8161 5.89108C23.5806 6.12659 23.4482 6.44601 23.4482 6.77907C23.4482 7.11213 23.5806 7.43155 23.8161 7.66706C24.0516 7.90258 24.371 8.03488 24.7041 8.03488Z"
                        fill="#454545"
                      />
                    </svg>
                  </label>
                </div>

                <button
                  className=" tradex-capitalize tradex-bg-primary tradex-min-h-12 tradex-flex tradex-justify-center tradex-items-center tradex-rounded tradex-px-5 !tradex-text-white tradex-text-base"
                  type="submit"
                >
                  {t("send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
