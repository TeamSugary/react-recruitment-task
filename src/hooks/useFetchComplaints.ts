import { useEffect } from "react";
import { fetchComplains } from "../utils/fetchComplain";
import { useAppContext } from "../context/Context";

const useFetchComplaints = () => {
  const { setComplains, setIsLoading,refetchComplains } = useAppContext();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetchComplains();
        if (isMounted) setComplains(response);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

   
      fetchData();
    return () => {
      isMounted = false;
    };
  }, [refetchComplains]);
};

export default useFetchComplaints;
