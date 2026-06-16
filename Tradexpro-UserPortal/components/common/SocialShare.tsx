import useTranslation from "next-translate/useTranslation";
import React from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  InstapaperIcon,
  InstapaperShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
const SocialShare = (url: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="tradex-space-y-4">
      <p className="tradex-text-xl tradex-leading-7 tradex-text-title tradex-font-bold">
        {t("Share")}
      </p>
      <div className="tradex-bg-background-main tradex-rounded-lg tradex-border tradex-border-background-primary tradex-p-6">
        <div className=" tradex-flex tradex-items-center tradex-justify-between tradex-gap-4 xl:tradex-gap-[30px]">
          <a href="">
            <FacebookShareButton
              url={url}
              quote={"Share on facebook"}
              hashtag="#muo"
            >
              <FacebookIcon
                className=" tradex-w-8 tradex-h-8 md:tradex-w-10 md:tradex-h-10 xl:tradex-w-12 xl:tradex-h-12"
                round
              />
            </FacebookShareButton>
          </a>
          <a href="">
            <TwitterShareButton url={url}>
              <TwitterIcon
                className=" tradex-w-8 tradex-h-8 md:tradex-w-10 md:tradex-h-10 xl:tradex-w-12 xl:tradex-h-12"
                round
              />
            </TwitterShareButton>
          </a>
          <a href="">
            <RedditShareButton url={url}>
              <RedditIcon
                className=" tradex-w-8 tradex-h-8 md:tradex-w-10 md:tradex-h-10 xl:tradex-w-12 xl:tradex-h-12"
                round
              />
            </RedditShareButton>
          </a>
          <a href="">
            <InstapaperShareButton url={url}>
              <InstapaperIcon
                className=" tradex-w-8 tradex-h-8 md:tradex-w-10 md:tradex-h-10 xl:tradex-w-12 xl:tradex-h-12"
                round
              />
            </InstapaperShareButton>
          </a>
          <a href="">
            <WhatsappShareButton url={url}>
              <WhatsappIcon
                className=" tradex-w-8 tradex-h-8 md:tradex-w-10 md:tradex-h-10 xl:tradex-w-12 xl:tradex-h-12"
                round
              />
            </WhatsappShareButton>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
