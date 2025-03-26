'use client'

import { User } from '@supabase/supabase-js'
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {v4 as uuidv4} from 'uuid'
import { toast } from 'sonner';
import { createNoteAction } from '@/actions/note';

type Props = {
  user : User | null;
}

function NewNoteButton({user}: Props) {
  const [loading,setLoading] = useState(false)
  const router = useRouter();
  
  const handleClickNewNoteButton = async () => {
    if (!user) {
      router.push("/login")
    } else {
      setLoading(true)

      const uuid = uuidv4()
      await createNoteAction(uuid)
      router.push(`/?noteId=${uuid}`)

      toast("New Note Created", {
        description: "You have created a new note",
        className: "success"
      })

      setLoading(false)
    }
  }

  return (
    <Button
    onClick={handleClickNewNoteButton}
    variant="secondary"
    disabled={loading}
    className='w-24 bg-emerald-500 rounded-2xl'
    >
      {loading ? <Loader2 className='animate-spin' />: "New Note" }
    </Button>
  )
}

export default NewNoteButton
