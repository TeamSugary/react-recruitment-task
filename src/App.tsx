import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import "./App.css";

const baseUrl = "https://sugarytestapi.azurewebsites.net/TestApi";
const listPath = "/GetComplains";
const savePath = "/SaveComplain";

class Complain {
  Title: string;
  Body: string;
  CreatedAt?: string;
  Id?: number;

  constructor(Title: string, Body: string) {
    this.Title = Title;
    this.Body = Body;
  }
}

type AddApiResponse<T> = {
  Success: boolean;
  Message: string | null;
  ReturnCode: number;
  Data: T | null;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  return formattedDate;
};

function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [searchedComplains, setSearchedComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch complaints  data from api(database )
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: Complain[] = await response.json();
      const filteredData = data.filter((d) => !!d.Body && !!d.Title);
      setComplains(filteredData);
      setSearchedComplains(filteredData);
    } catch {
      setErrorMessage("Failed to load complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = () => {
    let inputErrorText = "";
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("title");
      inputErrorText += "Please write title";
    }

    if (!body.trim()) {
      errors.push("body");
      inputErrorText += inputErrorText ? " & body" : "Please write complain";
    }

    setInputErrors(errors);

    if (inputErrorText) {
      setErrorMessage(inputErrorText);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    let timeoutId;
    if (!validateInput()) return;

    try {
      setIsSaving(true);
      setErrorMessage("");
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new Complain(title, body)),
      });

      const data: AddApiResponse<Complain> = await response.json();
      const isSuccess = data.Success;
      if (!isSuccess) return setErrorMessage("Failed added complain.");
      clearTimeout(timeoutId);
      setShowToast(true);
      timeoutId = setTimeout(() => {
        setShowToast(false);
      }, 1000);

      await fetchComplains();

      window.scroll({ top: 0, left: 0, behavior: "smooth" });

      setSearch("");
      setTitle("");
      setBody("");
      setInputErrors([]);
    } catch {
      setErrorMessage("Fail saving new complaint.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);

    filterComplains(searchValue, startDate, endDate);
  };

  const handleDateFilter = (
    startDate: string | null,
    endDate: string | null
  ) => {
    setStartDate(startDate || "");
    setEndDate(endDate || "");

    filterComplains(search, startDate, endDate);
  };

  const filterComplains = (
    searchValue: string,
    startDate: string | null,
    endDate: string | null
  ) => {
    let filteredComplains = complains;

    if (searchValue) {
      filteredComplains = filteredComplains.filter(
        (complain) =>
          complain.Title.toLowerCase().includes(searchValue.toLowerCase()) ||
          complain.Body.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    filteredComplains = filteredComplains.filter((complain) => {
      const complainDate = new Date(complain.CreatedAt || "")
        .toISOString()
        .split("T")[0];
      const matchesStartDate = startDate ? complainDate >= startDate : true;
      const matchesEndDate = endDate ? complainDate <= endDate : true;
      return matchesStartDate && matchesEndDate;
    });

    setSearchedComplains(filteredComplains);
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="wrapper">
      <div>
        <h2 className="header-title">CMS</h2>
      </div>
      <title>CMS</title>
      <h2 className="submit-complaint">Submit a Complaint</h2>
      <ComplainForm
        title={title}
        body={body}
        isSaving={isSaving}
        inputErrors={inputErrors}
        errorMessage={errorMessage}
        onTitleChange={setTitle}
        onBodyChange={setBody}
        onSubmit={handleSubmit}
      />
      <div className="complain-list-header">
        <h2>Complaints List</h2>
        <Search
          handleSearch={handleSearch}
          search={search}
          setSearch={setSearch}
        />
        <Dropdown
          icon={
            <svg
              className="dropdown-icon"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
            </svg>
          }
        >
          <DateRangePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onChange={handleDateFilter}
          />
        </Dropdown>
      </div>
      <ComplainList
        search={search}
        complains={searchedComplains}
        isLoading={isLoading}
      />

      {showToast && (
        <p className="toast" role="status">
          Added a new complain.
        </p>
      )}

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Complaint Management System(CMS).
        </p>
      </footer>
    </div>
  );
}

export default App;

interface SearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ search, setSearch, handleSearch }: SearchProps) => {
  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e);
      }}
      type="search"
      name="search"
      id="search"
      placeholder="🔍 Search Complain"
      aria-label="Search complaints by title."
      aria-describedby="search-ins"
    />
  );
};

interface ComplainFormProps {
  title: string;
  body: string;
  isSaving: boolean;
  inputErrors: string[];
  errorMessage: string;
  onTitleChange: (val: string) => void;
  onBodyChange: (val: string) => void;
  onSubmit: () => void;
}

const ComplainForm = ({
  title,
  body,
  isSaving,
  inputErrors,
  errorMessage,
  onTitleChange,
  onBodyChange,
  onSubmit,
}: ComplainFormProps) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!inputErrors.length) return;
    const setFocus = (el: HTMLInputElement | HTMLTextAreaElement) => el.focus();

    if (inputErrors.includes("title") && titleInputRef.current) {
      setFocus(titleInputRef.current);
    } else if (inputErrors.includes("body") && descriptionInputRef.current) {
      setFocus(descriptionInputRef.current);
    }
  }, [inputErrors]);

  return (
    <div className="complain-form">
      <input
        ref={titleInputRef}
        data-input-error={inputErrors.includes("title")}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Complaint Title"
        aria-invalid={inputErrors.includes("title")}
      />
      <textarea
        ref={descriptionInputRef}
        data-input-error={inputErrors.includes("body")}
        placeholder="Enter your complaint"
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        aria-label="Complaint Body"
        aria-invalid={inputErrors.includes("body")}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button
        onClick={onSubmit}
        disabled={isSaving}
        className={`${isSaving ? "pointer-none" : ""}`}
      >
        {isSaving ? <div className="loader" /> : "Submit Complaint"}
      </button>
    </div>
  );
};

interface ComplainListProps {
  complains: Complain[];
  isLoading: boolean;
  search: string;
}

const ComplainList = memo(
  ({ complains, isLoading, search }: ComplainListProps) => {
    if (isLoading)
      return (
        <div
          className="loader"
          role="status"
          aria-label="Loading complaints..."
        />
      );
    if (!complains.length)
      return (
        <p role="status" aria-live="polite">
          No added complain here.{" "}
          <em>
            {" "}
            <strong>{search ? `for ${search}` : ""}</strong>
          </em>
        </p>
      );

    return (
      <>
        {search && (
          <p role="status" aria-live="polite">
            Please wait Show complains....{" "}
            <em>
              <strong>
                {search} ({complains.length})
              </strong>
            </em>
          </p>
        )}

        <div className="complain-list-wrapper">
          {complains.map((complain) => {
            const title = complain.Title;
            const body = complain.Body;
            const regex = new RegExp(`(${search})`, "gi");
            const highlightedTitle = title.split(regex).map((part, index) =>
              part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} className="highlight">
                  {part}
                </span>
              ) : (
                part
              )
            );

            const highlightedBody = body.split(regex).map((part, index) =>
              part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} className="highlight">
                  {part}
                </span>
              ) : (
                part
              )
            );
            return (
              <div key={complain.Id} className="complain-item" role="list">
                <div>
                  <p className="sl-show">SL. NO: {complain.Id}</p>
                </div>
                <h3 className="title-text">
                  TiTLE: <span className="only-title">{highlightedTitle}</span>
                </h3>

                <p className="message-text">
                  MESSAGE:{" "}
                  <span className="only-message">{highlightedBody}</span>
                </p>
                <div>
                  <strong className="date-show">
                    <em>{formatDateTime(complain?.CreatedAt || "")}</em>
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
);
interface DropdownProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const Dropdown = ({ children, icon }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleDropdownClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
  );
};

interface DateRangePickerProps {
  onChange: (startDate: string | null, endDate: string | null) => void;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

const DateRangePicker = ({
  onChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DateRangePickerProps) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    onChange(newStartDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    onChange(startDate, newEndDate);
  };
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    onChange("", "");
  };

  return (
    <div className="date-range-picker">
      <em className="date-header">
        <strong>Date ways filter</strong>
        {(startDate || endDate) && (
          <button className="reset-btn" onClick={handleReset}>
            &times;
          </button>
        )}
      </em>
      <div className="date-input">
        <label htmlFor="start-date">start date</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
      </div>

      <div className="date-input">
        <label htmlFor="end-date">end date</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
      </div>
    </div>
  );
};
