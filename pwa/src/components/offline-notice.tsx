import * as React from 'react'
import style from '../style/components/offline-notice.scss'
import { Airplane } from '../icons'

export const OfflineNotice = (props: {}) => (
  <aside className={style.notice} >
    <div className={style.passePartout} >
      <Airplane className={style.icon} />
    </div>
    <p>You are looking at downloaded content. Re-connect to the internet to see new content.</p>
  </aside>
)
