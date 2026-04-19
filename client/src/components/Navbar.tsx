import React from 'react'
import { ModeToggle } from './mode-toggle'

export default function Navbar() {
  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-slate-50/80 dark:bg-[#0c1729]/80 backdrop-blur-xl border-b border-border/50 shadow-sm'>
        <div className='px-10 py-5 flex justify-between'>
            <h1 className='text-4xl font-bold'>Shopwiz</h1>

        <div>
            <ModeToggle />
        </div>
        </div>
    </nav>
  )
}
