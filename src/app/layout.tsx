import type { Metadata } from "next";
import "@/styles/globals.css"
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Goat Notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  </>
  );
}
