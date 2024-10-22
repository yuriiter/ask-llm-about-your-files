import { Providers } from "@/components/Providers";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { authOptions } from "@/lib/authOptions";
import "@/styles/main.scss";
import { getServerSession } from "next-auth";
// import axios from "axios";

// axios.defaults.withCredentials = true;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // const [colorscheme] = useColorscheme();

  return (
    <html lang="en">
      <body>
        {!session ? (
          <>Not authorized</>
        ) : (
          <StyledComponentsRegistry>
            <Providers>{children}</Providers>
          </StyledComponentsRegistry>
        )}
      </body>
    </html>
  );
}
