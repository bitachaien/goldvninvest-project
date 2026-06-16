import { formateDateMunite } from "common";
import moment from "moment";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";
import BlogSliderItem from "./BlogSliderItem";
import SectionLoading from "components/common/SectionLoading";
const SliderCover = ({ featuredblogs, loading }: any) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };

  return (
    <div className=" tradex-py-[18px] tradex-px-4 tradex-rounded-lg tradex-bg-background-main tradex-border tradex-border-background-primary">
      {loading ? (
        <SectionLoading />
      ) : (
        <Slider className=" tradex-relative blog-main-slider" {...settings}>
          {featuredblogs?.map((featuredblog: any, index: any) => (
            <BlogSliderItem
              thumbnail={featuredblog?.thumbnail}
              created_at={featuredblog?.created_at}
              title={featuredblog?.title}
              description={featuredblog?.description}
              post_id={featuredblog?.post_id}
              key={index}
            />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default SliderCover;
