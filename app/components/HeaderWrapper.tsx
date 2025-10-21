"use client";

import { usePathname, useRouter } from "next/navigation";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const router =useRouter();
  const [allowAdmin, setAllowAdmin] = useState(false);
  // hide header for all admin routes
  
  // track taps for mobile
  const [tapCount, setTapCount] = useState(0);
  let tapTimer: NodeJS.Timeout;


  

  
  // useeffect for the keyboard shortcus access key for admin
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if(e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        setAllowAdmin(true);
        router.push('/admin')
      }
    }


    window.addEventListener("keydown", handleKeydown);

    return() => {
      window.removeEventListener("keydown", handleKeydown)
    };
  }, [router])


  useEffect(() => {
    // Mobile Tap sequence (tripple tap on hidden)
    const mobileTap = (e: TouchEvent) => {
      const touch = e.touches[0];
      if(!touch) return;

      const x = touch.clientX;
      const y = touch.clientY;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // top left corner are 
      if(x > width * 0.1 || y > height * 0.1) return;

      setTapCount((prev) => prev + 1);

      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => setTapCount(0), 1000);

      if(tapCount + 1 >= 3) {
        setAllowAdmin(true);
        router.push("/admin")
        setTapCount(0)
      }
    }

    window.addEventListener("touchstart", mobileTap);
    return () => window.removeEventListener("touchstart", mobileTap);
  }, [tapCount, router]);



  //block admin if shortcut key hasn't been use dapat short cutkey gagamitin
  useEffect(() => {
    if(pathname.startsWith("/admin") && !allowAdmin) {
      router.push("/");
    }
  })


  // naka hide dito si header kahit globally
  if (pathname.startsWith("/admin")) return null;

  return <Header />;
}

