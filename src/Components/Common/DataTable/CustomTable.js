import React, { useState } from "react";
import { useTable, usePagination, useFilters } from "react-table";

const CustomTable = (props) => {
  const {data, columns} = props;
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    useFilters,
    usePagination
  );

  const [formData, setFormData] = useState({ name: "", age: "" });
  const [searchInput, setSearchInput] = useState(""); 
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchInput(value); 
    setFilter("id",value);
  };

 

  return (
    <div>
      <h2>Custom Data Table</h2>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchInput}
        onChange={handleSearch}
        style={{ marginBottom: "10px", padding: "5px" }}
      />
      <table {...getTableProps()} border="1" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={previousPage} disabled={!canPreviousPage}>Previous</button>
      <button onClick={nextPage} disabled={!canNextPage}>Next</button>

     
    </div>
  );
};

export default CustomTable;
