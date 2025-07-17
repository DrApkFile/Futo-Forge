import type React from "react"
import "./globals.css"
import { Outfit } from "next/font/google" // Import Outfit from next/font/google
import { ThemeProvider } from "@/components/theme-provider"

// Configure the Outfit font
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit", // Define a CSS variable for Outfit
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
