// O footer do projeto
// The project footer
import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='fixed bottom-0 w-full bg-[#111418]'>
        <div className="mx-auto flex py-10 justify-center ">
            <div className='opacity-70 px-5'>
                <p>&copy; 2026 High Water. Todos os direitos reservados.</p>
            </div>
            <nav className='flex items-center px-10  text-white'>
                    <Link href="/" className=' px-2 opacity-70 hover:opacity-100 '>Home</Link>
                    <Link href="/Solution" className=' px-2 opacity-70 hover:opacity-100'>Solução</Link>
                    <Link href="/Simulation" className=' px-2 opacity-70 hover:opacity-100'>Simulação</Link>            
            </nav>
            <div className="flex px-5 gap-4 opacity-70 text-white">
                        <a href="#" className="transition hover:opacity-100">
                            Política de Privacidade
                        </a>

                        <a href="#" className="transition hover:opacity-100">
                            Termos de Uso
                        </a>

                        <a href="#" className="transition hover:opacity-100">
                            Cookies
                        </a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
