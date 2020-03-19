import * as React from 'react'
import { CheveronRight, CloseOutline, Tag } from '../icons'
import { mkLoadedAsync } from '../lib/async'
import { Maybe } from '../lib/maybe'
import styles from '../style/components/filter-page.scss'
import { TagList } from './tag-list'
import { UncacheableContent } from './uncachable-content'

export const FilterPage = (props: { children: React.ReactNode, tags: string[], open: boolean, selected: Maybe<string> }) => (
  <div className={styles.wrapper} >
    <div className={styles.content} >
      {props.children}
    </div>
    <section className={[styles.tray, props.open ? styles.open : styles.closed].join(' ')} >
      <div className={styles.trayContent} >
        <h1 className={styles.heading} >Tags</h1>
        <UncacheableContent<string> state={mkLoadedAsync('')} >
          <TagList tags={props.tags} selected={props.selected} />
        </UncacheableContent>
      </div>
      <div className={styles.actions} >
        { props.open ? <button><CheveronRight className={styles.icon} />Close Tray</button> : <button><Tag className={styles.icon} />Tags</button> }
        <button><CloseOutline className={styles.icon} />Clear Tags</button>
      </div>
    </section>
  </div>
)
