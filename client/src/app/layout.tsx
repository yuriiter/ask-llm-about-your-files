import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
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
        <Toaster position="top-center" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
