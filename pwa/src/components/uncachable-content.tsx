import * as React from 'react'
import { Block } from '../icons'
import styles from '../style/components/uncachable-content.scss'
import { AsyncState, isError, isLoaded, isLoading } from '../lib/async'

export function UncacheableContent<a>({ state, children }: { state: AsyncState<a>, children: React.ReactNode }): JSX.Element {

  if (isLoaded(state)) {
    return <>{children}</>
  }

  if (isError(state)) {
    return (
      <div className={styles.error} >
        <Block className={styles.icon} />
        <p className={styles.message}>You are disconnected from the internet. Please re-connect to load available tags.</p>
      </div>
    )
  }

  if (isLoading(state)) {
    return (
      <div className={styles.shortMessage} >
        Loading...
      </div>
    )
  }

  return (
    <div className={styles.shortMessage} >
      Waiting...
    </div>
  )
}
