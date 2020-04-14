import * as React from 'react'
import * as style from '../style/components/content.scss'

export const Content = (props: { children: React.ReactNode}) => (
  <div className={style.wrapper} >{props.children}</div>
)


