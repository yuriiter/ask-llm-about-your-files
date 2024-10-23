import { redirectUnauthenticated } from "@/lib/redirectUnauthenticated";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const currentPathname = headersList.get("x-pathname") ?? undefined;
  await redirectUnauthenticated(currentPathname);

  return children;
}
