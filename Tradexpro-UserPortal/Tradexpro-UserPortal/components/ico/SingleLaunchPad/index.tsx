import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SingleLaunchpadFormItem from "./SingleLaunchpadFormItem";

export const SingleLaunchPad = ({ data }: any) => {
  const { t } = useTranslation("common");
  const [socialLink, setSocialLink] = useState<any>({});
  useEffect(() => {
    data?.social_link && setSocialLink(JSON.parse(data?.social_link));
  }, [data?.social_link]);

  console.log("SingleLaunchPad", data);

  return (
    <>
      <div className=" tradex-flex tradex-flex-col lg:tradex-flex-row tradex-gap-6">
        <div className=" tradex-space-y-4 lg:tradex-min-w-[536px] lg:tradex-max-w-[536px]">
          <div>
            <img
              src={data?.image ? data?.image : "/launchpad.png"}
              className=" tradex-max-h-[300px] tradex-rounded-lg tradex-w-full"
              alt=""
            />
          </div>
          <div className=" tradex-space-y-3">
            <p className=" tradex-text-xl tradex-leading-6 md:tradex-text-2xl md:tradex-leading-[30px] tradex-text-title tradex-font-semibold">
              {t("Details Rule")}
            </p>
            <div className=" tradex-rounded tradex-border tradex-border-background-primary tradex-p-3 tradex-min-h-[100px]">
              <p className=" tradex-text-sm tradex-leading-4 md:tradex-text-base md:tradex-leading-[22px] tradex-text-body">
                {data?.details_rule}
              </p>
            </div>
          </div>
        </div>
        <div className=" tradex-w-full tradex-space-y-4">
          <div className=" tradex-space-y-3 tradex-pb-3 tradex-border-b tradex-border-background-primary">
            <div className=" tradex-flex tradex-gap-2 tradex-items-start">
              <p className=" tradex-text-2xl tradex-leading-[30px] tradex-font-semibold tradex-text-title ">
                {data?.token_name}
              </p>
              <span className=" tradex-block tradex-mt-1">
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.7158 7L13.0499 5.15042L13.3108 2.6743L10.8748 2.15859L9.6322 0L7.35793 1.0164L5.08365 0L3.84106 2.15859L1.40509 2.6743L1.6659 5.15042L0 7L1.66587 8.84958L1.40506 11.3257L3.84104 11.8414L5.08363 14L7.3579 12.9836L9.63217 14L10.8748 11.8414L13.3107 11.3257L13.0499 8.84958L14.7158 7ZM10.4425 5.38892L6.74915 9.52682L4.18265 6.96032L4.79309 6.34987L6.7135 8.27027L9.79848 4.81404L10.4425 5.38892Z"
                    className=" tradex-fill-primary"
                  />
                </svg>
              </span>
            </div>
            <div className=" tradex-flex tradex-gap-6 tradex-items-center">
              {data?.website_link && (
                <a
                  href={`${
                    data?.website_link?.startsWith("http://") ||
                    data?.website_link?.startsWith("https://")
                      ? data.website_link
                      : `https://${data?.website_link}`
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className=" tradex-flex tradex-gap-1 tradex-items-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.4684 14.2339C11.2859 14.0508 11.2859 13.7539 11.4697 13.5708C11.6522 13.3877 11.9503 13.3883 12.1328 13.5714C12.6434 14.0826 13.2577 14.2695 13.7577 13.7595C14.1683 13.3545 14.1596 12.7089 13.7646 12.3121L11.819 10.3621C11.4147 9.95528 10.8216 10.0203 10.5503 10.224C10.3435 10.3803 10.0497 10.3371 9.89411 10.1309C9.73849 9.92403 9.78036 9.63029 9.98723 9.47467C10.6247 8.99531 11.7328 8.94781 12.4828 9.69966L14.4283 11.6502C15.1933 12.4177 15.192 13.6601 14.4214 14.422C13.6702 15.1863 12.4896 15.2576 11.4684 14.2339Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M10.4083 7.63812C10.5908 7.82124 10.5908 8.1181 10.407 8.30122C10.2245 8.48434 9.92642 8.48372 9.74392 8.3006C9.23332 7.78936 8.61897 7.6025 8.11898 8.11248C7.70837 8.51746 7.71712 9.16307 8.11211 9.55993L10.0577 11.5099C10.462 11.9167 11.0551 11.8517 11.3264 11.648C11.5332 11.4917 11.827 11.5349 11.9826 11.7411C12.1382 11.948 12.0963 12.2417 11.8895 12.3973C11.252 12.8767 10.1439 12.9242 9.39394 12.1723L7.44838 10.2218C6.68341 9.4543 6.68466 8.21185 7.45526 7.45C8.20585 6.68565 9.38706 6.61503 10.4083 7.63812Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M7.49973 14.9995C3.36425 14.9995 0 11.6352 0 7.49973C0 3.36425 3.36425 0 7.49973 0C11.6352 0 14.9995 3.36425 14.9995 7.49973C14.9995 8.23158 14.8963 8.9453 14.692 9.62216C14.6176 9.87027 14.3582 10.0103 14.1076 9.93589C13.8601 9.8609 13.7195 9.59966 13.7945 9.35154C13.972 8.76281 14.062 8.13971 14.062 7.49973C14.062 3.88111 11.1184 0.937466 7.49973 0.937466C3.88111 0.937466 0.937466 3.88111 0.937466 7.49973C0.937466 11.1184 3.88111 14.062 7.49973 14.062C7.75847 14.062 7.96846 14.272 7.96846 14.5307C7.96846 14.7895 7.75847 14.9995 7.49973 14.9995Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M7.49946 14.9995C5.35079 14.9995 3.66772 11.7052 3.66772 7.49973C3.66772 3.29426 5.35141 0 7.49946 0C9.36815 0 10.9156 2.48179 11.2612 6.03603L10.7943 6.08728L10.3256 6.08103C10.04 3.16801 8.82379 0.937466 7.49946 0.937466C6.10201 0.937466 4.60519 3.57425 4.60519 7.49973C4.60519 11.4252 6.10201 14.062 7.49946 14.062C7.7582 14.062 7.9682 14.272 7.9682 14.5307C7.9682 14.7895 7.7582 14.9995 7.49946 14.9995Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M7.49974 5.97479C7.241 5.97479 7.03101 5.7648 7.03101 5.50606V0.624983C7.03101 0.366242 7.241 0.15625 7.49974 0.15625C7.75848 0.15625 7.96847 0.366242 7.96847 0.624983V5.50606C7.96847 5.7648 7.75848 5.97479 7.49974 5.97479Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M1.24976 3.74902H13.7493V4.68649H1.24976V3.74902Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M5.49981 7.96969H0.624983C0.366242 7.96969 0.15625 7.7597 0.15625 7.50096C0.15625 7.24222 0.366242 7.03223 0.624983 7.03223H5.49981C5.75855 7.03223 5.96854 7.24222 5.96854 7.50096C5.96854 7.7597 5.75855 7.96969 5.49981 7.96969Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M14.3748 7.96969H12.3498C12.0911 7.96969 11.8811 7.7597 11.8811 7.50096C11.8811 7.24222 12.0911 7.03223 12.3498 7.03223H14.3748C14.6335 7.03223 14.8435 7.24222 14.8435 7.50096C14.8435 7.7597 14.6335 7.96969 14.3748 7.96969Z"
                        className="tradex-fill-body"
                      />
                      <path
                        d="M7.49974 14.8427C7.241 14.8427 7.03101 14.6327 7.03101 14.3739V12.374C7.03101 12.1153 7.241 11.9053 7.49974 11.9053C7.75848 11.9053 7.96847 12.1153 7.96847 12.374V14.3739C7.96847 14.6327 7.75848 14.8427 7.49974 14.8427Z"
                        className="tradex-fill-body"
                      />
                    </svg>

                    <p className=" tradex-text-sm tradex-leading-4 tradex-text-body tradex-underline">
                      {t("Website Link")}
                    </p>
                  </div>
                </a>
              )}
              {data?.video_link && (
                <a
                  href={`${
                    data?.video_link?.startsWith("http://") ||
                    data?.video_link?.startsWith("https://")
                      ? data.video_link
                      : `https://${data?.video_link}`
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className=" tradex-flex tradex-gap-1 tradex-items-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.84448 12.1875H12.657V13.125H9.84448V12.1875Z"
                        className=" tradex-fill-body"
                      />
                      <path
                        d="M8.43823 12.6562C8.43823 11.8594 9.04761 11.25 9.84448 11.25H10.782V10.3125H9.84448C8.53198 10.3125 7.50073 11.3438 7.50073 12.6562C7.50073 13.9688 8.53198 15 9.84448 15H10.782V14.0625H9.84448C9.04761 14.0625 8.43823 13.4531 8.43823 12.6562Z"
                        className=" tradex-fill-body"
                      />
                      <path
                        d="M12.657 10.3125H11.7195V11.25H12.657C13.4539 11.25 14.0632 11.8594 14.0632 12.6562C14.0632 13.4531 13.4539 14.0625 12.657 14.0625H11.7195V15H12.657C13.9695 15 15.0007 13.9688 15.0007 12.6562C15.0007 11.3438 13.9695 10.3125 12.657 10.3125Z"
                        className=" tradex-fill-body"
                      />
                      <path
                        d="M2.34448 0.9375H8.90698V4.6875H12.657V8.90625H13.5945V4.03125L9.56323 0H1.40698V1.875H0.000732422V10.3125H1.40698V15H7.03198V14.0625H2.34448V10.3125H7.50073V1.875H2.34448V0.9375ZM9.84448 1.59375L12.0007 3.75H9.84448V1.59375ZM6.56323 2.8125V9.375H0.938232V2.8125H1.40698H2.34448H6.56323Z"
                        className=" tradex-fill-body"
                      />
                      <path
                        d="M2.34448 8.29688L6.46948 6.09375L2.34448 3.89062V8.29688ZM3.28198 5.48437L4.45386 6.09375L3.28198 6.70312V5.48437Z"
                        className=" tradex-fill-body"
                      />
                    </svg>

                    <p className=" tradex-text-sm tradex-leading-4 tradex-text-body tradex-underline">
                      {t("Video Link")}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
          <div className=" tradex-space-y-8">
            <div className=" tradex-space-y-6">
              {/* token details */}
              <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-x-6 tradex-gap-y-4 tradex-pb-6 tradex-border-b tradex-border-background-primary">
                <SingleLaunchpadFormItem
                  title={`Sale Price`}
                  content={`1 ${data?.coin_type} = ${data?.coin_price} ${data?.coin_currency}`}
                />
                <SingleLaunchpadFormItem
                  title={`Tokens Offered`}
                  content={`${parseFloat(data?.total_token_supply)} ${
                    data?.coin_type
                  }`}
                />
                <SingleLaunchpadFormItem
                  title={`Token Sold`}
                  content={`${
                    data?.sold_phase_tokens ? data?.sold_phase_tokens : "0"
                  } ${data?.coin_type}`}
                />
                <SingleLaunchpadFormItem
                  title={`Token Available`}
                  content={`${
                    parseFloat(data?.total_token_supply) -
                    parseFloat(data?.sold_phase_tokens)
                  } ${data?.coin_type}`}
                />
                <SingleLaunchpadFormItem
                  title={`Participants`}
                  content={`${parseFloat(
                    data?.total_participated ? data?.total_participated : 0
                  )}`}
                />
                <SingleLaunchpadFormItem
                  title={`Base Coin`}
                  content={data?.base_coin}
                />
                <SingleLaunchpadFormItem
                  title={`Token Type`}
                  content={data?.network}
                />
                {data?.ico_phase_additional_details.length > 0 && (
                  <div className=" tradex-col-span-2 tradex-space-y-6 tradex-pt-2">
                    <div className=" tradex-col-span-2 tradex-pb-4 tradex-border-b tradex-border-background-primary">
                      <h6 className=" tradex-text-2xl !tradex-text-title">
                        {t("Additional information")}
                      </h6>
                    </div>

                    <div className=" tradex-grid sm:tradex-grid-cols-2 tradex-gap-6 ">
                      {data?.ico_phase_additional_details.map(
                        (item: any, index: any) => (
                          <SingleLaunchpadFormItem
                            title={item?.title}
                            content={item.value}
                            key={index}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link href={`/ico/payment/${data?.token_id}/${data?.id}`}>
                <a className="primary-btn !tradex-text-white">{t("Buy now")}</a>
              </Link>
            </div>

            {/* for social network */}
            <div className=" tradex-space-y-4">
              <div className=" tradex-flex tradex-items-center tradex-gap-2">
                <h4 className=" tradex-text-xl tradex-leading-[26px] !tradex-text-title tradex-font-semibold">
                  {t("Social Channels")}
                </h4>
                <div className="tradex-w-[48px] tradex-h-[2px] tradex-bg-title"></div>
              </div>
              <div className=" tradex-flex tradex-gap-4 tradex-items-center">
                {socialLink?.Facebook && (
                  <div className=" tradex-w-[47px] tradex-h-[47px] tradex-rounded-full tradex-bg-background-primary tradex-flex tradex-justify-center tradex-items-center">
                    <a
                      href={`${
                        socialLink?.Facebook?.startsWith("http://") ||
                        socialLink?.Facebook?.startsWith("https://")
                          ? socialLink?.Facebook
                          : `https://${socialLink?.Facebook}`
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="12"
                        height="22"
                        viewBox="0 0 12 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.49284 21.3255V12.634H0.591553V8.76925H3.49284V5.46825C3.49284 2.87429 5.20664 0.492188 9.15559 0.492188C10.7545 0.492188 11.9368 0.642138 11.9368 0.642138L11.8436 4.25116C11.8436 4.25116 10.6378 4.23968 9.32208 4.23968C7.89803 4.23968 7.66988 4.88169 7.66988 5.94727V8.76925H11.9568L11.7703 12.634H7.66988V21.3255H3.49284Z"
                          className=" tradex-fill-title"
                        />
                      </svg>
                    </a>
                  </div>
                )}
                {socialLink?.Twitter && (
                  <div className="tradex-w-[47px] tradex-h-[47px] tradex-rounded-full tradex-bg-background-primary tradex-flex tradex-justify-center tradex-items-center">
                    <a
                      href={`${
                        socialLink?.Twitter?.startsWith("http://") ||
                        socialLink?.Twitter?.startsWith("https://")
                          ? socialLink?.Twitter
                          : `https://${socialLink?.Twitter}`
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="22"
                        height="18"
                        viewBox="0 0 22 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.03 2.57658C20.2759 2.91066 19.4659 3.13639 18.6143 3.23842C19.493 2.71273 20.1504 1.88536 20.4638 0.910684C19.6383 1.40096 18.7348 1.74607 17.7926 1.93099C17.159 1.25458 16.3198 0.806239 15.4052 0.655584C14.4907 0.504929 13.5519 0.660385 12.7348 1.09782C11.9177 1.53525 11.2678 2.23018 10.8862 3.07473C10.5045 3.91927 10.4124 4.86617 10.6242 5.76842C8.95145 5.68445 7.31507 5.24973 5.82125 4.4925C4.32742 3.73527 3.00953 2.67244 1.95311 1.37298C1.59189 1.996 1.38419 2.71834 1.38419 3.48763C1.38379 4.18017 1.55435 4.8621 1.88076 5.47292C2.20716 6.08374 2.67931 6.60456 3.2553 6.98918C2.5873 6.96792 1.93403 6.78745 1.34987 6.46277V6.51695C1.34981 7.48826 1.68584 8.42968 2.30095 9.18147C2.91606 9.93327 3.77236 10.4491 4.72456 10.6415C4.10488 10.8092 3.45518 10.8339 2.82455 10.7137C3.0932 11.5495 3.61652 12.2803 4.32123 12.8039C5.02595 13.3276 5.87678 13.6177 6.75461 13.6338C5.26444 14.8035 3.42407 15.4379 1.52958 15.4351C1.19399 15.4352 0.858684 15.4156 0.525391 15.3764C2.44841 16.6127 4.68694 17.2688 6.97315 17.2663C14.7123 17.2663 18.9431 10.8573 18.9431 5.2989C18.9431 5.11831 18.9385 4.93592 18.9304 4.75534C19.7533 4.16029 20.4637 3.42343 21.0282 2.57929L21.03 2.57658Z"
                          className=" tradex-fill-title"
                        />
                      </svg>
                    </a>
                  </div>
                )}
                {socialLink?.Linkedin && (
                  <div className="tradex-w-[47px] tradex-h-[47px] tradex-rounded-full tradex-bg-background-primary tradex-flex tradex-justify-center tradex-items-center">
                    <a
                      href={`${
                        socialLink?.Linkedin?.startsWith("http://") ||
                        socialLink?.Linkedin?.startsWith("https://")
                          ? socialLink?.Linkedin
                          : `https://${socialLink?.Linkedin}`
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.1874 18.4373V11.8449C18.1874 8.60487 17.4899 6.12988 13.7099 6.12988C11.8874 6.12988 10.6724 7.11988 10.1774 8.06487H10.1324V6.42238H6.55493V18.4373H10.2899V12.4748C10.2899 10.8999 10.5824 9.39236 12.5174 9.39236C14.4299 9.39236 14.4524 11.1699 14.4524 12.5648V18.4148H18.1874V18.4373Z"
                          className=" tradex-fill-title"
                        />
                        <path
                          d="M0.480225 6.42188H4.2152V18.4368H0.480225V6.42188Z"
                          className=" tradex-fill-title"
                        />
                        <path
                          d="M2.34773 0.4375C1.15524 0.4375 0.187744 1.40499 0.187744 2.59749C0.187744 3.78998 1.15524 4.77998 2.34773 4.77998C3.54023 4.77998 4.50772 3.78998 4.50772 2.59749C4.50772 1.40499 3.54023 0.4375 2.34773 0.4375Z"
                          className=" tradex-fill-title"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
