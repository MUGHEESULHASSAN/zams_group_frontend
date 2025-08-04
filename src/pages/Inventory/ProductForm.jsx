"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import JsBarcode from "jsbarcode"

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    // General
    id: "", // Internal ID, not directly editable by user
    itemCode: "", // Auto-generated, read-only
    description: "",
    category: "",
    unitType: "",
    // Sales Info
    mrp: 0,
    tradePrice: 0,
    discount: 0,
    taxCode: "",
    brandName: "",
    color: "",
    // Purchase Info
    itemBarcode: "", // This will store the generated barcode value
    // Existing fields
    name: "",
    sku: "",
    stock: 0,
    price: 0,
    status: "In Stock",
    // New field for image
    imageUrl: "",
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [brandSuggestions, setBrandSuggestions] = useState([])
  const barcodeCanvasRef = useRef(null)
  const fileInputRef = useRef(null) // Ref for the hidden file input

  // Mock data for brand suggestions (in a real app, this would come from an API)
  const allBrands = useMemo(
    () => [
      "TechBrand",
      "ComfortSeating",
      "ClickTech",
      "BrightHome",
      "Samsung",
      "Apple",
      "Sony",
      "HP",
      "Dell",
      "Logitech",
      "Steelcase",
      "Herman Miller",
      "IKEA",
      "Nike",
      "Adidas",
      "Puma",
      "Zara",
      "H&M",
      "Penguin Books",
      "Random House",
      "Coca-Cola",
      "Pepsi",
      "Nestle",
      "Bosch",
      "Makita",
      "Stanley",
    ],
    [],
  )

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      // Generate new item code for new products
      const newItemCode = `ITEM-${Date.now().toString().slice(-6)}`
      setFormData((prev) => ({
        ...prev,
        itemCode: newItemCode,
        id: `PROD-${Date.now().toString().slice(-6)}`, // Generate a unique ID for new products
        imageUrl: "", // Clear image for new product
      }))
    }
  }, [product])

  // Effect to generate barcode whenever itemCode changes
  useEffect(() => {
    if (formData.itemCode && barcodeCanvasRef.current) {
      try {
        JsBarcode(barcodeCanvasRef.current, formData.itemCode, {
          format: "CODE128", // Common barcode format
          displayValue: true,
          width: 2,
          height: 50,
          margin: 10,
        })
        setFormData((prev) => ({ ...prev, itemBarcode: formData.itemCode })) // Store the value used for barcode
      } catch (error) {
        console.error("Error generating barcode:", error)
        // Optionally, display an error message to the user
      }
    } else {
      // Clear barcode if itemCode is empty or canvas not ready
      if (barcodeCanvasRef.current) {
        const ctx = barcodeCanvasRef.current.getContext("2d")
        ctx.clearRect(0, 0, barcodeCanvasRef.current.width, barcodeCanvasRef.current.height)
      }
      setFormData((prev) => ({ ...prev, itemBarcode: "" }))
    }
  }, [formData.itemCode])

  // Calculate Final Price
  const finalPrice = useMemo(() => {
    const tp = Number.parseFloat(formData.tradePrice) || 0
    const disc = Number.parseFloat(formData.discount) || 0
    if (tp <= 0) return 0
    return (tp * (1 - disc / 100)).toFixed(2)
  }, [formData.tradePrice, formData.discount])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.sku || !formData.category || !formData.unitType || !formData.itemCode) {
      alert("Please fill in all required fields (Product Name, SKU, Category, Unit Type, Item Code).")
      return
    }
    if (formData.mrp <= 0 || formData.tradePrice <= 0) {
      alert("MRP and Trade Price must be greater than 0.")
      return
    }
    if (formData.discount < 0 || formData.discount > 100) {
      alert("Discount must be between 0 and 100.")
      return
    }

    // Auto-determine status based on stock
    let status = "In Stock"
    if (formData.stock === 0) {
      status = "Out of Stock"
    } else if (formData.stock <= 10) {
      status = "Low Stock"
    }

    onSave({ ...formData, status, finalPrice: Number.parseFloat(finalPrice) }) // Include finalPrice in saved data
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stock" || name === "price" || name === "mrp" || name === "tradePrice" || name === "discount"
          ? Number(value)
          : value,
    }))

    // Handle brand name suggestions
    if (name === "brandName") {
      if (value.length > 0) {
        const filteredSuggestions = allBrands.filter((brand) => brand.toLowerCase().includes(value.toLowerCase()))
        setBrandSuggestions(filteredSuggestions)
      } else {
        setBrandSuggestions([])
      }
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME // Use VITE_ prefix for Vite
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET // Use VITE_ prefix for Vite

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.error("Cloudinary environment variables are not set.")
      alert("Cloudinary configuration missing. Please check your .env file.")
      setUploadingImage(false)
      return
    }

    const formDataCloudinary = new FormData()
    formDataCloudinary.append("file", file)
    formDataCloudinary.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formDataCloudinary,
      })
      const data = await response.json()
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.secure_url }))
      } else {
        console.error("Cloudinary upload failed:", data)
        alert("Image upload failed. Please try again.")
      }
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error)
      alert("An error occurred during image upload.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear the file input
    }
  }

  const handleDownloadBarcode = () => {
    if (barcodeCanvasRef.current) {
      const dataUrl = barcodeCanvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `${formData.itemCode}_barcode.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePrintBarcode = () => {
    if (barcodeCanvasRef.current) {
      const printWindow = window.open("", "_blank")
      printWindow.document.write(`
        <html>
          <head>
            <title>Barcode - ${formData.itemCode}</title>
            <style>
              body { font-family: sans-serif; text-align: center; margin: 20px; }
              canvas { max-width: 100%; height: auto; }
              p { font-size: 18px; margin-top: 10px; }
            </style>
          </head>
          <body>
            <h1>${formData.name}</h1>
            <canvas id="printBarcodeCanvas"></canvas>
            <p>${formData.itemCode}</p>
            <script>
              const canvas = document.getElementById('printBarcodeCanvas');
              JsBarcode(canvas, '${formData.itemCode}', {
                format: "CODE128",
                displayValue: true,
                width: 2,
                height: 50,
                margin: 10,
              });
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const categories = ["Electronics", "Furniture", "Office Supplies", "Clothing", "Books", "Food & Beverage", "Hardware"]
  const unitTypes = ["Piece", "Kg", "Liter", "Box", "Meter", "Pack", "Set"]
  const taxCodes = ["GST18", "GST12", "VAT20", "VAT10", "None"]
  const colors = ["Red", "Blue", "Green", "Black", "White", "Silver", "Gold", "Yellow", "Orange", "Purple"]

  return (
    <form className="max-w-4xl mx-auto p-5" onSubmit={handleSubmit}>
      {/* General Information */}
      <div className="card p-5 mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">General Information</h3>

        <div className="flex flex-col items-center mb-5">
          <label htmlFor="productImage" className="form-label">Product Image</label>
          <div className="w-45 h-45 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mb-4 relative border-2 border-gray-300 shadow-sm">
            {uploadingImage ? (
              <div className="text-base text-gray-600 text-center">Uploading...</div>
            ) : formData.imageUrl ? (
              <img
                src={formData.imageUrl || "/placeholder.svg"}
                alt="Product Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-base text-gray-600 text-center">No Image</div>
            )}
            <input
              type="file"
              id="productImage"
              name="productImage"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
              disabled={uploadingImage}
            />
            <div className="flex gap-2 mt-2">
              <label htmlFor="productImage" className={`btn-primary text-center inline-block ${uploadingImage ? 'opacity-60 cursor-not-allowed' : ''}`}>
                {uploadingImage ? "Uploading..." : formData.imageUrl ? "Change Image" : "Upload Image"}
              </label>
              {formData.imageUrl && (
                <button
                  type="button"
                  className={`btn-secondary ${uploadingImage ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>
          <small className="text-xs text-gray-500 mt-1">Upload a clear image of the product.</small>
        </div>

        <div className="form-group">
          <label htmlFor="itemCode" className="form-label">Item Code</label>
          <input
            type="text"
            id="itemCode"
            name="itemCode"
            value={formData.itemCode}
            readOnly
            className="form-input bg-gray-50 text-gray-600 cursor-not-allowed"
          />
          <small className="text-xs text-gray-500 mt-1">Auto-generated unique identifier for the item.</small>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">Product Name *</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input resize-y"
            rows="3"
            placeholder="Detailed description of the product"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category *</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="form-input" required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="unitType" className="form-label">Unit Type *</label>
            <select id="unitType" name="unitType" value={formData.unitType} onChange={handleChange} className="form-input" required>
              <option value="">Select Unit Type</option>
              {unitTypes.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sku" className="form-label">SKU *</label>
            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label htmlFor="stock" className="form-label">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="form-input"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Sales Information */}
      <div className="card p-5 mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Sales Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mrp" className="form-label">MRP (Maximum Retail Price) *</label>
            <input
              type="number"
              id="mrp"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tradePrice" className="form-label">Trade Price *</label>
            <input
              type="number"
              id="tradePrice"
              name="tradePrice"
              value={formData.tradePrice}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="discount" className="form-label">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="form-input"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="taxCode" className="form-label">Tax Code</label>
            <select id="taxCode" name="taxCode" value={formData.taxCode} onChange={handleChange} className="form-input">
              <option value="">Select Tax Code</option>
              {taxCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="brandName" className="form-label">Brand Name</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="form-input"
              list="brand-suggestions" // Link to datalist
            />
            <datalist id="brand-suggestions">
              {brandSuggestions.map((brand) => (
                <option key={brand} value={brand} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="color" className="form-label">Color</label>
            <select id="color" name="color" value={formData.color} onChange={handleChange} className="form-input">
              <option value="">Select Color</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Final Price</label>
          <input type="text" value={`$${finalPrice}`} readOnly className="form-input bg-gray-50 text-blue-600 font-bold text-base cursor-not-allowed" />
          <small className="text-xs text-gray-500 mt-1">Calculated as Trade Price - Discount.</small>
        </div>
      </div>

      {/* Purchase Information */}
      <div className="card p-5 mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Purchase Information</h3>
        <div className="form-group">
          <label className="form-label">Item Barcode</label>
          <div className="flex justify-center items-center min-h-[100px] bg-gray-50 border-2 border-dashed border-gray-300 rounded mb-2 p-2">
            {formData.itemCode ? (
              <canvas ref={barcodeCanvasRef} className="max-w-full h-auto"></canvas>
            ) : (
              <p className="text-gray-500 italic text-sm">Enter an Item Code to generate barcode.</p>
            )}
          </div>
          <div className="flex gap-2 justify-center mt-2">
            <button
              type="button"
              className="btn-secondary px-4 py-2 text-xs"
              onClick={handleDownloadBarcode}
              disabled={!formData.itemCode}
            >
              Download Barcode
            </button>
            <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={handlePrintBarcode} disabled={!formData.itemCode}>
              Print Barcode
            </button>
          </div>
          <small className="text-xs text-gray-500 mt-1">Barcode generated from Item Code.</small>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-gray-200">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={uploadingImage}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={uploadingImage}>
          {product ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
