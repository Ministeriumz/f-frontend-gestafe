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
            border: 'none',
            backgroundColor: 'white',
            fontSize: 20,
            borderBottom: '1px solid #C8C8C8',
            width: '100%',
            maxHeight: '48px',
            maxWidth: '400px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          buttonStyle={{
            backgroundColor: 'white',
            width: '50px',
            border: 'none'
          }}
          dropdownClass="bg-white"
        />

      ) : (
        <input placeholder={placeholder} type={type} className={`glass-input p-3 rounded-lg max-h-[48px] w-full max-w-[400px] placeholder:text-[#7d8b8a] transition duration-300 focus:bg-white/70 text-black focus:shadow-xl/10 ${className}`} {...props}>

        </input>
      )}
    </>
  )
}
