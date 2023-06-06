import TopAppBar from "./components/top-app-bar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BiblioSort",
  description: "Web-app for reordering IEEE bibliography entries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopAppBar />
        {children}
      </body>
    </html>
  );
}
