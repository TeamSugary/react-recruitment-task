import { baseUrl, listPath } from "../App";
import { Complain } from "../interfaces/types/types";
import { wait } from "./wait";

export const fetchComplains = async ():Promise<Complain[]> => {
  await wait(2000);
  const response = await fetch(`${baseUrl}${listPath}`);
  const data: Complain[] = await response.json();
  return data;
};
