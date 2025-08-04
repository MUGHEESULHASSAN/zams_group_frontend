"use client"

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`px-4 py-3 text-left bg-gray-50 font-semibold text-gray-900 text-sm border-b border-gray-200 ${column.className || ""}`}>
                {column.header}
              </th>
            ))}
            <th className="px-4 py-3 text-center bg-gray-50 font-semibold text-gray-900 text-sm border-b border-gray-200 w-36">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`px-4 py-3 text-sm text-gray-600 border-b border-gray-100 ${column.className || ""}`}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-center border-b border-gray-100">
                <div className="flex gap-1 justify-center">
                  {onView && (
                    <button className="p-1.5 hover:bg-blue-50 rounded transition-colors" onClick={() => onView(row)} title="View">
                      👁️
                    </button>
                  )}
                  {onEdit && (
                    <button className="p-1.5 hover:bg-yellow-50 rounded transition-colors" onClick={() => onEdit(row)} title="Edit">
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button className="p-1.5 hover:bg-red-50 rounded transition-colors" onClick={() => onDelete(row)} title="Delete">
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="py-10 text-center text-gray-500 italic">No data available</div>}
    </div>
  )
}

export default DataTable
