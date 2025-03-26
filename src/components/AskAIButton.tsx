"use client";

import React from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ArrowUpIcon, BrainCircuit, Sparkles } from "lucide-react";
import { askAIAboutNotesAction } from "@/actions/note";
import "@/styles/AI-responses.css";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";

type Props = {
  user: User | null;
};

// Create a client-only version of the dialog content
const WideDialogContent = dynamic(
  () => 
    Promise.resolve(
      React.forwardRef<
        React.ElementRef<typeof DialogPrimitive.Content>,
        React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
      >(({ className, children, ...props }, ref) => (
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            ref={ref}
            className={`fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border bg-background shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ${className}`}
            style={{ width: '92vw', maxWidth: '960px', height: '82vh' }}
            {...props}
          >
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      ))
    ),
  { ssr: false }
);

WideDialogContent.displayName = "WideDialogContent";

function AskAIButton({ user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  const handleOnOpenChange = (isOpen: boolean) => {
    if (!user) {
      router.push("/login");
    } else {
      if (isOpen) {
        setQuestionText("");
        setQuestions([]);
        setResponses([]);
      }
      setOpen(isOpen);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = () => {
    if (!questionText.trim()) return;
    const newQuestions = [...questions, questionText];
    setQuestions(newQuestions);
    setQuestionText("");
    setTimeout(scrollToBottom, 100);

    startTransition(async () => {
      const response = await askAIAboutNotesAction(newQuestions, responses);
      setResponses((prev) => [...prev, response]);
      setTimeout(scrollToBottom, 100);
    });
  };

  const scrollToBottom = () => {
    contentRef.current?.scrollTo({
      top: contentRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="flex items-center gap-2 rounded-full px-4 py-2 shadow-sm transition-colors hover:bg-muted/80"
        >
          <BrainCircuit size={17} />
          <span className="font-medium">Ask AI</span>
        </Button>
      </DialogTrigger>
      <WideDialogContent className="flex flex-col overflow-hidden border-0 p-0 shadow-xl ">
        <DialogHeader className="sticky top-0 z-10 border-b bg-card/80 px-4 py-2.5 backdrop-blur-md">
          <DialogTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="text-primary" size={14} />
            </div>
            <span>AI Notes Assistant</span>
          </DialogTitle>
        </DialogHeader>

        <div 
          ref={contentRef} 
          className="custom-scrollbar hide-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-35"
        >
          {questions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
                <BrainCircuit size={24} className="opacity-50" />
              </div>
              <p className="text-base font-medium">Ask me anything about your notes</p>
              <p className="mt-1 max-w-md text-xs text-muted-foreground">I'll help you summarize, explain concepts, or find specific information.</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <Fragment key={index}>
                <div className="ml-auto flex max-w-[75%] flex-col">
                  <div className="rounded-lg rounded-tr-sm bg-primary/90 px-3 py-2 text-primary-foreground shadow-sm">
                    <p className="text-sm leading-relaxed">{question}</p>
                  </div>
                  <div className="ml-auto mt-0.5 flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground/70">You</span>
                  </div>
                </div>
                
                {responses[index] ? (
                  <div className="mr-auto flex max-w-[75%] flex-col">
                    <div className="rounded-lg rounded-tl-sm bg-muted/50 px-3 py-2 shadow-sm">
                      <div 
                        className="bot-response prose prose-sm prose-slate dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: responses[index] }}
                      />
                    </div>
                    <div className="mt-0.5 flex items-center gap-1">
                      <div className="flex h-3 w-3 items-center justify-center rounded-full bg-primary/10">
                        <Sparkles className="text-primary" size={7} />
                      </div>
                      <span className="text-[9px] text-muted-foreground/70">Assistant</span>
                    </div>
                  </div>
                ) : (
                  <div className="mr-auto flex items-center gap-1.5 pl-1">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/40" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-[9px] text-muted-foreground/60">AI thinking...</span>
                  </div>
                )}
              </Fragment>
            ))
          )}
        </div>

        <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur-sm px-3 py-2.5">
          <div className="flex items-end gap-1.5 rounded-xl border bg-background px-2.5 py-1 transition-all hover:border-primary/30 focus-within:border-primary/40 focus-within:shadow-sm">
            <Textarea
              ref={textareaRef}
              placeholder="Ask me about your notes..."
              className="resize-none border-0 bg-transparent py-1.5 px-1 text-sm shadow-none focus-visible:ring-0"
              style={{
                minHeight: "36px",
                maxHeight: "120px",
              }}
              rows={1}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={isPending}
            />
            <Button 
              size="sm"
              onClick={handleSubmit}
              disabled={!questionText.trim() || isPending}
              className="mb-1 h-6 w-6 rounded-full p-0 opacity-70 transition-opacity hover:opacity-100"
              variant="ghost"
            >
              <ArrowUpIcon className="h-3.5 w-3.5 text-primary rounded-2xl" />
            </Button>
          </div>
        </div>
      </WideDialogContent>
    </Dialog>
  );
}

export default AskAIButton;