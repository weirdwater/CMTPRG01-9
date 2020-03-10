import { NextOpen } from "./api/types"
import { IOContinuation, Action, mkContinuation } from "./continuation"
import { HashResult, isHashResult } from "./hash-block"
import path = require("path")
import { Worker } from 'worker_threads'

export interface IdlePoolState {
  status: 'idle'
}

export interface WorkingPoolState {
  status: 'working'
  workers: Worker[]
}

export interface ResolvingPoolState<a> {
  status: 'resolving'
  workers: Worker[]
  result: a
}

export interface DonePoolState<a> {
  status: 'done'
  result: a
}

export type PoolState<a> =
  | IdlePoolState
  | WorkingPoolState
  | ResolvingPoolState<a>
  | DonePoolState<a>

export const mkIdlePoolState = (): IdlePoolState => ({
  status: 'idle'
})



export const mineworkerpool = (block: NextOpen) => (nonces: string[]): IOContinuation<PoolState<HashResult>,Action<PoolState<HashResult>>> => (s0) => mkContinuation({
  run: (cont) => {
    if (s0.status === 'idle') {
      const workers = nonces.map(n => new Worker(path.resolve(__dirname, 'worker.js'), {
        workerData: {
          path: 'mine-worker.ts',
          nonce: n,
          block: block
        }
      }))
      workers.forEach(w => w.on('message', result => {
        console.log('pool result:', result)
        cont(s1 => s1.status !== 'done' && s1.status === 'resolving' && isHashResult(result) ? {...s1, status: 'resolving', result } : s1)
      }))
      workers.forEach(w => w.on('exit', result => {
        console.log('worker exit:', result)
      }))
      workers.forEach(w => w.on('online', () => {
        console.log('worker online')
      }))
      workers.forEach(w => w.on('error', err => {
        console.log('worker error:', err)
      }))
      cont(s1 => s1.status === 'idle' ? {...s1, status: 'working', workers} : s1)
    }
    if (s0.status === 'resolving') {
      s0.workers.forEach(w => w.terminate())
      cont(s1 => s1.status === 'resolving' ? { status: 'done', result: s1.result } : s1)
    }
  }
})
