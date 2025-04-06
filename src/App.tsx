import { ChangeEvent, Dispatch, memo, SetStateAction, useEffect, useRef, useState } from 'react'
import './App.css'

const BASE_URL = 'https://sugarytestapi.azurewebsites.net/TestApi'
const LIST_PATH = '/GetComplains'
const SAVE_PATH = '/SaveComplain'

class Complain {
  Title: string
  Body: string
  CreatedAt?: string
  Id?: number

  constructor(Title: string, Body: string) {
    this.Title = Title
    this.Body = Body
  }
}

type AddApiResponse<T> = {
  Success: boolean
  Message: string | null
  ReturnCode: number
  Data: T | null
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date)

  return formattedDate
}

function App() {
  const [complains, setComplains] = useState<Complain[]>([])
  const [searchedComplains, setSearchedComplains] = useState<Complain[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [inputErrors, setInputErrors] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)

  const fetchComplains = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}${LIST_PATH}`)
      const data: Complain[] = await response.json()
      const filteredData = data.filter((d) => !!d.Body && !!d.Title)
      setComplains(filteredData)
      setSearchedComplains(filteredData)
    } catch {
      setErrorMessage('Failed to load complaints.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateInput = () => {
    let inputErrorText = ''
    const errors: string[] = []

    if (!title.trim()) {
      errors.push('title')
      inputErrorText += 'Please fill in title'
    }

    if (!body.trim()) {
      errors.push('body')
      inputErrorText += inputErrorText ? ' & body' : 'Please fill in body'
    }

    setInputErrors(errors)

    if (inputErrorText) {
      setErrorMessage(inputErrorText)
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    let timeoutId
    if (!validateInput()) return

    try {
      setIsSaving(true)
      setErrorMessage('')
      const response = await fetch(`${BASE_URL}${SAVE_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new Complain(title, body)),
      })

      const data: AddApiResponse<Complain> = await response.json()
      const isSuccess = data.Success
      if (!isSuccess) return setErrorMessage('Failed to add new complaint.')
      clearTimeout(timeoutId)
      setShowToast(true)
      timeoutId = setTimeout(() => {
        setShowToast(false)
      }, 1000)

      await fetchComplains()

      window.scroll({ top: 0, left: 0, behavior: 'smooth' })

      setSearch('')
      setTitle('')
      setBody('')
      setInputErrors([])
    } catch {
      setErrorMessage('Error saving new complaint.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    setSearch(searchValue)

    filterComplains(searchValue, startDate, endDate)
  }

  const handleDateFilter = (startDate: string | null, endDate: string | null) => {
    setStartDate(startDate || '')
    setEndDate(endDate || '')

    filterComplains(search, startDate, endDate)
  }

  const filterComplains = (searchValue: string, startDate: string | null, endDate: string | null) => {
    let filteredComplains = complains

    if (searchValue) {
      filteredComplains = filteredComplains.filter((complain) => complain.Title.toLowerCase().includes(searchValue.toLowerCase()) || complain.Body.toLowerCase().includes(searchValue.toLowerCase()))
    }

    filteredComplains = filteredComplains.filter((complain) => {
      const complainDate = new Date(complain.CreatedAt || '').toISOString().split('T')[0]
      const matchesStartDate = startDate ? complainDate >= startDate : true
      const matchesEndDate = endDate ? complainDate <= endDate : true
      return matchesStartDate && matchesEndDate
    })

    setSearchedComplains(filteredComplains)
  }

  useEffect(() => {
    fetchComplains()
  }, [])

  const renderPagination = !search && !startDate && !endDate && !isLoading

  return (
    <div className="wrapper">
      <title>Sugary Complaint</title>
      <h2 className="submit-complaint">Submit a Complaint</h2>
      <ComplainForm title={title} body={body} isSaving={isSaving} inputErrors={inputErrors} errorMessage={errorMessage} onTitleChange={setTitle} onBodyChange={setBody} onSubmit={handleSubmit} />
      <div className="complain-list-header">
        <h2>Complaints List</h2>
        <Search handleSearch={handleSearch} search={search} setSearch={setSearch} />
        <Dropdown
          icon={
            <svg className="dropdown-icon" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
            </svg>
          }
        >
          <DateRangePicker startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} onChange={handleDateFilter} />
        </Dropdown>
      </div>
      <ComplainList search={search} complains={searchedComplains.slice(currentPage * 10 - 10, currentPage * 10)} isLoading={isLoading} />
      {renderPagination && <Pagination total={searchedComplains.length || 0} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      {showToast && (
        <p className="toast" role="status">
          Added New Complain
        </p>
      )}
    </div>
  )
}

export default App

interface SearchProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Search = ({ search, setSearch, handleSearch }: SearchProps) => {
  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        handleSearch(e)
      }}
      type="search"
      name="search"
      id="search"
      placeholder="🔍 Search Complain"
      aria-label="Search complaints by title or body"
      aria-describedby="search-instruction"
    />
  )
}

interface ComplainFormProps {
  title: string
  body: string
  isSaving: boolean
  inputErrors: string[]
  errorMessage: string
  onTitleChange: (val: string) => void
  onBodyChange: (val: string) => void
  onSubmit: () => void
}

const ComplainForm = ({ title, body, isSaving, inputErrors, errorMessage, onTitleChange, onBodyChange, onSubmit }: ComplainFormProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!inputErrors.length) return
    const setFocus = (el: HTMLInputElement | HTMLTextAreaElement) => el.focus()

    if (inputErrors.includes('title') && titleInputRef.current) {
      setFocus(titleInputRef.current)
    } else if (inputErrors.includes('body') && descriptionInputRef.current) {
      setFocus(descriptionInputRef.current)
    }
  }, [inputErrors])

  return (
    <div className="complain-form">
      <input
        ref={titleInputRef}
        data-input-error={inputErrors.includes('title')}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Complaint Title"
        aria-invalid={inputErrors.includes('title')}
      />
      <textarea
        ref={descriptionInputRef}
        data-input-error={inputErrors.includes('body')}
        placeholder="Enter your complaint"
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        aria-label="Complaint Body"
        aria-invalid={inputErrors.includes('body')}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={onSubmit} disabled={isSaving} className={`${isSaving ? 'pointer-none' : ''}`}>
        {isSaving ? <div className="loader" /> : 'Submit Complaint'}
      </button>
    </div>
  )
}

interface ComplainListProps {
  complains: Complain[]
  isLoading: boolean
  search: string
}

const ComplainList = memo(({ complains, isLoading, search }: ComplainListProps) => {
  if (isLoading) return <div className="loader" role="status" aria-label="Loading complaints..." />
  if (!complains.length)
    return (
      <p role="status" aria-live="polite">
        No complaints available{' '}
        <em>
          {' '}
          <strong>{search ? `for ${search}` : ''}</strong>
        </em>
      </p>
    )

  return (
    <>
      {search && (
        <p role="status" aria-live="polite">
          Showing complains for{' '}
          <em>
            <strong>
              {search} ({complains.length})
            </strong>
          </em>
        </p>
      )}

      <div className="complain-list-wrapper">
        {complains.map((complain) => {
          const title = complain.Title
          const body = complain.Body
          const regex = new RegExp(`(${search})`, 'gi') // case-insensitive match for search term
          const highlightedTitle = title.split(regex).map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
              <span key={index} className="highlight">
                {part}
              </span>
            ) : (
              part
            )
          )

          const highlightedBody = body.split(regex).map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
              <span key={index} className="highlight">
                {part}
              </span>
            ) : (
              part
            )
          )
          return (
            <div key={complain.Id} className="complain-item" role="list">
              <h3>{highlightedTitle}</h3>
              <strong>
                <em>{formatDateTime(complain?.CreatedAt || '')}</em>
              </strong>
              <p>{highlightedBody}</p>
            </div>
          )
        })}
      </div>
    </>
  )
})

interface DropdownProps {
  children: React.ReactNode
  icon: React.ReactNode
}

const Dropdown = ({ children, icon }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  const handleDropdownClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
        {icon}
      </button>

      {isOpen && (
        <div className="dropdown-menu" onClick={handleDropdownClick}>
          {children}
        </div>
      )}
    </div>
  )
}

interface DateRangePickerProps {
  onChange: (startDate: string | null, endDate: string | null) => void
  startDate: string
  setStartDate: React.Dispatch<React.SetStateAction<string>>
  endDate: string
  setEndDate: React.Dispatch<React.SetStateAction<string>>
}

const DateRangePicker = ({ onChange, startDate, setStartDate, endDate, setEndDate }: DateRangePickerProps) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)
    onChange(newStartDate, endDate)
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)
    onChange(startDate, newEndDate)
  }
  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    onChange('', '')
  }

  return (
    <div className="date-range-picker">
      <em className="date-header">
        <strong>Date Filter</strong>
        {(startDate || endDate) && (
          <button className="reset-btn" onClick={handleReset}>
            &times;
          </button>
        )}
      </em>
      <div className="date-input">
        <label htmlFor="start-date">Start Date</label>
        <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} placeholder="Start Date" />
      </div>

      <div className="date-input">
        <label htmlFor="end-date">End Date</label>
        <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} placeholder="End Date" />
      </div>
    </div>
  )
}

interface PaginationProp {
  total: number
  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}

const Pagination = ({ currentPage, setCurrentPage, total }: PaginationProp) => {
  const lastPage = Math.ceil(total / 10)

  const handlePageChange = (type: string, num?: number) => {
    if (type === 'plus') {
      setCurrentPage((prev) => Math.min(prev + 1, lastPage))
    } else if (type === 'minus') {
      setCurrentPage((prev) => Math.max(prev - 1, 1))
    } else {
      setCurrentPage(num!)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getVisiblePages = () => {
    const pages = []
    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5)
      } else if (currentPage >= lastPage - 2) {
        for (let i = lastPage - 4; i <= lastPage; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="pagination-container">
      <button onClick={() => handlePageChange('minus')} className={`page-link ${currentPage === 1 ? 'disabled pointer-none' : ''}`}>
        <div className="page-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </div>
      </button>

      {lastPage > 5 && currentPage > 3 && (
        <>
          <button onClick={() => handlePageChange('exact', 1)} className={`page-link hidden-sm ${currentPage === 1 ? 'page-active pointer-none' : ''}`}>
            1
          </button>
          {currentPage > 4 && <span className="page-ellipsis">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <button key={page} onClick={() => handlePageChange('exact', page)} className={`page-link hidden-sm ${currentPage === page ? 'page-active pointer-none' : ''}`}>
          {page}
        </button>
      ))}

      {lastPage > 5 && currentPage < lastPage - 2 && (
        <>
          {currentPage < lastPage - 3 && <span className="page-ellipsis">...</span>}
          <button onClick={() => handlePageChange('exact', lastPage)} className={`page-link hidden-sm ${currentPage === lastPage ? 'page-active pointer-none' : ''}`}>
            {lastPage}
          </button>
        </>
      )}

      <button onClick={() => handlePageChange('plus')} className={`page-link ${currentPage === lastPage ? 'pointer-none' : ''}`}>
        <div className="page-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </button>
    </div>
  )
}
