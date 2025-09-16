import React from 'react'

export const Button = ({children, className = '', variant = 'default', size = 'md', asChild = false, ...props}) => {
  const Component = asChild ? 'span' : 'button'
  const sizeClasses = size === 'lg' ? 'h-11 px-6 text-base' : size === 'sm' ? 'h-8 px-3 text-sm' : 'h-10 px-4 text-sm'
  const variantClasses = variant === 'outline'
    ? 'border border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800'
    : variant === 'secondary'
    ? 'bg-gray-900 text-white hover:bg-black dark:bg-gray-100 dark:text-gray-900'
    : 'bg-blue-600 text-white hover:bg-blue-700'
  return (
    <Component className={`inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${sizeClasses} ${variantClasses} ${className}`} {...props}>
      {children}
    </Component>
  )
}


