"use client"

import type React from "react"

import "./Pagination.css"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Simple pagination with prev/next and page numbers
  const renderPageNumbers = () => {
    const pages = []

    // Always show first page
    pages.push(
      <button
        key={1}
        className={`pagination-page ${currentPage === 1 ? "active" : ""}`}
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        1
      </button>,
    )

    // Show ellipsis if needed
    if (currentPage > 3) {
      pages.push(
        <span key="ellipsis1" className="pagination-ellipsis">
          ...
        </span>,
      )
    }

    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <button
            key={i}
            className={`pagination-page ${currentPage === i ? "active" : ""}`}
            onClick={() => onPageChange(i)}
            disabled={currentPage === i}
          >
            {i}
          </button>,
        )
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="ellipsis2" className="pagination-ellipsis">
          ...
        </span>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          className={`pagination-page ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  return (
    <div className="pagination">
      <button
        className="pagination-button prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div className="pagination-pages">{renderPageNumbers()}</div>

      <button
        className="pagination-button next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  )
}

export default Pagination

