import { auth } from "@/auth";
import { Providers } from "@/components/Providers";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import "@/styles/main.scss";
// import axios from "axios";

// axios.defaults.withCredentials = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // const [colorscheme] = useColorscheme();

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{!session ? "Not authorized" : children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
