import { useCallback, useEffect, useReducer } from "react";
import "./App.css";

const BASE_URL = "https://sugarytestapi.azurewebsites.net";

function App() {
  const [state, dispatch] = useAppReducer();

  const fetchComplains = useCallback(async () => {
    try {
      const response = await fetch(BASE_URL + "/TestApi/GetComplains");
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch complains");
      dispatch({ type: "COMPLAINS_DATA", payload: data });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch({
        type: "ERRORS",
        payload: { data: error.message || "Something went wrong" },
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.loading) return;

    dispatch({ type: "ERRORS", payload: {} });
    const errors = validateForm(state.formData);

    if (Object.keys(errors).length) {
      dispatch({ type: "ERRORS", payload: errors });
      return;
    }

    try {
      dispatch({ type: "LOADING", payload: true });
      const response = await fetch(BASE_URL + "/TestApi/SaveComplain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.formData),
      });

      const data = await response.json();

      if (!data.Success) throw new Error(data.Message);

      await fetchComplains();
      dispatch({ type: "LOADING", payload: false });
      dispatch({ type: "FORM_DATA", payload: { Title: "", Body: "" } });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch({ type: "LOADING", payload: false });
      dispatch({
        type: "ERRORS",
        payload: { request: error.message || "Something went wrong" },
      });
    }
  }

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <main className="main-container">
      <div className="content-container">
        <div className="form-card">
          <h2 className="form-title">Submit a Complaint</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={state.formData.Title}
                onChange={(e) =>
                  dispatch({
                    type: "FORM_DATA",
                    payload: { Title: e.target.value },
                  })
                }
                placeholder="Enter complaint title"
                className={`form-input ${
                  state.errors.Title ? "error-border" : ""
                }`}
                disabled={state.loading}
              />
              {state.errors.Title && (
                <p className="error-message">{state.errors.Title}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={state.formData.Body}
                onChange={(e) =>
                  dispatch({
                    type: "FORM_DATA",
                    payload: { Body: e.target.value },
                  })
                }
                placeholder="Enter complaint description"
                className={`form-textarea ${
                  state.errors.Body ? "error-border" : ""
                }`}
                disabled={state.loading}
              />
              {state.errors.Body && (
                <p className="error-message">{state.errors.Body}</p>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={state.loading}
            >
              <span className="button-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {state.loading ? "Submitting..." : "Submit Complaint"}
            </button>
            {state.errors.request && (
              <p className="error-message">{state.errors.request}</p>
            )}
          </form>
        </div>
        <div className="complains-card">
          <h2 className="complains-title">Complaints List</h2>

          {state.complains.length ? (
            <div className="complains-list">
              {state.complains.map((complain) => (
                <ComplainItem key={complain.Id} item={complain} />
              ))}
            </div>
          ) : state.errors.data ? (
            <div className="error-message">{state.errors.data}</div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </main>
  );
}

function ComplainItem({ item }: { item: ComplainType }) {
  return (
    <div className="complaint-item">
      <div className="complaint-header">
        <h3 className="complaint-title">{item.Title}</h3>
      </div>

      <div className="complaint-date">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8V12L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{formatDate(item.CreatedAt)}</span>
      </div>

      <p className="complaint-description">{item.Body}</p>
    </div>
  );
}

type ComplainType = {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
};

type FormData = {
  Title: string;
  Body: string;
};

type StateError = FormData & {
  request: string;
  data: string;
};

type State = {
  formData: FormData;
  errors: Partial<StateError>;
  loading: boolean;
  complains: ComplainType[];
};

type Action =
  | { type: "FORM_DATA"; payload: Partial<FormData> }
  | {
      type: "ERRORS";
      payload: Partial<StateError>;
    }
  | { type: "LOADING"; payload: boolean }
  | { type: "COMPLAINS_DATA"; payload: ComplainType[] };

const initialState: State = {
  formData: { Title: "", Body: "" },
  errors: {},
  loading: false,
  complains: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FORM_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "ERRORS":
      return { ...state, errors: action.payload };
    case "LOADING":
      return { ...state, loading: action.payload };
    case "COMPLAINS_DATA":
      return { ...state, complains: action.payload };
    default:
      return state;
  }
}

function useAppReducer() {
  return useReducer(reducer, initialState);
}

function validateForm(formData: FormData): Partial<FormData> {
  const errors: Partial<FormData> = {};
  if (!formData.Title.trim()) errors.Title = "Title is required.";
  if (!formData.Body.trim()) errors.Body = "Description is required.";
  return errors;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export default App;
