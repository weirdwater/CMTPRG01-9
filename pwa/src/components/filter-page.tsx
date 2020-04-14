import * as React from 'react'
import { CheveronRight, CloseOutline, Tag } from '../icons'
import { mkLoadedAsync, AsyncState, isLoaded } from '../lib/async'
import { Maybe, mkNone, mkSome } from '../lib/maybe'
import styles from '../style/components/filter-page.scss'
import { TagList } from './tag-list'
import { UncacheableContent } from './uncachable-content'

export const FilterPage = (props: {
  children: React.ReactNode,
  tags: AsyncState<string[]>,
  open: boolean,
  selected: Maybe<string> ,
  onToggleTray: () => void,
  onChange: (t: Maybe<string>) => void
}) => (
  <div className={styles.wrapper} >
    <div className={styles.content} >
      {props.children}
    </div>
    <section className={[styles.tray, props.open ? styles.open : styles.closed].join(' ')} >
      <div className={styles.trayContent} >
        <h1 className={styles.heading} >Tags</h1>
        <UncacheableContent<string[]> state={props.tags} >
          { isLoaded(props.tags) && <TagList tags={props.tags.value} selected={props.selected} onChange={t => props.onChange(mkSome(t))} /> }
        </UncacheableContent>
      </div>
      <div className={styles.actions} >
        { props.open ? <button onClick={props.onToggleTray} ><CheveronRight className={styles.icon} />Close Tray</button> : <button onClick={props.onToggleTray}><Tag className={styles.icon} />Tags</button> }
        <button onClick={() => props.onChange(mkNone())} ><CloseOutline className={styles.icon} />Clear Tags</button>
      </div>
    </section>
  </div>
)
