"use client";

import { ChatInterface } from "@/components/Chat";
import { useMessages } from "@/components/Chat/useMessages";

export default function Page() {
  const chat = useMessages();
  return <ChatInterface {...chat} />;
}
