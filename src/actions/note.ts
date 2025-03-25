"use server"

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import gemini from "@/gemini";

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to create a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      }
    })
    
    return { errorMessage: null };

  } catch (error) {
    return handleError(error);
  }
}

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to update a note");

    await prisma.note.update({
      where: {
        id: noteId
      },
      data: {
        text
      }
    })
    
    return { errorMessage: null };

  } catch (error) {
    return handleError(error);
  }
}

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("Must be logged in to delete a note");

    await prisma.note.delete({
      where: {
        id: noteId,
        authorId: user.id,
      }
    })
    
    return { errorMessage: null };

  } catch (error) {
    return handleError(error);
  }
}

export const askAIAboutNotesAction = async (newQuestions: string[], responses: string[]) => {
  const user = await getUser();
  if (!user) throw new Error("Must be logged in to ask AI questions");

  const notes = await prisma.note.findMany({
    where: {
      authorId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      createdAt: true,
      text: true,
      updatedAt: true
    }
  })

  if (notes.length === 0) {
    return "You don't have any notes yet. Create a note to ask AI questions.";
  }

  const formattedNotes = notes.map(note => {
    return `
    Text: ${note.text}
    Created At: ${note.createdAt}
    Updated At: ${note.updatedAt}
    `.trim()
  }).join("\n");

  // Create a Gemini conversation
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
    },
  });

  // System prompt (sent as first message)
  await chat.sendMessage(`
    You are a helpful assistant that answers questions about a user's notes. 
    Assume all questions are related to the user's notes. 
    Make sure that your answers are not too verbose and you speak succinctly. 
    Your responses MUST be formatted in clean, valid HTML with proper structure. 
    Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
    Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
    Avoid inline styles, JavaScript, or custom attributes.
    
    Rendered like this in JSX:
    <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

    Here are the user's notes:
    ${formattedNotes}
  `);

  // Add previous conversation history
  for (let i = 0; i < responses.length; i++) {
    await chat.sendMessage(newQuestions[i]);
    await chat.sendMessage(responses[i]);
  }

  // Send the latest question and get response
  const latestQuestion = newQuestions[newQuestions.length - 1];
  const result = await chat.sendMessage(latestQuestion);
  
  return result.response.text() || "A problem occurred while asking AI questions";
}


