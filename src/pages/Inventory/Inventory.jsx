"use client"

import { useState, useEffect } from "react"
import SearchBar from "../../components/Common/SearchBar"
import DataTable from "../../components/Common/DataTable"
import Modal from "../../components/Common/Modal"
import ProductForm from "./ProductForm"

const Inventory = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [stockFilter, setStockFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    // Simulate loading products data
    const mockProducts = [
      {
        id: "PROD-001",
        itemCode: "ITEM-123456",
        name: "Laptop Computer",
        sku: "LAP-001",
        description: "High-performance laptop with 16GB RAM and 512GB SSD.",
        category: "Electronics",
        unitType: "Piece",
        mrp: 1200.0,
        tradePrice: 999.99,
        discount: 10,
        taxCode: "GST18",
        brandName: "TechBrand",
        color: "Silver",
        itemBarcode: "ITEM-123456",
        stock: 25,
        price: 999.99,
        status: "In Stock",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1700000000/samples/ecommerce/analog-classic.jpg", // Example Cloudinary URL
        finalPrice: 899.99,
      },
      {
        id: "PROD-002",
        itemCode: "ITEM-789012",
        name: "Office Chair",
        sku: "CHR-001",
        description: "Ergonomic office chair with lumbar support.",
        category: "Furniture",
        unitType: "Piece",
        mrp: 350.0,
        tradePrice: 299.99,
        discount: 5,
        taxCode: "VAT20",
        brandName: "ComfortSeating",
        color: "Black",
        itemBarcode: "ITEM-789012",
        stock: 5,
        price: 299.99,
        status: "Low Stock",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1700000000/samples/ecommerce/accessories-bag.jpg", // Example Cloudinary URL
        finalPrice: 284.99,
      },
      {
        id: "PROD-003",
        itemCode: "ITEM-345678",
        name: "Wireless Mouse",
        sku: "MOU-001",
        description: "Compact wireless mouse with adjustable DPI.",
        category: "Electronics",
        unitType: "Piece",
        mrp: 55.0,
        tradePrice: 49.99,
        discount: 0,
        taxCode: "GST18",
        brandName: "ClickTech",
        color: "Black",
        itemBarcode: "ITEM-345678",
        stock: 0,
        price: 49.99,
        status: "Out of Stock",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1700000000/samples/ecommerce/shoes.jpg", // Example Cloudinary URL
        finalPrice: 49.99,
      },
      {
        id: "PROD-004",
        itemCode: "ITEM-901234",
        name: "Desk Lamp",
        sku: "LAM-001",
        description: "LED desk lamp with multiple brightness settings.",
        category: "Furniture",
        unitType: "Piece",
        mrp: 85.0,
        tradePrice: 79.99,
        discount: 0,
        taxCode: "VAT20",
        brandName: "BrightHome",
        color: "White",
        itemBarcode: "ITEM-901234",
        stock: 15,
        price: 79.99,
        status: "In Stock",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/v1700000000/samples/ecommerce/car-interior-design.jpg", // Example Cloudinary URL
        finalPrice: 79.99,
      },
    ]
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemCode.toLowerCase().includes(searchTerm.toLowerCase()), // Search by new itemCode
    )

    if (stockFilter === "low") {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10)
    } else if (stockFilter === "out") {
      filtered = filtered.filter((product) => product.stock === 0)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, stockFilter, products])

  const columns = [
    {
      key: "imageUrl",
      header: "Image",
      render: (value, row) => (
        <div className="w-10 h-10 rounded border overflow-hidden flex items-center justify-center bg-gray-50 border-gray-200 flex-shrink-0">
          {value ? (
            <img src={value || "/placeholder.svg"} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-lg text-gray-600">📦</div>
          )}
        </div>
      ),
      className: "w-15", // New class for image column
    },
    { key: "itemCode", header: "Item Code" }, // New column
    { key: "sku", header: "SKU" },
    { key: "name", header: "Product Name" },
    { key: "category", header: "Category" },
    { key: "unitType", header: "Unit" }, // New column
    {
      key: "stock",
      header: "Stock",
      render: (value, row) => (
        <span className={`font-semibold ${
          value === 0 ? "text-red-600" : value <= 10 ? "text-yellow-600" : "text-green-600"
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "finalPrice",
      header: "Final Price",
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      render: (value) => <span className={`status-badge ${value.toLowerCase().replace(" ", "-")}`}>{value}</span>,
    },
  ]

  const handleNewProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete product ${product.name} (${product.itemCode})?`)) {
      setProducts(products.filter((p) => p.id !== product.id))
    }
  }

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(
        products.map((product) => (product.id === editingProduct.id ? { ...product, ...productData } : product)),
      )
    } else {
      // For new products, use the generated ID from ProductForm
      const newProduct = {
        ...productData,
      }
      setProducts([...products, newProduct])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <button className="btn-primary" onClick={handleNewProduct}>
          ➕ Add Product
        </button>
      </div>

      <div className="page-controls">
        <SearchBar
          placeholder="Search products by name, SKU, category, or item code..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="flex items-center gap-2">
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Products</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredProducts} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
        size="large"
      >
        <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

export default Inventory
