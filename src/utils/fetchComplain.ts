import { Complain } from "../interfaces/types/types";
import { wait } from "./wait";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
export const fetchComplains = async (): Promise<Complain[]> => {
  await wait(2000);
  const response = await fetch(`${baseUrl}${listPath}`);
  const data: Complain[] = await response.json();
  return data;
};
