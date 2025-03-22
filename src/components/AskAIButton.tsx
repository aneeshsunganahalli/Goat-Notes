'use client'

import React from 'react'
import { User } from "@supabase/supabase-js"

type Props = {
  user: User | null;
}

function AskAIButton({ user }: Props) {
  console.log(user?.email)
  return (
    <div>
      Ask Ai Button
    </div>
  )
}

export default AskAIButton
