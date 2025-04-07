"use client"

import type React from "react"

import { useState } from "react"
import "./ComplaintForm.css"
import ErrorMessage from "../shared/ErrorMessage/ErrorMessage"
import SubmitIcon from "../shared/icons/SubmitIcon"

interface ComplaintFormProps {
  onSubmit: (title: string, body: string) => Promise<void>
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [titleError, setTitleError] = useState("")
  const [bodyError, setBodyError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTitleError("") // reset title error
    setBodyError("") // reset body error

    let isValid = true // check validity
    if (!title.trim()) {
      setTitleError("Title is required")
      isValid = false
    }
    if (!body.trim()) {
      setBodyError("Description is required")
      isValid = false
    }
    if (!isValid) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(title, body)
      setTitle("")
      setBody("")
    } catch (error) {
      console.error("Error submitting complaint:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="complaint-form-container">
      <h2>Submit a Complaint</h2>
      <form className="complaint-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter complaint title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className={titleError ? "error" : ""}
          />
          {titleError && <ErrorMessage message={titleError} />}
        </div>

        <div className="form-group">
          <label htmlFor="body">Description</label>
          <textarea
            id="body"
            placeholder="Describe your complaint in detail"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={isSubmitting}
            rows={5}
            className={bodyError ? "error" : ""}
          />
          {bodyError && <ErrorMessage message={bodyError} />}
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="button-content">
              <span className="spinner"></span>
              Submitting...
            </span>
          ) : (
            <span className="button-content">
              <SubmitIcon />
              Submit Complaint
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default ComplaintForm