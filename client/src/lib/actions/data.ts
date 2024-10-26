"use server";

import { RcFile } from "antd/es/upload";
import { auth } from "../../auth";
import { UserNotFoundError } from "../../errors/dbErrors";
import { redirectUnauthenticated } from "../redirectUnauthenticated";
import { userRepository } from "../repositories/UserRepository";
import { vectorServiceClient } from "@/grpc/client";
import { Prisma } from "@prisma/client";
import { ChatMessage, queryLLM } from "../llm";
import { BadParametersError } from "@/errors/requestErrors";

export const fetchFiles = async ({
  current,
  pageSize,
  searchQuery,
}: {
  current: number;
  pageSize: number;
  searchQuery: string;
}) => {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return redirectUnauthenticated();

  try {
    const filesSearchResult = await userRepository.getFilesByUserEmail(email, {
      name: searchQuery,
      skip: current * pageSize,
      take: pageSize,
    });

    return filesSearchResult;
  } catch (e) {
    if (e instanceof UserNotFoundError) redirectUnauthenticated();
  }
  throw new Error("An unknown error occurred");
};

export const deleteFiles = async (fileIds: string[]) => {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return redirectUnauthenticated();

  try {
    const deleteFile = (id: string) => vectorServiceClient.delete(id);
    const deleteRequests = fileIds.map(deleteFile);
    await Promise.all(deleteRequests);

    const filesDeleteResult =
      await userRepository.deleteFilesByUserEmailAndFileIds(email, fileIds);

    return filesDeleteResult.count !== 0;
  } catch (e) {
    console.log(e);
    if (e instanceof UserNotFoundError) redirectUnauthenticated();
  }
  throw new Error("An unknown error occurred");
};

export const uploadFile = async (formData: FormData) => {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return redirectUnauthenticated();

  const file = formData.get("file") as RcFile;
  const fileContent = new Uint8Array(await file.arrayBuffer());
  const grpcUploadFileResult = await vectorServiceClient.uploadFile(
    fileContent,
    file.name,
  );
  const filesPayload: Prisma.FileUncheckedCreateInput[] =
    grpcUploadFileResult.result.map(({ fileName, fileId }) => ({
      name: fileName,
      external_db_id: fileId,
      data_uploaded: new Date(),
      userId: "",
    }));

  return userRepository.uploadFiles(email, filesPayload);
};

export const getCompletion = async (
  userQuery: string,
  fileIds: string[],
  chatHistory: ChatMessage[],
) => {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return redirectUnauthenticated();

  try {
    const userFiles = await userRepository.getFilesByUserEmail(
      email,
      {
        take: 10000,
      },
      true,
    );
    const userFilesIds = userFiles.files.map(
      (userFile) => userFile.external_db_id,
    );

    const someQueriedFileDoesntExist = fileIds.find(
      (queriedFileId: string) => !userFilesIds.includes(queriedFileId),
    );
    if (someQueriedFileDoesntExist)
      throw new BadParametersError(
        `User doesn't have a file with id ${someQueriedFileDoesntExist}`,
      );

    const fileIdsToQuery = fileIds.length > 0 ? fileIds : userFilesIds;

    if (fileIdsToQuery.length === 0)
      throw new BadParametersError("User doesn't have any files");

    const llmResponse = await queryLLM(userQuery, fileIdsToQuery, chatHistory);

    return llmResponse;
  } catch (e) {
    console.log(e);
    if (e instanceof UserNotFoundError) redirectUnauthenticated();
  }
  throw new Error("An unknown error occurred");

  return "";
};
