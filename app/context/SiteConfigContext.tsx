"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SiteConfig {
  [key: string]: any;
}

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (key: string, value: any) => void;
  saveConfig: () => Promise<void>;
  isLoading: boolean;
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  editKey: string | null;
  setEditKey: (key: string | null) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(
  undefined
);

export const SiteConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [config, setConfig] = useState<SiteConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setEditing] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/site-config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const saveConfig = async () => {
    try {
      const res = await fetch("/api/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        throw new Error("Failed to save config");
      }
      alert("Configuration saved successfully!");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save configuration.");
    }
  };

  return (
    <SiteConfigContext.Provider
      value={{ config, updateConfig, saveConfig, isLoading, isEditing, setEditing, editKey, setEditKey }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
};
