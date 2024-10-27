import { Providers } from "@/components/Providers";
import "@/style/main.css";

export const metadata = {
  title: "LLM with your files",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
