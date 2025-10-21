// src/context/HeaderContext.tsx
"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  image: string[]; // match your shape
  price: number;
  description?: string;
};

type HeaderContextType = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  selectedServiceFromHeader: string | null;
  setSelectedServiceFromHeader: (service: string | null) => void;
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectProductById: (id: number) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedServiceFromHeader, setSelectedServiceFromHeader] =
    useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- products list (single source of truth) ---

  const products: Product[] = [
    { id: 1, name: "Digital Offset Printing", image: ["/offset.png"], price: 1000 },
    { id: 2, name: "Forms & Receipt", image: ["/forms.png"], price: 700 },
    { id: 3, name: "Panaflex Signage", image: ["/panaflex.png"], price: 600 },
    { id: 4, name: "Large Format Services", image: ["/largeformat.png"], price: 500 },
    { id: 5, name: "Sticker and Labels", image: ["/sticker.png"], price: 260 },
    { id: 6, name: "Acrylic Build-up", image: ["/signage.png"], price: 200 },
    // ... add the rest (21 items) or import them
  ];


// computed filtered products
const filteredProducts = useMemo(() => {
    const q = searchValue.trim().toLowerCase();

    if (!q) return products; // show all if empty search
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchValue, products]);

  // 🖱️ Function to select a product
  const selectProductById = (id: number) => {
    const p = products.find((x) => x.id === id) ?? null;
    setSelectedProduct(p);
  };

  return (
    <HeaderContext.Provider
      value={{
        searchValue,
        setSearchValue,
        selectedServiceFromHeader,
        setSelectedServiceFromHeader,
        products,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        selectProductById,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
