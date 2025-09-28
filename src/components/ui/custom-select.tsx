"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SelectItem {
  value: string
  label: string
}

export interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  items: SelectItem[]
  className?: string
  disabled?: boolean
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ value, onValueChange, placeholder, items, className, disabled, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [selectedItem, setSelectedItem] = React.useState<SelectItem | null>(
      value ? items.find(item => item.value === value) || null : null
    )

    React.useEffect(() => {
      if (value) {
        const item = items.find(item => item.value === value)
        setSelectedItem(item || null)
      }
    }, [value, items])

    const handleSelect = (item: SelectItem) => {
      setSelectedItem(item)
      onValueChange?.(item.value)
      setOpen(false)
    }

    return (
      <div className="relative">
        <button
          ref={ref}
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onClick={() => setOpen(!open)}
          disabled={disabled}
          {...props}
        >
          <span className={selectedItem ? "text-gray-900" : "text-gray-500"}>
            {selectedItem ? selectedItem.label : placeholder || "Select an option"}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </button>
        
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="max-h-60 overflow-auto py-1">
              {items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-gray-900 outline-none hover:bg-blue-100 focus:bg-blue-100",
                    selectedItem?.value === item.value && "bg-blue-50"
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {selectedItem?.value === item.value && (
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }