import * as React from 'react'
import styles from '../style/components/responsive-image.scss'

export const ResponsiveImage = ({src, ratio}: {src: string, ratio?: number}) => {
  const style = { '--image-ratio': ratio && ratio <= 1 && ratio > 0 ? ratio : 1 } as React.CSSProperties
  return (
    <div className={styles.ratioWrapper} style={style} >
      <img src={src} className={styles.image} />
    </div>
  )
}
