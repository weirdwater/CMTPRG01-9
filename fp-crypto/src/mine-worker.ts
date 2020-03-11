
import { parentPort, workerData, isMainThread, threadId } from 'worker_threads';
import { mine } from './hash-block';

console.log(`[${isMainThread ? 'm' : 'w'}|${threadId}] Starting hash calculation.`)
const result = mine(workerData.block)(workerData.nonce)
console.log(`[${isMainThread ? 'm' : 'w'}|${threadId}] Finished hash calculation:`, result)

parentPort && parentPort.postMessage(result);
