import * as React from 'react'
import styles from '../style/components/filter-page.scss'
import { Tag, CloseOutline, CheveronRight, Block } from '../icons'
import { Maybe, isSome } from '../lib/maybe'
import { OfflineNotice } from './offline-notice'
import { UncacheableContent } from './uncachable-content'
import { mkLoadingAsync, mkUnloadedAsync, mkErrorAsync, mkLoadedAsync } from '../lib/async'

export const FilterPage = (props: { children: React.ReactNode, tags: string[], open: boolean, selected: Maybe<string> }) => (
  <div className={styles.wrapper} >
    <div className={styles.content} >
      {props.children}
    </div>
    <section className={[styles.tray, props.open ? styles.open : styles.closed].join(' ')} >
      <div className={styles.trayContent} >
        <h1 className={styles.heading} >Tags</h1>
        <UncacheableContent<string> state={mkLoadedAsync('')} >
          <ul className={styles.tags} >
            { props.tags.map(t => <li key={t} className={props.selected.eq(t) ? styles.selected : ''} >{t}</li>) }
          </ul>
        </UncacheableContent>
      </div>
      <div className={styles.actions} >
        { props.open ? <button><CheveronRight className={styles.icon} />Close Tray</button> : <button><Tag className={styles.icon} />Tags</button> }
        <button><CloseOutline className={styles.icon} />Clear Tags</button>
      </div>
    </section>
  </div>
)
