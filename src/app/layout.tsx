import type { Metadata } from "next";
import "./globals.css";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import QueryContext from "@/context/QueryContext";

export const metadata: Metadata = {
  title: {
    template: "Postly | %s",
    default: "Postly",
  },
  description: "create post in infinite Canvas, infinite Ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContext>
        <body className={`w-full overflow-auto flex flex-col`}>
          <header className="w-full flex justify-center bg-gray-900">
            <Navbar />
          </header>
          <main className="grow flex flex-col">
            <QueryContext>{children}</QueryContext>
          </main>
        </body>
      </AuthContext>
    </html>
  );
}
