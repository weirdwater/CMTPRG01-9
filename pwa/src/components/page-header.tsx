import * as React from 'react'
import { Header } from './header'
import styles from '../style/components/page-header.scss'

export const PageHeader = (props: { children: React.ReactNode }) => <section className={styles.header}>
  <Header />
  { props.children }
</section>
