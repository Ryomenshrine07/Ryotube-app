// downloadsContext.tsx
import React, { createContext, useContext, useState } from "react";

interface DownloadItem {
  id: number;
  title: string;
  progress: number;
  status: "downloading" | "completed";
}

interface DownloadsContextProps {
  downloads: DownloadItem[];
  startDownload: (item: DownloadItem) => void;
  updateProgress: (id: number, progress: number) => void;
  markCompleted: (id: number) => void;
}

const DownloadsContext = createContext<DownloadsContextProps | null>(null);

export const DownloadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const startDownload = (item: DownloadItem) => {
    setDownloads(prev => [...prev, item]);
  };

  const updateProgress = (id: number, progress: number) => {
    setDownloads(prev =>
      prev.map(d => (d.id === id ? { ...d, progress } : d))
    );
  };

  const markCompleted = (id: number) => {
    setDownloads(prev =>
      prev.map(d => (d.id === id ? { ...d, status: "completed", progress: 100 } : d))
    );
  };

  return (
    <DownloadsContext.Provider value={{ downloads, startDownload, updateProgress, markCompleted }}>
      {children}
    </DownloadsContext.Provider>
  );
};

export const useDownloads = () => {
  const ctx = useContext(DownloadsContext);
  if (!ctx) throw new Error("useDownloads must be used inside DownloadsProvider");
  return ctx;
};
