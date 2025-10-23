// src/context/HeaderContext.tsx
"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  image: string[]; // match your shape
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
  selectProductByName: (name: string) => void; // Fixed function name
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
    {
            id: 1,
            name: "Digital Offset Printing",
            image:[ "/offset.png", "/offset-1.png", "/forms.png"],
            price: 1000,
            description: "Digital and offset printing are two methods of producing printed materials: digital printing involves sending digital files directly to the printer without the need for plates, while offset printing is a traditional technique that uses plates to transfer ink onto a rubber blanket, then onto the printing surface."
        },

         {
            id: 2,
            name: "Forms & Receipts",
            image: ["/forms.png", "/cup.png", "/forms.png"],
            price: 700,
            description: "Our Form & Receipt Printing Service is designed to streamline your documentation process, ensuring accuracy, consistency, and professionalism every step of the way."
        },
         {
            id: 3,
            name: "Panaflex Signage",
            image: ["/panaflex.png", "/cup.png", "/forms.png"],
            price: 600,
            description: "A transluscent canvas made with special substances that permit light to pass through it."
        },
         {
            id: 4,
            name: "Large Format Services",
            image: ["/largeformat.png", "/cup.png", "/forms.png"],
            
            price: 500,
            description: "A transluscent canvas made with special substances that permit light to pass through it."
        },
        {
            id: 5,
            name: "Sticker and Labels",
            image: ["/sticker.png", "/cup.png", "/forms.png"],
            
            price: 260,
            description: "Label Stickers are indispensable tools that offer convenience, organization, customization, and versatility for a wide range of personal, professional, and creative applications."
        },
        {
            id: 6,
            name: "Acrylic Build-up",
            image: ["/signage.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "Acrylic signage refers to signs made using acrylic sheets as the primary material. These signs are popular for their sleek, modern appearance and versatility in design"
        },

        {
            id: 7,
            name: "Standee Signage",
            image: ["/standee.png", "/cup.png", "/forms.png"],

            price: 200,
            description: "We offer a range of innovative and eye-catching standee designs to help you effectively communicate your message, promote your brand, and enhance your visibility at events, exhibitions, trade shows, retail spaces, and more. "
        },
        {
            id: 8,
            name: "Wall Mural",
            image: ["/wallmural.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "From wall art and decals to brand signage and banners, we specialize in producing large format printing applications perfect for the corporate image. Our experts will work with you to ensure that we find the right products and finishing for your needs."
        },
        {
            id: 9,
            name: "Glass Frosted Sticker",
            image: ["/glassfrosted.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "Frosted glass stickers provide privacy, aesthetics, and branding opportunities for windows, glass partitions, doors, and more, creating a stylish and professional atmosphere in any environment."
        },
        {
            id: 10,
            name: "Sticker on Sintra",
            image: ["/sintra.png", "/cup.png", "/forms.png"],
           
            price: 200,
            description: "Sintra board, also known as PVC foam board, is a lightweight yet durable material widely used for various signage and display purposes, including stickers."
        },
        {
            id: 11,
            name: "Graphic Design",
            image: ["/graphicdesign.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "Aside from printing and installation, we also offer Graphic Design."
        },
        {
            id: 12,
            name: "Logo Design",
            image: ["/logo.png","/cup.png", "/forms.png"],
            price: 200,
            description: "Logo design is the process of creating a unique visual symbol that represents a brand, business, organization, or individual."
        },
        {
            id: 13,
            name: "Flyer Design",
            image: ["/flyer.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "Flyers are versatile promotional materials designed to catch the eye and deliver a concise message. "
        },
         {
            id: 14,
            name: "Neon Lights",
            image: ["/neon.png", "/cup.png", "/forms.png"],
         
            price: 200,
            description: "Illuminate your brand and make a lasting impression with our Neon Lights Signage Solutions. We specialize in creating captivating and vibrant neon signs that stand out in any settings, from storefronts and restaurants to events and exhibitions."
        },
        {
            id: 15,
            name: "Backlit Film",
            image: ["/backlitfilm.png", "/cup.png", "/forms.png"],
          
            price: 200,
            description: "Backlit film is a versatile and effective medium for showcasing vibrant graphics and captivating visuals in illuminated displays, lightboxes, and signage."
        },
        {
            id: 16,
            name: "Roll-up Banner",
            image: ["/banner.png", "/cup.png", "/forms.png"],
         
            price: 200,
            description: "Maximize your brand visibility and make a lasting impression with our Roll-Up Banner Printing Service. We specialize in creating high-quality, eye-catching roll-up banners that stand out in any setting, from trade shows and events to retail stores and corporate presentations."
        },
        
        {
            id: 17,
            name: "Photo Canvas",
            image: ["/photocanvas.png", "/cup.png", "/forms.png"],
          
            price: 200,
            description: "Transform your memories into timeless works of art with our Personalized Photo Canvas Printing Service. Whether it's a cherished family portrait, a breathtaking landscape, or a special moment captured in time, our high-quality canvas prints bring your favorite photos to life in stunning detail and vibrant color."
        },

        {
            id: 18,
            name: "Brochures  Company Profile",
            image: ["/brochure.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "A brochure and company profile printing service offers professional printing solutions for businesses looking to create high-quality marketing materials."
        },
        {
            id: 19,
            name: "X-banner & Portable Booth",
            image: ["/xbanner.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "Customized X-Booth & Portable Booth services provide tailored solutions for businesses and organizations looking to create unique and branded booth experiences for trade shows, exhibitions, and events."
        },
        {
            id: 20,
            name: "Vehicle Wrap",
            image: ["/vehicle.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "We specialize in transforming vehicles into powerful advertising tools, showcasing your brand, message, and style, with eye-catching and durable wraps that demand attention on the road."
        },
        {
            id: 21,
            name: "Wall Mural Installation",
            image: ["/installation.png", "/cup.png", "/forms.png"],
            price: 200,
            description: "Specialize in expert installation of a wide range of signage and wall murals, helping businesses and individuals bring their visuals to life with precision, efficiency, and attention to detail."
        },
    // ... add the rest (21 items) or import them
  ];

  // Service name mapping
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
    // Map tooltip service name to product name
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
        selectProductByName, // Fixed: consistent function name
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