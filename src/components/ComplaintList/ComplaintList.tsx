"use client";

import type React from "react";
import { useState } from "react";
import "./ComplaintList.css";
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage";
import ComplaintCard from "../ComplaintCard/ComplaintCard";
import { Complaint, FilterOption, SortOption } from "../../data/types";
import RefreshIcon from "../shared/icons/RefreshIcon";
import SearchIcon from "../shared/icons/SearchIcon";
import FilterIcon from "../shared/icons/FilterIcon";
import SortIcon from "../shared/icons/SortIcon";
import Loading from "../shared/Loading/Loading";
import Empty from "../shared/Empty/Empty";
import Pagination from "../shared/Pagination/Pagination";

interface ComplaintListProps {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const ITEMS_PER_PAGE = 10;

const ComplaintList: React.FC<ComplaintListProps> = ({
  complaints,
  isLoading,
  error,
  onRefresh,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComplaints = complaints
    .filter((complaint) => {
      if (filterOption === "withContent") {
        if (!complaint.Title.trim() || !complaint.Body.trim()) return false;
      } else if (filterOption === "withoutContent") {
        if (complaint.Title.trim() && complaint.Body.trim()) return false;
      }

      if (searchQuery) {
        return complaint.Title.toLowerCase().includes(
          searchQuery.toLowerCase()
        );
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.CreatedAt).getTime();
      const dateB = new Date(b.CreatedAt).getTime();

      return sortOption === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
    setCurrentPage(1);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="complaint-list-container">
      <div className="complaint-list-header">
        <h2>Complaints List</h2>
        <button
          className="refresh-button"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshIcon />
        </button>
      </div>

      <div className="complaint-list-controls">
        <div className="search-container">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-sort-container">
          <div className="dropdown">
            <button className="dropdown-toggle">
              <FilterIcon />
              <span>Filter</span>
            </button>
            <div className="dropdown-menu">
              <button
                className={filterOption === "all" ? "active" : ""}
                onClick={() => handleFilterChange("all")}
              >
                All Complaints
              </button>
              <button
                className={filterOption === "withContent" ? "active" : ""}
                onClick={() => handleFilterChange("withContent")}
              >
                Complete Complaints
              </button>
              <button
                className={filterOption === "withoutContent" ? "active" : ""}
                onClick={() => handleFilterChange("withoutContent")}
              >
                Incomplete Complaints
              </button>
            </div>
          </div>

          <div className="dropdown">
            <button className="dropdown-toggle">
              <SortIcon />
              <span>Sort</span>
            </button>
            <div className="dropdown-menu">
              <button
                className={sortOption === "newest" ? "active" : ""}
                onClick={() => handleSortChange("newest")}
              >
                Newest First
              </button>
              <button
                className={sortOption === "oldest" ? "active" : ""}
                onClick={() => handleSortChange("oldest")}
              >
                Oldest First
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading message="Loading complaints..." />
      ) : error ? (
        <ErrorMessage message={"Failed to load complaints"} />
      ) : filteredComplaints?.length === 0 ? (
        <Empty
          message={
            searchQuery
              ? "No complaints match your search"
              : "No complaints available"
          }
        />
      ) : (
        <>
          <div className="complaint-cards">
            {paginatedComplaints?.map((complaint, index) => (
              <ComplaintCard
                key={complaint.Id}
                complaint={complaint}
                animationDelay={index * 0.1}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ComplaintList;
