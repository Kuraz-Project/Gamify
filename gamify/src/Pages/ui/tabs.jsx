import React, {useState} from 'react'

export const Tabs = ({value, onValueChange, children, className = '', defaultValue}) => {
  const [internal, setInternal] = useState(defaultValue || value || '')
  const active = value ?? internal
  const setActive = onValueChange ?? setInternal
  return <div className={className}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, {active, setActive}) : child)}</div>
}

export const TabsList = ({children, className = '', active, setActive}) => (
  <div className={`inline-grid gap-2 rounded-md bg-gray-100 p-1 dark:bg-gray-800 ${className}`}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, {active, setActive}) : child)}</div>
)

export const TabsTrigger = ({value, children, active, setActive, className = ''}) => (
  <button onClick={() => setActive(value)} className={`px-3 py-2 rounded text-sm ${active === value ? 'bg-white dark:bg-gray-900 shadow' : 'text-gray-600 dark:text-gray-300'} ${className}`}>{children}</button>
)

export const TabsContent = ({value, active, children, className = ''}) => (
  active === value ? <div className={className}>{children}</div> : null
)


