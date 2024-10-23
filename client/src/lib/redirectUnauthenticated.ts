import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const redirectUnauthenticated = async (redirectBack?: string) => {
  const session = await auth();

  if (!session)
    redirect(
      `/sign-in${typeof redirectBack === "string" && redirectBack.length > 0 ? "?redirect=" + redirectBack : ""}`,
    );
};
