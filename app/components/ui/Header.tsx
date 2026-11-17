// O header do projeto
// The project header
import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className=' sticky flex flex-wrap items-center justify-between px-5 bg-[#111418] '>
        <Link href="/" className='flex items-center shrink-0'>
            <img src="/Logo.png" className='h-auto w-auto object-contain'/>
        </Link>  
      <nav className='flex items-center gap-3 text-white font-sans text-lg'>
                <Link href="/" className=' px-2 opacity-90 hover:opacity-100'>Home</Link>
                <Link href="/solution" className=' px-2 opacity-90 hover:opacity-100'>Solução</Link>
                <Link href="/simulation" className=' px-2 opacity-90 hover:opacity-100'>Simulação</Link>
      </nav>
    </header>
  )
}

export default Header
