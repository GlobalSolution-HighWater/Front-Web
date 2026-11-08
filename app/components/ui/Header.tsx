// O header do projeto
// The project header
import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='flex justify-between px-5 bg-[#111418] '>
        <Link href="/">
            <img src="/Logo.png" className='flex max-w-80'/>
        </Link>  
      <nav className='flex items-center px-10  text-white font-sans '>
                <Link href="/" className=' px-2'>Home</Link>
                <Link href="/Solution" className=' px-2'>Solução</Link>
                <Link href="/Simulation" className=' px-2'>Simulação</Link>
      </nav>
    </header>
  )
}

export default Header
