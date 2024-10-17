// Import local font and styles
import localFont from "next/font/local";
import "./globals.css"; // Global CSS styles
import Header from "./components/Header.js"; // Header component
import { UserProvider } from "./context/UserContext";

// Define Geist Sans font
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// Define Geist Mono font
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the application
export const metadata = {
  title: "Bar Jumper", // Page title
  description: "The efficient way to find the next bar on your crawl.", // Page description
  image:"/images/siteImage.jpg", // Page image
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserProvider>
          <Header /> {/* Render Header component */}
          {children} {/* Render child components */}
        </UserProvider>
      </body>
    </html>
  );
}
