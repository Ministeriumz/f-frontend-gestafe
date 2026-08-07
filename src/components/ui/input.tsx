import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import PhoneInput from "react-phone-input-2"

import "react-phone-input-2/lib/style.css"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  type?: React.HTMLInputTypeAttribute | "telefone"
  onValueChange?: (value: string) => void
}

function Input({ className, type, onValueChange, ...props }: InputProps) {
  if (type === "telefone") {
    const { value, disabled, placeholder, required, name, id } = props

    return (
      <PhoneInput
        country="br"
        enableSearch
        countryCodeEditable={false}
        value={typeof value === "string" ? value : ""}
        onChange={(phone) => onValueChange?.(phone)}
        disabled={disabled}
        placeholder={placeholder}
        inputProps={{ name, id, required }}
        containerClass={cn("w-full", className)}
        inputClass="!h-8 !w-full !rounded-lg !border-input !bg-transparent !pl-12 !text-sm !text-foreground"
        buttonClass="!rounded-l-lg !border-input !bg-transparent"
        dropdownClass="!bg-popover !text-popover-foreground"
      />
    )
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 p-5",
        className
      )}
      {...props}
    />
  )
}

export { Input }
