"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"

const Quotes = () => {
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const mockQuotes = [
      {
        id: "QUO-001",
        customer: "ABC Corp",
        date: "2024-01-10",
        total: 15000,
        status: "Pending",
        validUntil: "2024-02-10",
      },
      {
        id: "QUO-002",
        customer: "XYZ Ltd",
        date: "2024-01-12",
        total: 8500,
        status: "Accepted",
        validUntil: "2024-02-12",
      },
    ]
    setQuotes(mockQuotes)
    setFilteredQuotes(mockQuotes)
  }, [])

  useEffect(() => {
    const filtered = quotes.filter(
      (quote) =>
        quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredQuotes(filtered)
  }, [searchTerm, quotes])

  const columns = [
    { key: "id", header: "Quote ID" },
    { key: "customer", header: "Customer" },
    { key: "date", header: "Date" },
    {
      key: "total",
      header: "Total",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase()}`}>{value}</span>,
    },
    { key: "validUntil", header: "Valid Until" },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Quotes</h1>
        <button className="btn-primary">➕ New Quote</button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search quotes..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable columns={columns} data={filteredQuotes} onEdit={() => {}} onDelete={() => {}} />
    </div>
  )
}

export default Quotes
