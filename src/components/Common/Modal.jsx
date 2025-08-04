"use client"

import { useEffect } from "react"

const Modal = ({ isOpen, onClose, title, children, size = "medium" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5" onClick={onClose}>
      <div className={`bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${
        size === 'large' ? 'max-w-4xl' : 'max-w-lg'
      }`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 m-0">{title}</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors text-gray-600 text-xl border-0 bg-transparent cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
