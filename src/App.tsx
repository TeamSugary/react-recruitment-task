import { useState, useEffect } from 'react';

interface Complain {
  Id: number;
  Title: string;
  Body: string;
  solved?: boolean;
}

interface ApiResponse {
  Success: boolean;
  Data?: Complain[];
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";



function App() {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data: ApiResponse = await response.json();
      if (data.Success && data.Data) {
        setComplains(data.Data);
      }
    } catch (error) {
      setErrorMessage(`Failed to load complaints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),
      });
      const data: ApiResponse = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");
      setTitle("");
      setBody("");
      fetchComplains();
    } catch (e) {
      setErrorMessage(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchComplains();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#051937] via-[#004d7a] via-[#008793] via-[#00bf72] to-[#a8eb12] text-[#f0f0f0] flex justify-center items-center font-sans p-8">
      <div className="max-w-xl w-full space-y-8">
        {/* Complaint Form Section */}
        <h2 className="text-2xl font-bold mb-4 text-white">Submit a Complaint</h2>
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl shadow-lg border border-white/20 ">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 bg-white/10 rounded-3xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70  placeholder:text-base"
              />
            </div>
            
            <div>
              <textarea
                placeholder="Enter your complaint"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-2 bg-white/10 rounded-3xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 placeholder-white/70  placeholder:text-base"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-3xl bg-gradient-to-r from-[#FF666D] via-[#C89B77] to-[#FFB871] ... transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white font-xl font-semibold"
            >
              {isSaving ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* Complaints List Section */}
        <h2 className="text-2xl font-bold mb-1 text-white">Complaints List</h2>
        <div className=" bg-transparent  ">
          
          {isLoading ? (
            <div className="text-center text-white/80">Loading...</div>
          ) : errorMessage ? (
            <div className="text-red-200 text-sm">{errorMessage}</div>
          ) : (
            <div className="space-y-4">
              {complains.map((complain : Complain) => (
                <div 
                key={complain.Id} 
                className=" p-6 rounded-3xl shadow-xl border border-white/20 bg-white/20 backdrop-blur-sm "
              >
                <div className="flex justify-between items-start">
                  <div>
                    {complain.Title && (
                      <p className="text-white font-bold text-lg">{complain.Title}</p>
                    )}
                    <p className="text-white font-medium text-base mt-1">{complain.Body}</p>
                  </div>
                  {complain.solved && (
                    <span className="text-xs bg-green-500/20 text-green-100 px-2 py-1 rounded-full">
                      solved
                    </span>
                  )}
                </div>
              </div>
              
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;