import React from 'react'
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type TiposInput = {
  placeholder: string,
  type?: string,
  className?: string,
} & React.InputHTMLAttributes<HTMLInputElement>

export default function Input({ placeholder, type = 'text', className = '', ...props }: TiposInput) {
  return (
    <>
      {type == 'telefone' ? (
        <PhoneInput
          country={'br'}
          enableSearch
          countryCodeEditable={false}
          placeholder='Telefone'
          inputStyle={{
            padding: '0.75rem',
            border: '1px solid transparent',
            backgroundColor: 'var(--surface-strong)',
            color: 'var(--foreground)',
            fontSize: 16,
            width: '100%',
            height: '46px',
            maxWidth: '400px',
            borderRadius: '0.5rem',
            boxShadow: '0 3px 10px color-mix(in srgb, var(--foreground) 8%, transparent)',
          }}
          buttonStyle={{
            backgroundColor: 'var(--surface-strong)',
            width: '50px',
            border: '1px solid transparent',
            borderRadius: '0.5rem 0 0 0.5rem'
          }}
          dropdownClass="!bg-background !text-foreground"
        />

      ) : (
        <input placeholder={placeholder} type={type} className={`glass-input p-3 rounded-lg h-[46px] w-full max-w-[400px] placeholder:text-foreground/50 transition duration-200 focus:bg-foreground/5 text-foreground focus:shadow-md ${className}`} {...props}>

        </input>
      )}
    </>
  )
}
