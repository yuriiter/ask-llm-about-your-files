import { SearchResult, vectorServiceClient } from "@/grpc/client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function queryLLM(
  userQuery: string,
  fileIds: string[],
  chatHistory: ChatMessage[],
) {
  if (!process.env.LLM_HELPER_MODEL_NAME || !process.env.LLM_MAIN_MODEL_NAME) {
    console.error(
      "Environment variables LLM_HELPER_MODEL_NAME and LLM_MAIN_MODEL_NAME not initialized",
    );
    throw new Error(
      "Environment variables LLM_HELPER_MODEL_NAME and LLM_MAIN_MODEL_NAME not initialized",
    );
  }
  const queryGeneration = await openai.chat.completions.create({
    model: process.env.LLM_HELPER_MODEL_NAME,
    messages: [
      {
        role: "system",
        content: `You are an AI specialized in generating semantic search queries. Your task is to generate 7 alternative versions of the user's query that will help find relevant information in a vector database. User's query might not be relevant at all. It's your task now to find information in vector DB that might help you to give the best reply to the user.

Guidelines for query generation:
- Create variations that capture different aspects of the same question
- Include both specific and slightly broader versions
- Remove unnecessary words to focus on key concepts
- Consider synonyms and related terms
- Each query should be concise (2-6 words)

Return only the queries, one per line, without any explanation or numbering.`,
      },
      {
        role: "user",
        content: `Generate optimized search queries for:\n"${userQuery}"`,
      },
    ],
    temperature: 0.7,
    max_tokens: 250,
  });

  const generatedQueries = queryGeneration.choices[0]?.message?.content || "";
  const queryArray = generatedQueries
    .split("\n")
    .filter((query: string) => query.trim() !== "");

  const searchPromises = queryArray.map((query: string) =>
    vectorServiceClient.search(query, 4, "text", fileIds),
  );
  const resultsArray = await Promise.all(searchPromises);

  const allResults = resultsArray.flat();

  const uniqueResults = allResults
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.id === curr.id);
      if (!existing || curr.distance < existing.distance) {
        acc = acc.filter((item) => item.id !== curr.id);
        acc.push(curr);
      }
      return acc;
    }, [] as SearchResult[])
    .sort((a, b) => a.distance - b.distance);

  const context = uniqueResults
    .map(
      (result) =>
        `[Citation] File name: ${result.metadata.file_name}\nPage: ${result.metadata.page_number}\nContent: ${result.content}`,
    )
    .join("\n");

  const finalMessages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant. Use the provided context from files and chat history to answer the user's question accurately. User's query might not be relevant, for your information. If they are relevant, please also include what file you got it from and the page number.",
    },
    {
      role: "system",
      content: `Context from files:\n${context}`,
    },
    ...chatHistory,
    {
      role: "user",
      content: userQuery,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: process.env.LLM_MAIN_MODEL_NAME,
    messages: finalMessages,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || "";
}
