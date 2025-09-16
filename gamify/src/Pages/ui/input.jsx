import React from 'react'

export const Input = ({className = '', ...props}) => (
  <input className={`w-full border rounded p-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 ${className}`} {...props} />
)

export const Textarea = ({className = '', ...props}) => (
  <textarea className={`w-full border rounded p-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 ${className}`} {...props} />
)


