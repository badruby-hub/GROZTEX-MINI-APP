import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
export const metadata: Metadata = {
  title: "GROZTEX",
  description: "Лучший обменник",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <meta name="yandex-verification" content="311d7ed1ad318aa9" />
        <Script 
          src="https://telegram.org/js/telegram-web-app.js?58" 
          strategy="beforeInteractive"/>
        <link rel="icon" href="/logo.png"/>
      </head>
      <body>
           <div className="video-bg">
        <video className="video-bg__video" playsInline autoPlay loop muted preload='auto' src="fon.mp4">
        </video>
         </div>   
         <Toaster/>
            {children}
      </body>
    </html>
  );
}
