"use client"

const SearchBar = ({ placeholder, value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <form className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden min-w-64" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 border-0 outline-none text-sm placeholder-gray-500"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors text-base">
        🔍
      </button>
    </form>
  )
}

export default SearchBar
