"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  image: string[];
  price: number;
  description?: string;
  related?: Product[]; 
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
  selectProductByName: (name: string) => void;
  loading: boolean;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedServiceFromHeader, setSelectedServiceFromHeader] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/sservices');
        if (response.ok) {
          const services = await response.json();
          
          // Transform the database services to match your Product type
          const transformedProducts: Product[] = services.map((service: any) => ({
            id: service.id,
            name: service.name,
            // Convert imageUrl string to array of images
            image: service.imageUrl.split(',').map((url: string) => url.trim()),
            price: service.price,
            description: service.description || ""
          }));
          
          setProducts(transformedProducts);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Service name mapping (keep this for header navigation)
  const serviceNameMap: Record<string, string> = {
    "Digital & Offset Printing": "Digital Offset Printing",
    "Forms & Receipts": "Forms & Receipts",
    "Panaflex-Signage": "Panaflex Signage",
    "Large format Services": "Large Format Services",
    "Sticker & Labels": "Sticker and Labels",
    "Acrylic Build-up": "Acrylic Build-up",
    "Standee Signage": "Standee Signage",
    "Wall Mural": "Wall Mural",
    "Glass Frosted Sticker": "Glass Frosted Sticker",
    "Sticker On Sintra": "Sticker on Sintra",
    "Graphic Design": "Graphic Design",
    "Logo design": "Logo Design",
    "Flyer Design": "Flyer Design",
    "Other services": "Graphic Design",
  };

  // Computed filtered products
  const filteredProducts = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return products;
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchValue, products]);

  // Function to select a product by ID
  const selectProductById = (id: number) => {
    const p = products.find((x) => x.id === id) ?? null;
    setSelectedProduct(p);
  };

  // Function to select a product by service name
  const selectProductByName = (serviceName: string) => {
    const productName = serviceNameMap[serviceName] || serviceName;
    
    const product = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );
    
    if (product) {
      setSelectedProduct(product);
      setSelectedServiceFromHeader(serviceName);
    } else {
      console.warn(`Product not found for service: ${serviceName}`);
      setSearchValue(serviceName);
    }
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
        selectProductByName,
        loading
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