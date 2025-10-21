'use client';


import React, { Suspense, useState } from 'react'
import { Header } from '../components'
import Photopage from '../components/Photopage'
import Footer from '../components/Footer'

const page = () => {
  const [searchValue, setSearchValue] = useState("");
    const [selectedServiceFromHeader, setSelectedServiceFromHeader] = useState<string | null>(null);
  
  return (
    <div>
      <Photopage/>
    </div>
  )
}

export default page

