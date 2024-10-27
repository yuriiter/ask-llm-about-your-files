import { v4 as uuid } from "uuid";
import { useCallback, useState } from "react";
import { Message } from "./types";
import { getCompletion } from "@/lib/actions/data";

const fileIds: string[] = [];

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSendMessage = useCallback(
    async (message: string) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: uuid(), type: "user", content: message, timestamp: new Date() },
      ]);

      setIsLoading(true);

      const llmMessage = await getCompletion(
        message,
        fileIds,
        messages.map((m) => ({ role: m.type, content: m.content })),
      );

      setIsLoading(false);

      if (!llmMessage || llmMessage.length === 0) {
        console.error("No reply from llm");
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: uuid(),
          type: "assistant",
          content: llmMessage,
          timestamp: new Date(),
        },
      ]);
    },
    [messages],
  );

  return {
    messages,
    onSendMessage,
    isLoading,
  };
};
