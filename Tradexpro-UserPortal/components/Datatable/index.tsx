import SectionLoading from "components/common/SectionLoading";
import CustomPagination from "components/Pagination/CustomPagination";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useTable, useSortBy, useGlobalFilter } from "react-table";

const CustomDataTable = ({
  columns,
  data,
  Links,
  setSelectedLimit,
  selectedLimit,
  paginateFunction,
  paginate = true,
  search,
  setSearch,
  dataNotFoundText,
  processing,
  verticalAlignData = "middle",
  isOverflow = false,
  isSearchable = true,
  paginateData = null,
}: any) => {
  const dataColumns = useMemo(() => columns, [columns]);
  const tableData = useMemo(() => data, [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    //@ts-ignore
    setGlobalFilter,
  } = useTable(
    {
      columns: dataColumns,
      data: tableData,
    },
    useGlobalFilter,
    useSortBy
  );
  const { t } = useTranslation("common");

  const { globalFilter }: any = state;

  return (
    <div className="overflow-x-auto px-2">
      <div id="assetBalances_wrapper" className="dataTables_wrapper no-footer">
        <div className="dataTables_head">
          <div className="dataTables_length" id="assetBalances_length">
            <label className="">
              {t("Show")}
              <select
                name="assetBalances_length"
                aria-controls="assetBalances"
                className="h-auto text-14"
                placeholder="10"
                onChange={(e) => {
                  setSelectedLimit(e.target.value);
                }}
                value={selectedLimit}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </label>
          </div>
          {isSearchable && (
            <div id="table_filter" className="dataTables_filter_class">
              <label className=" tradex-flex tradex-items-center">
                <AiOutlineSearch />
                <input
                  type="search"
                  className="data_table_input bg-transparent"
                  aria-controls="table"
                  placeholder={t("Search...")}
                  value={search || ""}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      </div>
      {processing ? (
        <SectionLoading />
      ) : (
        <>
          <table {...getTableProps()} className=" tradex-w-full tradex-mb-6">
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={index}
                  className="tradex-h-[44px]"
                >
                  {headerGroup.headers.map((column: any, key: number) => (
                    <th
                      key={key}
                      {...column.getHeaderProps(column.getSortByToggleProps())} // Add sorting props to the column header
                      className=" !tradex-px-3 !tradex-bg-background-main !tradex-text-nowrap first:!tradex-rounded-l-md last:!tradex-rounded-r-md"
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <i className="fa fa-caret-down" />
                          ) : (
                            <i className="fa fa-caret-up" />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.length > 0 && (
                <>
                  {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={index}
                        className="tradex-border-b tradex-h-[44px] tradex-border-border-one"
                      >
                        {row.cells.map((cell, key) => (
                          <td
                            //@ts-ignore
                            key={key}
                            {...cell.getCellProps()}
                            style={{
                              verticalAlign: verticalAlignData,
                            }}
                            className={`${
                              isOverflow ? "" : "overflow-hidden"
                            }  !tradex-px-3 tradex-py-5 tradex-max-w-[200px] !tradex-text-nowrap tradex-text-ellipsis  !tradex-bg-background-card first:!tradex-rounded-l-md last:!tradex-rounded-r-md`}
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
          {rows.length == 0 && (
            <div className="p-3 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="tradex-mx-auto tradex-h-20 tradex-w-20 tradex-text-muted-400"
                width="1em"
                height="1em"
                viewBox="0 0 48 48"
              >
                <circle
                  cx="27.569"
                  cy="23.856"
                  r="7.378"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></circle>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m32.786 29.073l1.88 1.88m-1.156 1.155l2.311-2.312l6.505 6.505l-2.312 2.312z"
                ></path>
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M43.5 31.234V12.55a3.16 3.16 0 0 0-3.162-3.163H7.662A3.16 3.16 0 0 0 4.5 12.55v18.973a3.16 3.16 0 0 0 3.162 3.162h22.195"
                ></path>
              </svg>
              <p className="tradex-text-base tradex-font-medium">{`${
                dataNotFoundText ?? "No Item Found"
              } `}</p>
            </div>
          )}
        </>
      )}

      {paginate === true && paginateData && tableData?.length > 0 && (
        // <div className="pagination-wrapper" id="assetBalances_paginate">
        //   <span>
        //     {Links?.map((link: any, index: number) =>
        //       link.label === "&laquo; Previous" ? (
        //         <a
        //           className="paginate-button"
        //           onClick={() => {
        //             if (link.url) paginateFunction(link);
        //           }}
        //           key={index}
        //         >
        //           <i className="fa fa-angle-left"></i>
        //         </a>
        //       ) : link.label === "Next &raquo;" ? (
        //         <a
        //           className="paginate-button"
        //           onClick={() => paginateFunction(link)}
        //           key={index}
        //         >
        //           <i className="fa fa-angle-right"></i>
        //         </a>
        //       ) : (
        //         <a
        //           className={`paginate_button paginate-number ${
        //             link.active === true && "text-warning"
        //           }`}
        //           aria-controls="assetBalances"
        //           data-dt-idx="1"
        //           onClick={() => paginateFunction(link)}
        //           key={index}
        //         >
        //           {link.label}
        //         </a>
        //       )
        //     )}
        //   </span>
        // </div>
        <CustomPagination
          per_page={paginateData?.per_page}
          current_page={paginateData?.current_page}
          total={paginateData?.total}
          from={paginateData?.from}
          to={paginateData?.to}
          handlePageClick={paginateFunction}
        />
      )}
    </div>
  );
};

export default CustomDataTable;
