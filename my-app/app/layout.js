import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Sidebar, { SidebarItems } from "./components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Bar Jumper",
  description: "The efficient way to find the next bar on your crawl.",
  image:"/images/siteImage.jpg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="relative flex-1">
            <Sidebar>
              <SidebarItems />
            </Sidebar>
            <main className="absolute inset-0">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}