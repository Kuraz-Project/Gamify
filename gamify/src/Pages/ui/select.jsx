import React, {useState} from 'react'

export const Select = ({value, onValueChange, disabled, children}) => (
  <div className={`relative ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>{children}</div>
)

export const SelectTrigger = ({children, className = '', onClick}) => (
  <button type="button" onClick={onClick} className={`w-full border rounded p-2 text-left bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 ${className}`}>{children}</button>
)

export const SelectValue = ({placeholder}) => (
  <span className="text-gray-600 dark:text-gray-300">{placeholder}</span>
)

export const SelectContent = ({children}) => (
  <div className="mt-2 border rounded p-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">{children}</div>
)

export const SelectItem = ({value, children, onClick}) => (
  <button type="button" onClick={onClick} className="block w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">{children}</button>
)


