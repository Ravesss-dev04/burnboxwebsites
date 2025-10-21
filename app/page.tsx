"use client";
import { Suspense, useEffect, useState } from "react";
import MainPage from "./components/MainPage";
export default function Home() {

  return (
    <main className="h-full max-w-full flex flex-col  bg-black relative overflow-x-hidden p-0 m-0">
      <MainPage/>
  </main>
  ); 
}

