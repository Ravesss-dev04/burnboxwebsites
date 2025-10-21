'use client';
import React, { Suspense, useState } from 'react'
import { Header } from '../components';
import PvcLanyard from '../components/PvcLanyard';
import Footer from '../components/Footer';

const page = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedServiceFromHeader, setSelectedServiceFromHeader] = useState<string | null>(null);
  return (
    
    <div><PvcLanyard/></div>
  )
}

export default page
