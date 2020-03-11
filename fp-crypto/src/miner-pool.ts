import { NextOpen } from "./api/types"
import { IOContinuation, Action, mkContinuation } from "./continuation"
import { HashResult, isHashResult } from "./hash-block"
import path = require("path")
import { Worker } from 'worker_threads'
import { workers } from "cluster"

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

let worker: Worker | undefined = undefined

export const mineworker = (block: NextOpen) => (nonce: string): Promise<HashResult> => new Promise((res, rej) => {
  const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
    workerData: {
      path: 'mine-worker.ts',
      nonce: nonce,
      block: block
    }
  })
  worker.on('message', res)
  worker.on('error', rej)
  worker.on('exit', code => code !== 0 && rej(`Worker stopped with exit code ${code}`))
})

export const mineworkerpool = (block: NextOpen) => (nonce: string): IOContinuation<PoolState<HashResult>,Action<PoolState<HashResult>>> => (s0) => mkContinuation({
  run: (cont) => {
    if (s0.status === 'idle') {
      if (worker === undefined) {
        worker = new Worker(path.resolve(__dirname, 'worker.js'), {
          workerData: {
            path: 'mine-worker.ts',
            nonce: nonce,
            block: block
          }
        })
      }
      worker.on('message', result => {
        console.log('pool result:', result)
        cont(s1 => s1.status !== 'done' && s1.status === 'resolving' && isHashResult(result) ? {...s1, status: 'resolving', result } : s1)
      })
      worker.on('exit', result => {
        console.log('worker exit:', result)
      })
      worker.on('online', () => {
        console.log('worker online')
      })
      worker.on('error', err => {
        console.log('worker error:', err)
      })
      cont(s1 => s1.status === 'idle' && worker ? {...s1, status: 'working', workers: [ worker ]} : s1)
    }
    if (s0.status === 'resolving') {
      worker && worker.terminate().then(() => worker = undefined)
      cont(s1 => s1.status === 'resolving' ? { status: 'done', result: s1.result } : s1)
    }
  }
})
