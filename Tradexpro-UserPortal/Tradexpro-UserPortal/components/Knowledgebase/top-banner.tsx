import { Search } from "components/common/search";
import Link from "next/link";
import { useState } from "react";
import { knowledgebaseArticleSearchAction } from "state/actions/knowlegdgbase";
import OutsideClickHandler from "react-outside-click-handler";
import PlaceBottomRight from "components/gradient/placeBottomRight";
import PlaceTopLeft from "components/gradient/placeTopLeft";

export const TopBanner = ({ resorce }: any) => {
  const [suggestions, setSuggestions] = useState(true);

  const [lists, setLists] = useState([]);

  return (
    <section
      className="bg-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: resorce?.cover_image
          ? `url(${resorce?.cover_image})`
          : "url(https://images.unsplash.com/photo-1620207418302-439b387441b0?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <PlaceTopLeft />
      <div className="container">
        <div className="row">
          <div className="col-12 text-center text-white mt-5 pt-5">
            <h1 className="text-white">
              {resorce?.knowledgebase_page_cover_first_title
                ? resorce?.knowledgebase_page_cover_first_title
                : "How can we help you ?"}
            </h1>
          </div>
          <div className="col-md-6 mx-auto pb-5">
            <OutsideClickHandler onOutsideClick={() => setSuggestions(false)}>
              <form>
                <div className="input-group my-3 mx-auto pb-5">
                  <div className="d-flex w-100 rounded top_search">
                    <input
                      className="w-100 px-2 py-2 rounded-pill border-0"
                      type="text"
                      name="notes"
                      onChange={(e: any) => {
                        knowledgebaseArticleSearchAction(
                          e.target.value,
                          setLists
                        );
                        setSuggestions(true);
                      }}
                    />
                  </div>

                  {suggestions && (
                    <div
                      className="search-filter ps-1 rounded"
                      id="append-search-result"
                    >
                      {lists.map((list: any, index: number) => (
                        <Link
                          key={index}
                          href={"/knowledgebase/" + list.unique_code}
                        >
                          <a href="">{list?.title}</a>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </OutsideClickHandler>
          </div>
          <PlaceBottomRight />
        </div>
      </div>
    </section>
  );
};
