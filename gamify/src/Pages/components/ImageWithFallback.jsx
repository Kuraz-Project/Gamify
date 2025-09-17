import React, {useState} from 'react'

export const ImageWithFallback = ({src, alt = '', className = ''}) => {
  const [error, setError] = useState(false)
  const fallback = 'https://via.placeholder.com/800x450?text=Image'
  return <img src={error ? fallback : src} alt={alt} onError={() => setError(true)} className={className} />
}


