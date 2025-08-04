"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([])
  const [filteredOpportunities, setFilteredOpportunities] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState(null)

  useEffect(() => {
    const mockOpportunities = [
      {
        id: "OPP-001",
        name: "Enterprise Software Deal",
        company: "Tech Corp",
        value: 50000,
        stage: "Proposal",
        probability: 75,
        closeDate: "2024-02-15",
      },
      {
        id: "OPP-002",
        name: "Cloud Migration Project",
        company: "Finance Ltd",
        value: 25000,
        stage: "Negotiation",
        probability: 60,
        closeDate: "2024-02-28",
      },
    ]
    setOpportunities(mockOpportunities)
    setFilteredOpportunities(mockOpportunities)
  }, [])

  useEffect(() => {
    const filtered = opportunities.filter(
      (opp) =>
        opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOpportunities(filtered)
  }, [searchTerm, opportunities])

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Opportunity Name" },
    { key: "company", header: "Company" },
    {
      key: "value",
      header: "Value",
      render: (value) => `$${value.toLocaleString()}`,
    },
    { key: "stage", header: "Stage" },
    {
      key: "probability",
      header: "Probability",
      render: (value) => `${value}%`,
    },
    { key: "closeDate", header: "Close Date" },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Opportunities</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          ➕ Add Opportunity
        </button>
      </div>

      <div className="page-controls">
        <SearchBar placeholder="Search opportunities..." value={searchTerm} onChange={setSearchTerm} />
      </div>

      <DataTable
        columns={columns}
        data={filteredOpportunities}
        onEdit={(opp) => {
          setEditingOpportunity(opp)
          setIsModalOpen(true)
        }}
        onDelete={(opp) => {
          if (window.confirm(`Delete opportunity ${opp.name}?`)) {
            setOpportunities(opportunities.filter((o) => o.id !== opp.id))
          }
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpportunity ? "Edit Opportunity" : "Add Opportunity"}
      >
        <div>Opportunity form would go here</div>
      </Modal>
    </div>
  )
}

export default Opportunities
