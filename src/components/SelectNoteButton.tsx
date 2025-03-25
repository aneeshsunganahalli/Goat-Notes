'use client'

import useNote from '@/hooks/useNote';
import { Note } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { SidebarMenuButton } from './ui/sidebar';
import Link from 'next/link';

type Props = {
  note: Note;
}

function SelectNoteButton({note}: Props) {
  const noteId = useSearchParams().get("noteId") || ""

  const {noteText: selectedNoteText} = useNote();
  const [localNoteText, setLocalNoteText] = React.useState(note.text)
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = React.useState(false)

  useEffect(() => {
    if ( noteId === note.id) {
      setShouldUseGlobalNoteText(true)
    } else {
      setShouldUseGlobalNoteText(false)
    }
  }, [noteId, note.id])

  useEffect(() => {
    if (shouldUseGlobalNoteText) {
      setLocalNoteText(selectedNoteText)
    }
  }, [selectedNoteText, shouldUseGlobalNoteText])

  const blankNotetext = "EMPTY NOTE";
  let noteText = localNoteText || blankNotetext;
  if (shouldUseGlobalNoteText) {
    noteText = selectedNoteText || blankNotetext
  }
  return (
    <SidebarMenuButton asChild className={`items-start gap-0 pr-12 ${note.id === noteId && "bg-sidebar-accent/50"}`}>
      <Link href={`/?noteId=${note.id}`} className='flex h-fit flex-col'>
        <p className='w-full overflow-hidden truncate text-ellipsis whitespace-nowrap'>
          {noteText}
        </p>
        <p className='text-xs text-muted-foreground'>{note.updatedAt.toLocaleDateString()}</p>
      </Link>
    </SidebarMenuButton>
  )
}

export default SelectNoteButton
