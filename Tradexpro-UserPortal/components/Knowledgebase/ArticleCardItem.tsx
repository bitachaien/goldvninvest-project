import { formateData } from "common";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const ArticleCardItem = ({ article }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="tradex-py-10 tradex-px-4 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-flex tradex-flex-col tradex-gap-8 tradex-justify-between">
      <div className="tradex-space-y-4">
        <div className=" tradex-flex tradex-gap-4 tradex-items-center">
          <div className=" tradex-min-w-10">
            <img src="/article_img_knowladge.svg" alt="" />
          </div>
          <h5 className=" tradex-text-lg lg:tradex-text-xl tradex-leading-[22px] !tradex-text-title">
            {article?.title}
          </h5>
        </div>
        <div className=" tradex-space-y-1">
          <p className=" tradex-text-xs sm:tradex-text-sm tradex-leading-5 tradex-text-primary">
            {formateData(article?.created_at)}
          </p>
          <p
            className=" tradex-text-xs sm:tradex-text-sm tradex-text-body tradex-line-clamp-5"
            dangerouslySetInnerHTML={{
              __html: article?.description,
            }}
          ></p>
        </div>
      </div>

      <Link href={`/knowledgebase/${article.unique_code}`}>
        <span className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-primary tradex-cursor-pointer tradex-font-bold">
          <span>{t("View more")}</span>
          <FaArrowRight />
        </span>
      </Link>
    </div>
  );
};
