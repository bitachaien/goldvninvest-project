import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export const KnowledgeCard = (subCategory: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="tradex-py-10 tradex-px-4 tradex-border tradex-border-background-primary tradex-rounded-lg tradex-flex tradex-flex-col tradex-gap-8 tradex-justify-between">
      <div className=" tradex-space-y-6">
        <div className=" tradex-flex tradex-gap-4 tradex-items-center">
          <div className=" tradex-min-w-10">
            <img src="/knowladgebaseimg.svg" alt="" />
          </div>
          <h5 className=" tradex-text-lg lg:tradex-text-xl tradex-leading-[22px] !tradex-text-title">
            {subCategory.subCategory?.name} (
            {subCategory.subCategory?.knb_articles?.length})
          </h5>
        </div>
        <div className="tradex-flex tradex-flex-col tradex-gap-y-2">
          {subCategory.subCategory?.knb_articles.map(
            (article: any, index: any) => (
              <Link href={"/knowledgebase/" + article.unique_code} key={index}>
                <div className=" tradex-flex tradex-gap-2 tradex-items-start">
                  <div className="tradex-min-w-5">
                    <img
                      src="/article_img_knowladge.svg"
                      className=" tradex-max-w-5"
                      alt=""
                    />
                  </div>

                  <span className=" tradex-text-sm lg:tradex-text-base tradex-leading-6 tradex-font-medium tradex-text-title hover:tradex-text-primary tradex-cursor-pointer">
                    {article?.title}
                  </span>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
      <Link
        href={
          "/knowledgebase/article-list/" + subCategory.subCategory.unique_code
        }
      >
        <span className=" tradex-flex tradex-gap-2 tradex-items-center tradex-text-primary tradex-cursor-pointer tradex-font-bold">
          <span>
            {" "}
            {`${subCategory.subCategory?.knb_articles?.length} Articles`}
          </span>
          <FaArrowRight />
        </span>
      </Link>
    </div>
  );
};
