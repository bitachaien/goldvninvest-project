import SectionLoading from "components/common/SectionLoading";
import CustomPagination from "components/Pagination/CustomPagination";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { NoItemFound } from "./NoItemFound/NoItemFound";

const CustomDatatable = ({
  columns,
  data,
  setSelectedLimit,
  selectedLimit,
  search,
  setSearch,
  dataNotFoundText,
  processing,
  verticalAlignData = "middle",
  isOverflow = false,
  isSortEnable = true,
  isSearchable = true,
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

  return (
    <div className="overflow-x-auto">
      <div className=" tradex-flex tradex-justify-between tradex-items-center tradex-gap-6">
        {isSortEnable && (
          <div className="dataTables_length" id="assetBalances_length">
            <label className="">
              {t("Show")}
              <select
                name="assetBalances_length"
                aria-controls="assetBalances"
                className="h-auto text-14"
                placeholder={t("10")}
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
        )}

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
      {processing ? (
        <SectionLoading />
      ) : (
        <>
          <table
            {...getTableProps()}
            className="tradex-w-full tradex-bg-background-main tradex-rounded-lg tradex-overflow-hidden  tradex-border-separate tradex-border-spacing-y-2"
          >
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={index}
                  className=" tradex-bg-background-primary "
                >
                  {headerGroup.headers.map((column: any, key: number) => (
                    <th
                      key={key}
                      {...column.getHeaderProps(column.getSortByToggleProps())} // Add sorting props to the column header
                      className=" first:tradex-rounded-tl-lg last:tradex-rounded-tr-lg tradex-min-w-[200px] tradex-py-3 tradex-px-4 first:tradex-pl-9 last:tradex-pr-9 tradex-text-nowrap tradex-text-base tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-h-[60px]"
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
                        className="tradex-group hover:tradex-shadow-[2px_2px_37px_0px_#0000000D]"
                      >
                        {row.cells.map((cell, key) => (
                          <td
                            //@ts-ignore
                            key={key}
                            {...cell.getCellProps()}
                            style={{
                              verticalAlign: verticalAlignData,
                            }}
                            className="tradex-min-w-[200px] tradex-h-11 first:tradex-pl-9 last:tradex-pr-9"
                          >
                            <div
                              className={`${
                                index + 1 != rows?.length && "tradex-border-b"
                              } ${isOverflow ? "" : "overflow-hidden"} ${
                                key == 0 && "tradex-pl-0"
                              } ${
                                key + 1 == row.cells.length && "tradex-pr-0"
                              } tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-px-4 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
                            >
                              {cell.render("Cell")}
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
          {rows.length == 0 && <NoItemFound />}
        </>
      )}
    </div>
  );
};

export default CustomDatatable;
