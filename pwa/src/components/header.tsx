import * as React from 'react'
import * as styles from '../style/components/header.scss'
import { Link } from 'react-router-dom'

export const Header = () => <header className={styles.header} >
  <h1 className={styles.title} ><Link to='/' className={styles.link}>CMGT Showcase</Link></h1>
</header>