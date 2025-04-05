import { ChangeEvent, useEffect, useState } from 'react'
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
      const makeNewComplain = (prev: Complain[]) => {
        const newComplain = new Complain(title, body)
        newComplain.Id = (prev[0].Id || 10000) + 1
        newComplain.CreatedAt = new Date().toISOString()
        return [newComplain, ...prev]
      }
      setComplains(makeNewComplain)
      setSearchedComplains(makeNewComplain)
      window.scroll({ top: 0, left: 0, behavior: 'smooth' })

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
    setSearchedComplains(() => complains.filter((complain) => complain.Title.toLowerCase().includes(searchValue.toLowerCase()) || complain.Body.toLowerCase().includes(searchValue.toLowerCase())))
  }

  useEffect(() => {
    fetchComplains()
  }, [])

  return (
    <div className="wrapper">
      <h2 className="submit-complaint">Submit a Complaint</h2>
      <ComplainForm title={title} body={body} isSaving={isSaving} inputErrors={inputErrors} errorMessage={errorMessage} onTitleChange={setTitle} onBodyChange={setBody} onSubmit={handleSubmit} />
      <div className="complain-list-header">
        <h2>Complaints List</h2>
        <Search handleSearch={handleSearch} search={search} setSearch={setSearch} />
      </div>
      <ComplainList search={search} complains={searchedComplains} isLoading={isLoading} />
      {showToast && <p className="toast">Added New Complain</p>}
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
  return (
    <div className="complain-form">
      <input data-input-error={inputErrors.includes('title')} type="text" placeholder="Title" value={title} onChange={(e) => onTitleChange(e.target.value)} />
      <textarea data-input-error={inputErrors.includes('body')} placeholder="Enter your complaint" value={body} onChange={(e) => onBodyChange(e.target.value)} />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={onSubmit} disabled={isSaving}>
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

const ComplainList = ({ complains, isLoading, search }: ComplainListProps) => {
  if (isLoading) return <div className="loader" />
  if (!complains.length)
    return (
      <p>
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
        <p>
          Showing complains for{' '}
          <em>
            <strong>
              {search} ({complains.length})
            </strong>
          </em>
        </p>
      )}
      <div className="complain-list-wrapper">
        {complains.map((complain) => (
          <div key={complain.Id} className="complain-item">
            <h3>{complain.Title}</h3>
            <p>{complain.Body}</p>
          </div>
        ))}
      </div>
    </>
  )
}
