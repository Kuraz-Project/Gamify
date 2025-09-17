import React from 'react'

export const Label = ({children, className = '', ...props}) => (
  <label className={`text-sm ${className}`} {...props}>{children}</label>
)

export const Separator = ({className = ''}) => (
  <hr className={`border-gray-200 dark:border-gray-800 ${className}`} />
)

export const Switch = ({checked, onCheckedChange}) => (
  <button onClick={() => onCheckedChange(!checked)} className={`w-10 h-6 rounded-full relative ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>
    <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full transition-all ${checked ? 'right-0.5' : 'left-0.5'}`}></span>
  </button>
)

export const Progress = ({value = 0, className = ''}) => (
  <div className={`w-full h-2 bg-gray-200 dark:bg-gray-800 rounded ${className}`}>
    <div className="h-2 bg-blue-600 rounded" style={{width: `${Math.min(100, Math.max(0, value))}%`}}></div>
  </div>
)


