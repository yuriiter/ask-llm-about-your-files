"use server";

import { auth } from "../../auth";
import { UserNotFoundError } from "../../errors/dbErrors";
import { redirectUnauthenticated } from "../redirectUnauthenticated";
import { userRepository } from "../repositories/UserRepository";

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
    const filesSearchResult =
      await userRepository.deleteFilesByUserEmailAndFileIds(email, fileIds);

    return filesSearchResult.count !== 0;
  } catch (e) {
    if (e instanceof UserNotFoundError) redirectUnauthenticated();
  }
  throw new Error("An unknown error occurred");
};

export const uploadFile = async (formData: FormData) => {
  console.log(formData);
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return redirectUnauthenticated();

  throw new Error("Not implemented");
};
