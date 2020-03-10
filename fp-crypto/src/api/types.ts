
export interface TransactionData {
  _id: string
  from: string
  to: string
  amount: number
  timestamp: number
}

export type Transaction = TransactionData & { __v: number }

export interface Block {
  _id: string
  algorithm: string
  hash: string
  nonce: string
  timestamp: number
  __v: 0
  data: TransactionData[]
}

export interface NextOpen {
  blockchain: Block
  transactions: Transaction[]
  timestamp: number
  algorithm: string
  open: true
  countdown: number
}

export interface NextClosed {
  open: false
  message: string
  countdown: number
}

export type Next = NextOpen | NextClosed

export interface SolutionDTO {
  nonce: string
  user: string
}

export interface SolutionResponse {
  message: string
}
