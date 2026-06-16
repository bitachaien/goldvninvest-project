import React from "react";
import BlogCard from "./Card";
import { NoItemFound } from "components/NoItemFound/NoItemFound";
import SectionLoading from "components/common/SectionLoading";

const CardSection = ({ blogs, loading }: any) => {
  if (loading) return <SectionLoading />;
  return (
    <>
      <div className=" tradex-grid md:tradex-grid-cols-2 lg:tradex-grid-cols-3 tradex-gap-6">
        {blogs.map((blog: any, index: any) => (
          <BlogCard blog={blog} key={index} />
        ))}
      </div>
      {blogs.length === 0 && loading === false && <NoItemFound />}
    </>
  );
};

export default CardSection;
