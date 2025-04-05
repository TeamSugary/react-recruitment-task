"use client"

import React, { useState, useEffect, useRef, useCallback, useMemo, type FormEvent } from "react"
import "./App.css"

// Define TypeScript interfaces
interface Complaint {
  Id: number
  Title: string
  Body: string
  isOptimistic?: boolean
  createdAt?: string // For sorting by date
}

interface ApiResponse {
  Success: boolean
  Message?: string
}

interface SortOption {
  value: string
  label: string
}

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    console.error("Error in complaints app:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was an error loading the application.</p>
          <button onClick={() => window.location.reload()} className="gradient-button">
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="skeleton-container">
    {[1, 2, 3].map((item) => (
      <div key={item} className="skeleton-item">
        <div className="skeleton-title"></div>
        <div className="skeleton-body"></div>
      </div>
    ))}
  </div>
)

// SwipeableItem component for mobile
const SwipeableItem = ({
  children,
  onSwipeLeft,
  onSwipeRight,
}: {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swiping, setSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setSwiping(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.targetTouches[0].clientX
    setTouchEnd(currentTouch)

    const distance = touchStart - currentTouch

    if (distance > 0) {
      setSwipeDirection("left")
    } else {
      setSwipeDirection("right")
    }
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    }

    setTouchStart(null)
    setTouchEnd(null)
    setSwiping(false)
    setSwipeDirection(null)
  }

  return (
    <div
      className={`swipeable-item ${swiping ? "swiping" : ""} ${swipeDirection ? `swiping-${swipeDirection}` : ""}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
      {swiping && swipeDirection === "left" && (
        <div className="swipe-action swipe-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Archive</span>
        </div>
      )}
      {swiping && swipeDirection === "right" && (
        <div className="swipe-action swipe-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Reply</span>
        </div>
      )}
    </div>
  )
}

function App() {
  // State management
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [sortBy, setSortBy] = useState("newest")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Refs for focus management
  const formRef = useRef<HTMLFormElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // API configuration
  const baseUrl = "https://sugarytestapi.azurewebsites.net/"
  const listPath = "TestApi/GetComplains"
  const savePath = "TestApi/SaveComplain"

  // Sort options
  const sortOptions: SortOption[] = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alphabetical", label: "Alphabetical (A-Z)" },
    { value: "reverseAlphabetical", label: "Alphabetical (Z-A)" },
  ]

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
    document.body.classList.toggle("dark-mode")
  }

  // Memoized filtered and sorted complaints
  const processedComplaints = useMemo(() => {
    let result = [...complaints]

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      result = result.filter(
        (complaint) =>
          complaint.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.Body.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeTab === "pending") {
      result = result.filter((complaint) => complaint.isOptimistic)
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.Id - a.Id)
        break
      case "oldest":
        result.sort((a, b) => a.Id - b.Id)
        break
      case "alphabetical":
        result.sort((a, b) => a.Title.localeCompare(b.Title))
        break
      case "reverseAlphabetical":
        result.sort((a, b) => b.Title.localeCompare(a.Title))
        break
      default:
        result.sort((a, b) => b.Id - a.Id)
    }

    return result
  }, [complaints, searchTerm, sortBy, activeTab])

  // Calculate pagination
  const totalPages = Math.ceil(processedComplaints.length / itemsPerPage)
  const paginatedComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return processedComplaints.slice(startIndex, startIndex + itemsPerPage)
  }, [processedComplaints, currentPage, itemsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, activeTab])

  // Fetch complaints from the API
  const fetchComplaints = useCallback(async () => {
    if (!isOnline) {
      setErrorMessage("You are offline. Cannot fetch complaints.")
      return
    }

    try {
      setIsLoading(true)
      setErrorMessage("")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(`${baseUrl}${listPath}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch complaints: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Add createdAt field for sorting (using current date as mock)
      const enhancedData = data.map((complaint: Complaint) => ({
        ...complaint,
        createdAt: new Date().toISOString(),
      }))

      setComplaints(enhancedData)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setErrorMessage("Request timed out. Please try again later.")
      } else {
        setErrorMessage(`Error loading complaints: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
      console.error("Error fetching complaints:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isOnline])

  // Form validation
  const validateForm = (): boolean => {
    if (!title.trim()) {
      setErrorMessage("Please enter a title")
      return false
    }
    if (title.trim().length < 5) {
      setErrorMessage("Title must be at least 5 characters long")
      return false
    }
    if (!body.trim()) {
      setErrorMessage("Please enter your complaint")
      return false
    }
    if (body.trim().length < 10) {
      setErrorMessage("Description must be at least 10 characters long")
      return false
    }
    return true
  }

  // Reset form with confirmation
  const handleResetForm = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the form?")) {
      setTitle("")
      setBody("")

      // Focus on title input after reset
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }
    }
  }, [])

  // Save a new complaint
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault() // Prevent default form submission

    // Validate form
    if (!validateForm()) return

    // Create optimistic complaint
    const optimisticId = -Date.now() // Temporary negative ID to avoid conflicts
    const optimisticComplaint: Complaint = {
      Id: optimisticId,
      Title: title,
      Body: body,
      isOptimistic: true,
      createdAt: new Date().toISOString(),
    }

    // Add optimistic complaint to UI immediately
    setComplaints((prev) => [optimisticComplaint, ...prev])

    try {
      setIsSaving(true)
      setErrorMessage("")
      setSuccessMessage("")

      if (!isOnline) {
        throw new Error("You are offline. Please try again when you're back online.")
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      // API call
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data: ApiResponse = await response.json()

      if (!data.Success) {
        throw new Error(data.Message || "Failed to save complaint")
      }

      // Remove optimistic entry
      setComplaints((prev) => prev.filter((c) => c.Id !== optimisticId))

      // Show success message
      setSuccessMessage("Complaint submitted successfully!")

      // Clear form after successful submission
      setTitle("")
      setBody("")

      // Focus title input after successful submission
      if (titleInputRef.current) {
        titleInputRef.current.focus()
      }

      // Refresh complaints list
      fetchComplaints()
    } catch (error) {
      // Remove optimistic entry on error
      setComplaints((prev) => prev.filter((c) => c.Id !== optimisticId))

      if (error instanceof Error && error.name === "AbortError") {
        setErrorMessage("Request timed out. Please try again later.")
      } else {
        setErrorMessage(`Error submitting complaint: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
      console.error("Error saving complaint:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle swipe actions
  const handleSwipeLeft = useCallback((id: number) => {
    // Archive functionality (just a visual demo)
    alert(`Complaint #${id} would be archived`)
  }, [])

  const handleSwipeRight = useCallback((id: number) => {
    // Reply functionality (just a visual demo)
    alert(`You would reply to complaint #${id}`)
  }, [])

  // Keyboard shortcuts - Fixed Ctrl+Enter functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Submit form with Ctrl+Enter
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault() // Prevent default behavior

        // Directly click the submit button if it exists
        if (submitButtonRef.current && !submitButtonRef.current.disabled) {
          submitButtonRef.current.click()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Focus title input after successful submission
  useEffect(() => {
    if (successMessage && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [successMessage])

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints()

    // Clean up any pending requests when component unmounts
    return () => {
      // Cleanup function to prevent memory leaks
    }
  }, [fetchComplaints])

  return (
    <ErrorBoundary>
      <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="centered-content">
          <header className="app-header">
            <h1>Feedback Portal</h1>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>
          </header>

          {!isOnline && (
            <div className="offline-warning" role="alert">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                <line x1="12" y1="20" x2="12.01" y2="20"></line>
              </svg>
              You are currently offline. Some features may be unavailable.
            </div>
          )}

          {/* Analytics Dashboard */}
          <section className="metrics-dashboard">
            <div className="metric-card">
              <h3>Welcome to our Feedback Portal</h3>
              <p className="metric-description">Share your thoughts and suggestions with us</p>
            </div>
          </section>

          <section className="form-section" aria-labelledby="form-heading">
            <h2 id="form-heading">Submit Feedback</h2>

            <div className="keyboard-shortcut-hint">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Pro tip: Press Ctrl+Enter to submit
            </div>

            <form className="complain-form" onSubmit={handleSubmit} ref={formRef}>
              <div className="form-group">
                <label htmlFor="complaint-title">Title</label>
                <input
                  id="complaint-title"
                  type="text"
                  placeholder="Enter feedback title (minimum 5 characters)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  aria-required="true"
                  aria-invalid={title.length > 0 && title.length < 5 ? "true" : "false"}
                  ref={titleInputRef}
                />
                {title.length > 0 && title.length < 5 && (
                  <p className="validation-message">Title should be at least 5 characters</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="complaint-body">Description</label>
                <textarea
                  id="complaint-body"
                  placeholder="Enter your feedback details (minimum 10 characters)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isSaving}
                  aria-required="true"
                  aria-invalid={body.length > 0 && body.length < 10 ? "true" : "false"}
                  className="standard-textarea"
                  rows={5}
                ></textarea>
                {body.length > 0 && body.length < 10 && (
                  <p className="validation-message">Description should be at least 10 characters</p>
                )}
              </div>

              <div className="button-group">
                <button type="submit" disabled={isSaving} className="gradient-button" ref={submitButtonRef}>
                  {isSaving ? (
                    <span className="button-content">
                      <span className="spinner-small"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Feedback"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  disabled={isSaving || (!title && !body)}
                  className="reset-button"
                >
                  Reset Form
                </button>
              </div>
            </form>

            {errorMessage && (
              <div className="error-message" role="alert">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="success-message" role="alert">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {successMessage}
              </div>
            )}
          </section>

          <section className="complaints-section" aria-labelledby="complaints-heading">
            <div className="section-header">
              <div className="feedback-header">
                <h2 id="complaints-heading">Feedback List</h2>
                {/* <div className="count-container">
                  <div className="count-number">{complaints.length}</div>
                  <div className="count-label">total</div>
                </div> */}
              </div>
              <div className="header-actions">
                <div className="search-container">
                  <input
                    type="search"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Search feedback"
                  />
                  {searchTerm && (
                    <button className="clear-search" onClick={() => setSearchTerm("")} aria-label="Clear search">
                      ×
                    </button>
                  )}
                </div>

                <div className="filter-sort-container">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                    aria-label="Sort feedback"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={fetchComplaints}
                    disabled={isLoading || !isOnline}
                    className="refresh-button"
                    aria-label="Refresh feedback list"
                  >
                    ↻ Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="complaints-container">
              {isLoading ? (
                <div className="loading-container" aria-live="polite">
                  <SkeletonLoader />
                </div>
              ) : paginatedComplaints.length > 0 ? (
                <div>
                  <ul className="complaints-list">
                    {paginatedComplaints.map((complaint) => (
                      <SwipeableItem
                        key={complaint.Id}
                        onSwipeLeft={() => handleSwipeLeft(complaint.Id)}
                        onSwipeRight={() => handleSwipeRight(complaint.Id)}
                      >
                        <li className={`complain-item ${complaint.isOptimistic ? "optimistic" : ""}`}>
                          <h3>{complaint.Title}</h3>
                          <p>{complaint.Body}</p>
                          {complaint.isOptimistic && <div className="optimistic-badge">Submitting...</div>}
                        </li>
                      </SwipeableItem>
                    ))}
                  </ul>

                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                      >
                        &lt;
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              ) : searchTerm ? (
                <div className="empty-state">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <p>No feedback matches your search.</p>
                  <button onClick={() => setSearchTerm("")} className="clear-search-button">
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>No feedback available.</p>
                  <p className="empty-state-subtext">Be the first to submit feedback!</p>
                </div>
              )}
            </div>
          </section>

          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App

