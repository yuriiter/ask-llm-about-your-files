"use server";

export const fetchFiles = async ({
  current,
  pageSize,
  searchQuery,
}: {
  current: number;
  pageSize: number;
  searchQuery: string;
}) => {
  const response = await fetch(
    `/api/files?page=${current}&pageSize=${pageSize}&search=${searchQuery}`,
  );
  return response.json();
};

export const deleteFiles = async (fileIds: string[]) => {
  const response = await fetch("/api/files", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileIds }),
  });
  return response.json();
};
