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

export const getRandomNumber = async(): Promise<string> => {
  const res = await Axios.get<string>('https://www.random.org/integers/?num=1&min=0&max=9999&base=10&col=1&format=plain&rnd=new')

  if (res.status === 200) {
    return res.data
  }

  throw new Error(`Failed to fetch random number: ${res.status} ${res.statusText}`)
}
