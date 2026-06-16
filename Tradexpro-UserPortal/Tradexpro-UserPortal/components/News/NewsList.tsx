import { formateData } from "common";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { getNewsByCategoryApi } from "service/news";
import SectionLoading from "components/common/SectionLoading";
import Slider from "react-slick";
import NewsItem from "./NewsItem";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className="tradex-cursor-pointer tradex-absolute tradex-right-0 tradex-top-0  tradex-flex tradex-justify-center tradex-items-center tradex-min-w-12 tradex-min-h-12 tradex-h-12 tradex-w-12 tradex-rounded-full tradex-bg-primary"
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className=" tradex-stroke-white"
      >
        <path
          d="M4.41064 16.4126L16.4045 4.41876"
          stroke="inherit"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M16.4045 4.41894C13.0133 7.8102 16.5545 11.7652 16.5545 11.7652"
          stroke="inherit"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M9.05664 4.26953C9.05664 4.26953 13.0116 7.81071 16.4029 4.41945"
          stroke="inherit"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      onClick={onClick}
      className=" tradex-cursor-pointer tradex-absolute tradex-right-[66px] tradex-top-0 tradex-flex tradex-justify-center tradex-items-center tradex-min-w-12 tradex-min-h-12 tradex-h-12 tradex-w-12 tradex-rounded-full tradex-bg-background-primary"
    >
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className=" tradex-fill-title"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.4289 5.01742C12.4292 5.0171 12.4296 5.01679 11.7625 4.27179C11.0954 3.52679 11.0958 3.52651 11.0961 3.52624L11.0949 3.52722L11.0729 3.54605C11.0512 3.56432 11.0159 3.59349 10.968 3.63111C10.872 3.70655 10.727 3.81485 10.5417 3.93688C10.1671 4.18346 9.64794 4.47281 9.05064 4.66789C7.89337 5.04587 6.48414 5.07536 5.12339 3.71461L5.12305 3.71495L5.12219 3.71409L5.1221 3.71419L5.12198 3.71407L3.70776 5.12828L3.73525 5.15577C5.06832 6.50801 5.0367 7.90607 4.66126 9.05556C4.46618 9.65285 4.17683 10.1721 3.93025 10.5466C3.80822 10.7319 3.69992 10.8769 3.62449 10.9729C3.58686 11.0208 3.55769 11.0561 3.53942 11.0778L3.5206 11.0998L3.51961 11.101C3.51988 11.1007 3.52016 11.1004 4.26516 11.7674C5.01017 12.4345 5.01048 12.4341 5.0108 12.4338L5.01151 12.433L5.01318 12.4311L5.01748 12.4263L5.02984 12.4121C5.03971 12.4008 5.05281 12.3855 5.06879 12.3666C5.10074 12.3287 5.14433 12.2757 5.19691 12.2088C5.30189 12.0753 5.44375 11.8848 5.60072 11.6464C5.91214 11.1734 6.29612 10.4919 6.56243 9.6765C6.70324 9.24539 6.81069 8.77448 6.85756 8.27808L15.7016 17.1221L17.1158 15.7079L8.27219 6.86428C8.76895 6.81745 9.24019 6.70995 9.67159 6.56906C10.4869 6.30275 11.1684 5.91876 11.6415 5.60734C11.8799 5.45038 12.0703 5.30852 12.2039 5.20354C12.2708 5.15096 12.3238 5.10736 12.3617 5.07542C12.3806 5.05943 12.3959 5.04634 12.4072 5.03647L12.4213 5.0241L12.4262 5.0198L12.4281 5.01814L12.4289 5.01742Z"
          fill="inherit"
        />
      </svg>
    </div>
  );
}

export const NewsList = ({
  recentNewsData,
  setRecentNews,
  categories,
  setLoading,
  loading,
  setLinks,
  setSelected,
  selected,
}: any) => {
  const getNewsByCategory = async (id: any) => {
    setLoading(true);
    setSelected(id);
    const CategoryNews = await getNewsByCategoryApi(id, 0, 5, 1);
    setRecentNews(CategoryNews?.data?.data);
    setLinks(CategoryNews?.data?.links);
    setLoading(false);
  };
  const { t } = useTranslation("common");

  const settings = {
    dots: false,
    infinite: categories?.length > 8,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1124,
        infinite: categories?.length > 4,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          infinite: categories?.length > 3,
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 460,
        settings: {
          infinite: categories?.length > 1,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Slider
        className=" blog-tab-section tradex-pr-[130px] tradex-relative"
        {...settings}
      >
        {categories?.map((category: any, index: any) => (
          <p
            key={index}
            onClick={() => {
              getNewsByCategory(category?.id);
            }}
            className={`${
              category?.id === selected
                ? "!tradex-text-primary tradex-border-b-2 tradex-border-primary"
                : "!tradex-text-title"
            }  tradex-text-nowrap tradex-text-ellipsis tradex-pb-3 tradex-text-base !tradex-leading-[22px]  tradex-font-medium tradex-cursor-pointer`}
          >
            {category?.title}
          </p>
        ))}
      </Slider>
      <div>
        {loading ? (
          <SectionLoading />
        ) : (
          <div>
            <div className=" tradex-grid md:tradex-grid-cols-2 tradex-gap-6">
              {recentNewsData.length > 0 &&
                recentNewsData?.map((list: any, index: any) => (
                  <NewsItem
                    post_id={list?.post_id}
                    thumbnail={list?.thumbnail}
                    created_at={list?.created_at}
                    title={list?.title}
                    description={list?.description}
                    key={index}
                  />
                ))}
            </div>

            {recentNewsData.length === 0 && loading === false && (
              <div className="newsLoadingContainer">
                <NoItemFound />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
