import { Providers } from "@/components/Providers";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import "@/styles/main.scss";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
