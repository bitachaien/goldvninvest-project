import SectionLoading from "components/common/SectionLoading";
import CustomPagination from "components/Pagination/CustomPagination";
import useTranslation from "next-translate/useTranslation";
import React, { useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import { NoItemFound } from "./NoItemFound/NoItemFound";

const ReactDataTable = ({
  columns,
  data,
  processing,
  verticalAlignData = "middle",
  isOverflow = false,
  dataNotFoundText = null,
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
      {processing ? (
        <SectionLoading />
      ) : (
        <>
          <table
            {...getTableProps()}
            className="tradex-w-full tradex-border-separate tradex-border-spacing-y-2"
          >
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column: any, key: number) => (
                    <th
                      key={key}
                      {...column.getHeaderProps(column.getSortByToggleProps())} // Add sorting props to the column header
                      className=" tradex-pr-4 last:tradex-pr-0 tradex-min-w-[100px] tradex-py-3 tradex-text-nowrap tradex-text-sm tradex-leading-5 !tradex-text-title tradex-font-semibold tradex-border-b tradex-border-background-primary"
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
                            className=" tradex-min-w-[100px] tradex-h-11 "
                          >
                            <div
                              className={`${
                                index + 1 != rows?.length && "tradex-border-b"
                              } ${
                                isOverflow ? "" : "overflow-hidden"
                              } !tradex-pr-4 last:tradex-pr-0  tradex-text-sm tradex-text-body tradex-flex tradex-items-center tradex-h-full group-hover:tradex-border-b-0 tradex-border-background-primary  tradex-py-3 tradex-text-nowrap tradex-text-ellipsis tradex-min-h-16`}
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
          {rows.length == 0 && (
            <div className=" tradex-p-5 tradex-text-center">
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
              <p className="tradex-text-base tradex-font-medium tradex-text-title">{`${
                dataNotFoundText ?? "No Item Found"
              } `}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReactDataTable;
