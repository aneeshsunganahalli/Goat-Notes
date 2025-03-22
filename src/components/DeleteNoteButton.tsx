'use client'

import { Note } from '@prisma/client'
import React from 'react'

type Props = {
  noteId: string;
  deleteNoteLocally: (noteId: string) => void;

}

function DeleteNoteButton({noteId , deleteNoteLocally} : Props) {
  return (
    <div>
      D
    </div>
  )
}

export default DeleteNoteButton
