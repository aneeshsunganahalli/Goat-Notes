'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { logOutAction } from '@/actions/users'

function LogOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogOut = async () => {
    setLoading(true)

    const {errorMessage} = await logOutAction();

    if (!errorMessage){
      toast("Logged Out", { 
        description: "You have been successfully logged out",
        className: "success",
      })
      router.push("/")
    } else {
      toast("Error", {
        description: errorMessage,
        className: "error",
      })
    }
    setLoading(false)
  }

  return (
    <Button onClick={handleLogOut} 
    variant="outline" 
    disabled={loading}
    className='w-24'>
      {loading ? <Loader2 className='animate-spin' /> : "Log Out"}
    </Button>
  )
}

export default LogOutButton

