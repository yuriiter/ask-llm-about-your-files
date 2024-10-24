"use client";

import { ChatInterface } from "@/components/Chat";
import { Message } from "@/components/Chat/types";

const sampleMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How can you help me with my project?",
    type: "user",
    timestamp: new Date("2024-10-24T10:00:00"),
  },
  {
    id: "2",
    content:
      "I'd be happy to help with your project! Could you please provide more details about what you're working on?",
    type: "assistant",
    timestamp: new Date("2024-10-24T10:00:05"),
  },
  {
    id: "3",
    content:
      "I'm building a React application with TypeScript and need help with state management.",
    type: "user",
    timestamp: new Date("2024-10-24T10:00:30"),
  },
  {
    id: "4",
    content:
      "For React state management, you have several options:\n\n1. React Context + useState/useReducer for simpler applications\n2. Redux Toolkit for larger applications\n3. Zustand for a simpler alternative to Redux\n4. Jotai or Recoil for atomic state management\n\nWhich approach are you most interested in exploring?",
    type: "assistant",
    timestamp: new Date("2024-10-24T10:00:45"),
  },
  {
    id: "5",
    content:
      "I think Redux Toolkit would be best for my needs. Can you explain how to set it up?",
    type: "user",
    timestamp: new Date("2024-10-24T10:01:00"),
  },
  {
    id: "6",
    content:
      "Here's a step-by-step guide to setting up Redux Toolkit:\n\n1. First, install the packages:\n```npm install @reduxjs/toolkit react-redux```\n\n2. Create a store file\n3. Define your slices\n4. Wrap your app with Provider\n\nWould you like me to show you an example configuration?",
    type: "assistant",
    timestamp: new Date("2024-10-24T10:01:15"),
  },
  {
    id: "7",
    content: "Yes, please show me an example!",
    type: "user",
    timestamp: new Date("2024-10-24T10:01:30"),
  },
  {
    id: "8",
    content:
      "Here's a basic Redux Toolkit setup:\n\n```typescript\n// store.ts\nimport { configureStore } from '@reduxjs/toolkit';\n\nexport const store = configureStore({\n  reducer: {}\n});\n\n// Add your slices here\n```\n\nWould you like me to show you how to create a slice next?",
    type: "assistant",
    timestamp: new Date("2024-10-24T10:01:45"),
  },
];

export default function Page() {
  return (
    <ChatInterface
      messages={sampleMessages}
      onSendMessage={function (message: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
