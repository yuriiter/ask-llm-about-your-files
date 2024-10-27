import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = auth();

  if (!session) redirect("/sign-in");
  else redirect("/files");

  return null;
}
