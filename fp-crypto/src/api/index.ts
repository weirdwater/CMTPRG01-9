import { Next } from "./types";
import Axios from "axios";

const baseUrl = 'https://programmeren9.cmgt.hr.nl:8000/api/blockchain'

export const getNext = async(): Promise<Next> => {
  const res = await Axios.get<Next>(baseUrl + '/next')

  if (res.status === 200) {
    return res.data
  }

  throw new Error(`Failed to fetch next blockchain data: ${res.status} ${res.statusText}`)
}
