"use server";

import { RcFile } from "antd/es/upload";
import { auth } from "../../auth";
import { UserNotFoundError } from "../../errors/dbErrors";
import { redirectUnauthenticated } from "../redirectUnauthenticated";
import { userRepository } from "../repositories/UserRepository";
import { vectorServiceClient } from "@/grpc/client";
import { Prisma } from "@prisma/client";

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
      skip: current + pageSize,
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
    const deleteRequests = fileIds.map(vectorServiceClient.delete);
    await Promise.all(deleteRequests);

    const filesDeleteResult =
      await userRepository.deleteFilesByUserEmailAndFileIds(email, fileIds);

    return filesDeleteResult.count !== 0;
  } catch (e) {
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
