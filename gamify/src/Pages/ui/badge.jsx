import React from 'react'

export const Badge = ({children, className = '', variant = 'default'}) => {
  const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium'
  const style = variant === 'secondary'
    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    : variant === 'outline'
    ? 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200'
    : 'bg-blue-600 text-white'
  return <span className={`${base} ${style} ${className}`}>{children}</span>
}


