'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogOut = async () => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve,2000))
    const errorMessage = "error"

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

export default LogoutButton

