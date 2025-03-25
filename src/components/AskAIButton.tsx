'use client'

import React, { Fragment, useRef, useState, useTransition } from 'react'
import { User } from "@supabase/supabase-js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { Textarea } from './ui/textarea'
import { ArrowUpIcon } from 'lucide-react'
import { askAIAboutNotesAction } from '@/actions/note'
import "@/styles/AI-responses.css";


type Props = {
  user: User | null;
}

function AskAIButton({ user }: Props) {

  const [open, setOpen] = useState(false)
  const [questionText, setQuestionText] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<string[]>([])

  const router = useRouter();

  const [isPending, startTransition] = useTransition()

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login")
    } else {
      if (isOpen){
        setQuestionText("")
        setQuestions([])
        setResponses([])
      }
      setOpen(isOpen)
    }
  }

const textareaRef = useRef<HTMLTextAreaElement>(null);
const contentRef = useRef<HTMLDivElement>(null);
const handleInput = () => {
  const textarea = textareaRef.current;
  if (!textarea) return;

  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

const handleClickInput = () => {
  textareaRef.current?.focus();
}

const handleSubmit = async () => {
  if (!questionText.trim()) return;

  const newQuestions = [...questions, questionText];
  setQuestions(newQuestions);
  setQuestionText("");
  setTimeout(scrollToBottom, 100);

  startTransition(async () => {
    const response = await askAIAboutNotesAction(newQuestions, responses);
    setResponses((prev) => [...prev, response]);

    setTimeout(scrollToBottom, 100);
  })
}

const scrollToBottom = () => {
  contentRef.current?.scrollIntoView({ behavior: "smooth" });
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent className="custom-scrollbar flex h-[85vh] max-w-4xl flex-col overflow-y-auto" ref={contentRef}>
        <DialogHeader>
          <DialogTitle>ASk AI About Your Notes</DialogTitle>
          <DialogDescription>
            Our AI can answer questions about all your notes
          </DialogDescription>

          <div className='mt-4 flex flex-col gap-8'>
            {
              questions.map((question, index) => (
                <Fragment key={index}>
                  <p>
                    {question}
                  </p>
                  {
                    responses[index] && (
                      <p 
                      className='bot-response text-sm text-muted-foreground'
                      dangerouslySetInnerHTML={{ __html: responses[index] }}
                      />
                    )
                  }
                </Fragment>
              ))
            }
            {isPending && <p className='animate-pulse text-sm'>Thinking...</p>}
          </div>

          <div className='mt-auto flex cursor-text flex-col rounded-lg border p-4'
          onClick={handleClickInput}>
              <Textarea
              ref={textareaRef}
              placeholder='Ask me anything about your notes'
              className='placeholder:text-muted-foreground resize-none rounded-none border-none bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
              style={{
                minHeight: "0",
                lineHeight: "normal",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onChange={(e) => setQuestionText(e.target.value)} />

              <Button className='ml-auto size-8 rounded-full' >
                <ArrowUpIcon className='text-background' />
              </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AskAIButton
