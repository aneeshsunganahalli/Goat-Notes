import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='relative flex h-24 w-full items-center justify-between bg-popover'>
      <Link href="/">
        <Image
        src="/goatius.png"
        height={60}
        width={60}
        alt='logo'
        className='rounded-full'
        priority 
        />
      </Link>
    </div>
  )
}

export default Header
