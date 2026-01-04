import "./globals.css";
import { Providers } from "@/redux/store/providers";
import { Toaster } from "@/components/ui/sonner";
// import Script from "next/script";

export const generateMetadata = () => {
  return {
    title: process.env.NEXT_PUBLIC_META_TITLE,
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    openGraph: {
      title: process.env.NEXT_PUBLIC_META_TITLE,
      description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
      keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    },
  };
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      web-version={process.env.NEXT_PUBLIC_WEB_VERSION}
      className="scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxx"
          crossOrigin="anonymous" strategy="afterInteractive" /> */}
      </head>
      <body className={`font-sans !pointer-events-auto antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
        <div id="recaptcha-container"></div>
      </body>
    </html>
  );
}
