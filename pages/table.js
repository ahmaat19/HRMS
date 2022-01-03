// import React from 'react'
// import { useTable, useExpanded, useGroupBy, useSortedBy } from 'react-table'

// const Table = () => {
//   const data = [
//     { _id: 1, name: 'Ahmed Ibahim', age: 29 },
//     { _id: 2, name: 'Jama Gedi', age: 56 },
//     { _id: 3, name: 'Asif Ahmed', age: 13 },
//     { _id: 4, name: 'Sumia Jei', age: 19 },
//   ]

//   const columns = React.useMemo(
//     () => [
//       { Header: 'ID', accessor: 'id' },
//       { Header: 'Name', accessor: 'name' },
//       { Header: 'Age', accessor: 'age' },
//       {
//         Header: 'Price',
//         accessor: 'price',
//         aggregate: 'average',
//         Aggregated: ({ value }) => `${Math.round(value * 100) / 100} (avg)`,
//       },
//       {
//         Header: 'Total',
//         accessor: 'total',
//         aggregate: 'sum',
//         Aggregated: ({ value }) => `${value} (sum)`,
//       },
//     ],
//     []
//   )

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data }, useGroupBy, useSortedBy, useExpanded)
//   return (
//     <table {...getTableProps()}>
//       <thead>
//         {headerGroups.map((headerGroup) => (
//           <tr {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map((column) => (
//               <th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                 {column.canGroupBy && column._id === 'name' ? (
//                   <span>{column.isGrouped ? '+' : '-'}</span>
//                 ) : null}
//                 {column.render('Header')}
//                 <span>
//                   {column.isSorted ? (column.isSortedDesc ? 'down' : 'up') : ''}
//                 </span>
//               </th>
//             ))}
//           </tr>
//         ))}
//       </thead>
//       <tbody {...getTableBodyProps()}>
//         {rows.map((row) => {
//           prepareRow(row)
//           return (
//             <tr {...row.getRowProps()}>
//               {row.cells.map((cell) => {
//                 ;<td {...cell.getCellProps()}></td>
//               })}
//             </tr>
//           )
//         })}
//       </tbody>
//     </table>
//   )
// }

// export default Table
