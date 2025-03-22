'use client'

import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { Textarea } from './ui/textarea';
import { debounceTimeOut } from '@/lib/constants';
import useNote from '@/hooks/useNote';
import { updateNoteAction } from '@/actions/note';

type Props = {
  noteId: string;
  startingNoteText: string;
}

let updateTimeOut: NodeJS.Timeout

function NoteTextInput({noteId, startingNoteText}: Props) {
  const noteIdParam = useSearchParams().get("noteId") || "";
  const {noteText, setNoteText} = useNote();

  useEffect(()=> {
    if (noteIdParam === noteId) {
      setNoteText(startingNoteText)
    }
  }, [startingNoteText, noteId, noteIdParam, setNoteText])

  const handleUpdateNote = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setNoteText(text);

    clearTimeout(updateTimeOut)
    updateTimeOut = setTimeout(() => {
      updateNoteAction(noteId, text)
    }, debounceTimeOut)

  }
  return (<Textarea
  value={noteText}
  onChange={handleUpdateNote}
  placeholder='Type your notes here..'
  className='custom-scrollbar mb-4 h-full max-w-4xl resize-none border p-4 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0' />
  )
}


export default NoteTextInput
