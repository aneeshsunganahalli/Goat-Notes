'use client'

import React from 'react'
import { Note } from '@prisma/client'

type Props = {
  notes: Note[]
}

function SidebarGroupContent({notes} : Props) {
  return (
    <div>
      Your Notes here
    </div>
  )
}

export default SidebarGroupContent

