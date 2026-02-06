"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthAndCampus = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // If user is logged in, check if they have a campus selected
      if (session) {
        // We removed the forced redirect here because we now handle it 
        // via the CampusPopup on the Home page (and stored in local/user metadata).
        // This allows a smoother UX as requested.
      }
    };

    // Run check after splash or immediately if no splash needed (could optimize)
    if (!showSplash) {
      checkAuthAndCampus();
    }
  }, [showSplash, pathname, router]);


  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-display antialiased">
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          children
        )}
      </body>
    </html>
  );
}
