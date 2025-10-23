"use client"

import React, { useState, useEffect, useRef } from 'react'

interface Product {
  unit: string;
  price: number;
}

interface Products {
  [key: string]: Product;
}

const ProductCalculator: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [inputUnit, setInputUnit] = useState<string>('sqm')
  const [length, setLength] = useState<string>('')
  const [width, setWidth] = useState<string>('')
  const [areaResult, setAreaResult] = useState<string>('0')
  const [priceResult, setPriceResult] = useState<string>('0.00')
  const [unitLabel, setUnitLabel] = useState<string>('')

  const products: Products = {
    "Canvas Print only": { unit: "sqin", price: 3 },
    "Canvas Print with Wooden Frame": { unit: "sqin", price: 3.5 },
    "Acrylic Buildup Lighted Double Face": { unit: "sqft", price: 2500 },
    "Acrylic Buildup Lighted Single Face": { unit: "sqft", price: 2000 },
    "Acrylic Buildup None-Lighted Double Face": { unit: "sqft", price: 2000 },
    "Acrylic Buildup None-Lighted Single Face": { unit: "sqft", price: 1500 },
    "Acrylic Cutout 3mm": { unit: "sqft", price: 600 },
    "Acrylic Cutout 5mm": { unit: "sqft", price: 900 },
    "Acrylic LightBox": { unit: "sqft", price: 1500 },
    "Acrylic Sandwhich 3mm": { unit: "sqft", price: 1300 },
    "Decal Sticker printed": { unit: "sqft", price: 150 },
    "Decal Sticker cut-out": { unit: "sqin", price: 4 },
    "Glass Frosted/Sticker": { unit: "sqft", price: 150 },
    "Label Sticker": { unit: "sqin", price: 0.9 },
    "Neon Lights (max. 3 colors)": { unit: "sqft", price: 1000 },
    "Panaflex Signage Lighted Double Face": { unit: "sqft", price: 800 },
    "Panaflex Signage None-Lighted Double Face": { unit: "sqft", price: 700 },
    "Panaflex Signage Lighted One Face": { unit: "sqft", price: 700 },
    "Panaflex Signage None-Lighted One Face": { unit: "sqft", price: 600 },
    "Photoprint / Poster": { unit: "sqin", price: 0.75 },
    "Sticker on Sintra 1.5mm": { unit: "sqin", price: 1.2 },
    "Sticker on Sintra 3mm": { unit: "sqin", price: 1.5 },
    "Sticker on Sintra 5mm": { unit: "sqin", price: 2 },
    "Tarpaulin 10 oz": { unit: "sqft", price: 25 },
    "Tarpaulin 13 oz": { unit: "sqft", price: 30 },
    "Tarpaulin 18 oz": { unit: "sqft", price: 35 },
    "Tarpaulin w/ Wooden Frame": { unit: "sqft", price: 150 },
    "Tarpaulin w/ Metal Frame": { unit: "sqft", price: 300 },
    "Vehicle Wrap": { unit: "sqft", price: 180 },
    "Wall Mural": { unit: "sqft", price: 150 },
  }

  const conversionFactors = {
    sqm: 1,
    sqft: 0.092903,
    sqin: 0.00064516,
    sqyd: 0.836127,
    sqcm: 0.0001,
    sqmm: 0.000001
  }

  const unitName = (code: string): string => {
    const units: { [key: string]: string } = {
      sqm: "sqm",
      sqft: "sqft",
      sqin: "sqin",
      sqyd: "sqyd",
      sqcm: "sqcm",
      sqmm: "sqmm"
    }
    return units[code] || code
  }

  const updateAndCompute = () => {
    const product = products[selectedProduct]
    const lengthNum = parseFloat(length)
    const widthNum = parseFloat(width)

    if (!product) {
      resetResults()
      return
    }

    if (!lengthNum || !widthNum) {
      resetResults()
      return
    }

    const inputToSqm = lengthNum * widthNum * conversionFactors[inputUnit as keyof typeof conversionFactors]
    const convertedArea = inputToSqm / conversionFactors[product.unit as keyof typeof conversionFactors]
    const total = convertedArea * product.price

    setAreaResult(convertedArea.toFixed(2))
    setPriceResult(total.toFixed(2))
    setUnitLabel(unitName(product.unit))
  }

  const resetResults = () => {
    setAreaResult("0")
    setPriceResult("0.00")
    setUnitLabel("")
  }

  useEffect(() => {
    updateAndCompute()
  }, [selectedProduct, inputUnit, length, width])

  const outputUnit = selectedProduct ? unitName(products[selectedProduct]?.unit) : ""
  const pricePerUnit = selectedProduct ? products[selectedProduct]?.price.toString() : ""

  return (
    <div className="min-h-auto flex justify-center text-white font-[Poppins] py-20 px-4">
      <div className="w-60 max-w-lg bg-[#2b2b2b] text-black rounded-lg shadow-lg border-t-8 border-pink-600 p-10">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="https://github.com/ravenprevendido/updatedbbsitesversion4/raw/master/public/bblogo.png" 
            alt="logo" 
            className="w-20 mb-2"
          />
          <h2 className="text-center text-lg font-semibold text-black tracking-wide">
            PRODUCT AREA PRICE CALCULATOR (AUTO)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="product" className="block  text-sm text-black font-medium mb-1">
              Product / Service:
            </label>
            <select 
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full border border-pink/70 bg-[#3a3a3a] focus:border-pink-600 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Select Product</option>
              {Object.keys(products).map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inputUnit" className="block text-sm font-medium mb-1 text-white/80">
              Input Unit:
            </label>
            <select 
              id="inputUnit"
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
              className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="sqm">Square Meter</option>
              <option value="sqft">Square Feet</option>
              <option value="sqin">Square Inch</option>
              <option value="sqyd">Square Yard</option>
              <option value="sqcm">Square Centimeter</option>
              <option value="sqmm">Square Millimeter</option>
            </select>
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium mb-1 text-white/80">
              Length:
            </label>
            <input 
              type="number" 
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="Enter length" 
              className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="width" className="block text-sm font-medium mb-1 text-white/80">
              Width:
            </label>
            <input 
              type="number" 
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="Enter width" 
              className="w-full bg-[#3a3a3a] border border-transparent focus:border-pink-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">
              Output Unit (from product):
            </label>
            <input 
              type="text" 
              value={outputUnit}
              readOnly 
              className="w-full bg-[#3a3a3a] rounded-md px-3 py-2 text-sm border border-transparent focus:border-pink-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">
              Price per Unit:
            </label>
            <input 
              type="text" 
              value={pricePerUnit}
              readOnly 
              className="w-full bg-[#3a3a3a] rounded-md px-3 py-2 text-sm border border-transparent focus:border-pink-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8 bg-[#1e1e1e] border-l-4 border-pink-600 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Converted Area:</h3>
          <div className="flex justify-between bg-[#3a3a3a] rounded-md px-3 py-2 mb-2">
            <span>{areaResult}</span> 
            <span>{unitLabel}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Total Price:</h3>
          <div className="flex bg-pink-500 rounded-md px-3 py-2 font-semibold">
            ₱ <span className="ml-2">{priceResult}</span>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-xs mt-6">
          © 2025 <span className="text-pink-500">Burnbox</span> Product calculator (auto)
        </footer>
      </div>
    </div>
  )
}

export default ProductCalculator