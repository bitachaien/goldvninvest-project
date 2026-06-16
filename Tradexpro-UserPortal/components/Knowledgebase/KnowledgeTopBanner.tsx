import { Search } from "components/common/search";
import Link from "next/link";
import { useState } from "react";
import { knowledgebaseArticleSearchAction } from "state/actions/knowlegdgbase";
import OutsideClickHandler from "react-outside-click-handler";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";
import useTranslation from "next-translate/useTranslation";

export const KnowledgeTopBanner = ({ resorce }: any) => {
  const { t } = useTranslation("common");
  const [suggestions, setSuggestions] = useState(true);

  const [lists, setLists] = useState([]);

  return (
    <div className=" tradex-max-w-[723px] tradex-mx-auto tradex-text-center tradex-space-y-8">
      <h2 className=" tradex-text-[32px] !tradex-leading-[48px] xl:tradex-text-[40px] xl:tradex-leading-[54px] !tradex-text-title">
        {resorce?.knowledgebase_page_cover_first_title
          ? resorce?.knowledgebase_page_cover_first_title
          : "How can we help you ?"}
      </h2>
      <OutsideClickHandler onOutsideClick={() => setSuggestions(false)}>
        <form>
          <div className=" tradex-relative">
            <input
              className="tradex-block tradex-min-h-12 tradex-w-full tradex-px-2.5 tradex-py-1.5 !tradex-border !tradex-border-background-primary tradex-rounded-lg !tradex-bg-background-main"
              type="text"
              name="notes"
              placeholder={t("Search here..")}
              onChange={(e: any) => {
                knowledgebaseArticleSearchAction(e.target.value, setLists);
                setSuggestions(true);
              }}
            />

            {suggestions && lists?.length > 0 && (
              <div
                className=" tradex-absolute tradex-top-full tradex-z-[100] tradex-border tradex-border-background-primary tradex-w-full tradex-bg-background-main tradex-rounded-lg tradex-p-4 tradex-flex tradex-flex-col tradex-gap-2 tradex-justify-start"
                id="append-search-result"
              >
                {lists.map((list: any, index: number) => (
                  <Link key={index} href={"/knowledgebase/" + list.unique_code}>
                    <a
                      href=""
                      className=" tradex-text-base tradex-leading-[22px] tradex-text-body !tradex-text-left hover:tradex-text-primary"
                    >
                      {list?.title}
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </form>
      </OutsideClickHandler>
    </div>
  );
};
