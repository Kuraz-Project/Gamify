import React from 'react'

export const Avatar = ({className = '', children}) => (
  <div className={`rounded-full overflow-hidden bg-gray-200 ${className}`}>{children}</div>
)

export const AvatarImage = ({src, alt = ''}) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" />
)

export const AvatarFallback = ({children, className = ''}) => (
  <div className={`w-full h-full flex items-center justify-center text-sm ${className}`}>{children}</div>
)


