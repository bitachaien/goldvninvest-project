import useTranslation from "next-translate/useTranslation";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ReactPaginate from "react-paginate";

export default function CustomPagination({
  handlePageClick,
  current_page,
  total,
  per_page = 15,
  page_range_displayed = 2,
  margin_range_displayed = 1,
  className = "",
}: any) {
  const { t } = useTranslation("common");
  if (!total) return <></>;
  return (
    <div
      className={` tradex-flex tradex-flex-col sm:tradex-flex-row tradex-items-center tradex-justify-end tradex-gap-6 tradex-py-2.5 ${className}`}
    >
      <div>
        <ReactPaginate
          nextLabel={<MdChevronRight />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={page_range_displayed}
          breakLabel={<BsThreeDots />}
          marginPagesDisplayed={margin_range_displayed}
          pageCount={Math.ceil(total / per_page)}
          previousLabel={<MdChevronLeft />}
          renderOnZeroPageCount={null}
          className={` tradex-flex tradex-items-center tradex-justify-center tradex-gap-2`}
          pageLinkClassName={`!tradex-w-7 !tradex-min-h-7 sm:!tradex-min-w-9 sm:!tradex-min-h-9 tradex-inline-block tradex-text-sm sm:tradex-text-lg tradex-text-primary tradex-flex tradex-items-center tradex-justify-center !tradex-rounded-lg tradex-border tradex-border-primary`}
          activeLinkClassName={`!tradex-bg-primary !tradex-text-white !tradex-font-bold`}
          previousLinkClassName={`!tradex-w-7 !tradex-min-h-7 sm:!tradex-min-w-9 sm:!tradex-min-h-9 tradex-inline-block tradex-text-lg sm:tradex-text-2xl tradex-text-primary tradex-flex tradex-items-center tradex-justify-center !tradex-rounded-lg`}
          nextLinkClassName={`!tradex-w-7 !tradex-min-h-7 sm:!tradex-min-w-9 sm:!tradex-min-h-9 tradex-inline-block tradex-text-lg sm:tradex-text-2xl tradex-text-primary tradex-flex tradex-items-center tradex-justify-center !tradex-rounded-lg`}
          breakLinkClassName={`!tradex-w-7 !tradex-min-h-7 sm:!tradex-min-w-9 sm:!tradex-min-h-9 tradex-inline-block tradex-text-lg sm:tradex-text-2xl tradex-text-primary tradex-flex tradex-items-center tradex-justify-center !tradex-rounded-lg tradex-border tradex-border-primary`}
          forcePage={current_page - 1}
        />
      </div>
    </div>
  );
}
