
import { parentPort, workerData } from 'worker_threads';
import { mine } from './hash-block';

parentPort && parentPort.postMessage(mine(workerData.block)(workerData.nonce));
