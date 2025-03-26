'use client'

import useNote from '@/hooks/useNote';
import { Note } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { SidebarMenuButton } from './ui/sidebar';
import Link from 'next/link';
import { CalendarIcon } from 'lucide-react';

type Props = {
  note: Note;
}

function SelectNoteButton({ note }: Props) {
  const noteId = useSearchParams().get("noteId") || ""

  const { noteText: selectedNoteText } = useNote();
  const [localNoteText, setLocalNoteText] = React.useState(note.text)
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = React.useState(false)

  useEffect(() => {
    if (noteId === note.id) {
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
  
  const isSelected = note.id === noteId;
  const formattedDate = `${note.updatedAt.getDate()}/${note.updatedAt.getMonth() + 1}/${note.updatedAt.getFullYear()}`;
  
  // Get first line as title, rest as preview
  const lines = noteText.split('\n');
  const title = lines[0] || blankNotetext;
  
  return (
    <SidebarMenuButton 
      asChild 
      className={`
        items-start gap-1 pr-12 rounded-md transition-all
        ${isSelected ? "bg-sidebar-accent/60 border-l-4 border-primary pl-3" : "hover:bg-sidebar-accent/20"}
      `}
    >
      <Link href={`/?noteId=${note.id}`} className='flex h-fit w-full flex-col py-2'>
        <p className={`w-full overflow-hidden truncate text-ellipsis font-medium ${isSelected ? "text-primary" : ""}`}>
          {title}
        </p>
        <div className='flex items-center gap-1 mt-1'>
          <CalendarIcon className='size-3 text-muted-foreground/70' />
          <p className='text-xs text-muted-foreground'>
            {formattedDate}
          </p>
        </div>
      </Link>
    </SidebarMenuButton>
  )
}

export default SelectNoteButton