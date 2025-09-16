import React from 'react'

export const Card = ({children, className = ''}) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>{children}</div>
)

export const CardHeader = ({children, className = ''}) => (
  <div className={`p-6 border-b border-gray-100 dark:border-gray-800 ${className}`}>{children}</div>
)

export const CardTitle = ({children, className = ''}) => (
  <h3 className={`font-semibold ${className}`}>{children}</h3>
)

export const CardDescription = ({children, className = ''}) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
)

export const CardContent = ({children, className = ''}) => (
  <div className={`p-6 ${className}`}>{children}</div>
)


