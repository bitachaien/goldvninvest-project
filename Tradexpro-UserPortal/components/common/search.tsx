import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdOutlineSearch } from "react-icons/md";
import OutsideClickHandler from "react-outside-click-handler";

export const Search = ({ searchFunction, linkName }: any) => {
  const { t } = useTranslation("common");

  const [suggestions, setSuggestions] = useState(true);
  const [results, setResults] = useState([]);
  const onSearch = async (e: any) => {
    if (!e.target.value) {
      setResults([]);
      return;
    }
    const response = await searchFunction(e.target.value);
    setResults(response?.data);
    setSuggestions(true);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setSuggestions(false)}>
      <div className=" tradex-relative">
        <div className=" tradex-w-full tradex-flex tradex-items-center tradex-rounded tradex-border tradex-border-background-primary tradex-bg-background-main tradex-min-h-[52px]">
          <input
            type="text"
            onChange={onSearch}
            placeholder={t("Search...")}
            className=" tradex-px-4 tradex-w-full tradex-min-h-12 !tradex-border-0 !tradex-bg-transparent tradex-text-body"
          />
          <button className=" tradex-rounded-tr tradex-rounded-br tradex-min-w-[52px] tradex-min-h-[52px] tradex-bg-primary tradex-text-white tradex-flex tradex-justify-center tradex-items-center">
            <MdOutlineSearch size={24} />
          </button>
        </div>
        {suggestions && (
          <div className="suggestions rounded">
            {results?.map((item: any) => (
              <Link key={item.post_id} href={`/${linkName}/` + item.post_id}>
                <p className="px-2 suggestionsList" key={item.title}>
                  {item.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};
