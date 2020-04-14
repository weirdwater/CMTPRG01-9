import * as React from 'react'
import { Maybe } from '../lib/maybe'
import styles from '../style/components/tag-list.scss'
import { Link } from 'react-router-dom'

export const TagList = ({ tags, selected }: { tags: string[], selected: Maybe<string> }) => (
  <ul className={styles.list} >
    { tags.map(t => <li key={t} className={selected.eq(t) ? styles.selected : ''} ><Link to={`/?tag=${t}`}>{t}</Link></li>) }
  </ul>
)
