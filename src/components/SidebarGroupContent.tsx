'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Note } from '@prisma/client'
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu, SidebarMenuItem } from './ui/sidebar'
import { FolderOpenIcon, SearchIcon } from 'lucide-react'
import { Input } from './ui/input'
import Fuse from 'fuse.js'
import SelectNoteButton from './SelectNoteButton'
import DeleteNoteButton from './DeleteNoteButton'

type Props = {
  notes: Note[]
}

function SidebarGroupContent({notes} : Props) {
  const [searchText, setSearchText] = useState("")
  const [localNotes, setLocalNotes] = useState(notes)

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ["text"],
      threshold: 0.4
    })
  }, [localNotes])

  const filteredNotes = searchText ? fuse.search(searchText).map(result => result.item) : localNotes

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes(prevNotes => prevNotes.filter((note) => note.id !== noteId))
  }

  return (
    <SidebarGroupContentShadCN>
      <div className='relative'>
        <div className='relative flex items-center'>
          <SearchIcon className='absolute left-3 size-4 text-muted-foreground' />
          <Input 
            className='bg-muted/60 pl-10 py-5 rounded-lg border-none focus-visible:ring-1 focus-visible:ring-primary transition-all'
            placeholder="Search your notes..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        
        {searchText && filteredNotes.length === 0 && (
          <p className="text-sm text-muted-foreground mt-3 text-center">
            No notes match your search
          </p>
        )}
      </div>

      <SidebarMenu className="mt-4 space-y-1">
        {filteredNotes.length === 0 && !searchText && (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FolderOpenIcon className="size-12 mb-2 opacity-40" />
            <p className="text-sm">No notes yet</p>
          </div>
        )}
        
        {filteredNotes.map(note => (
          <SidebarMenuItem key={note.id} className='group/item rounded-md overflow-hidden transition-all'>
            <SelectNoteButton note={note} />
            <DeleteNoteButton noteId={note.id} deleteNoteLocally={deleteNoteLocally} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}

export default SidebarGroupContent