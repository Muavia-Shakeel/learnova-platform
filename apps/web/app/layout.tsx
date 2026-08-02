import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { AuthProvider } from "../lib/auth/useMe";
import { QueryProvider } from "../lib/query/QueryProvider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Learnova — Learn Beyond Limits",
  description: "Learnova connects students with expert tutors for academic success and lifelong growth.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
