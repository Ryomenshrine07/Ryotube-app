import { create } from "zustand";

interface Download {
  id: number;
  title: string;
  thumbnail:string,
  channelName:string,
  videoDuration:string,
  progress: number;
  fileSize:number,
  status: "downloading" | "completed" | "failed";
}

interface DownloadState {
  downloads: Download[];
  addDownload: (download: Download) => void;
  updateProgress: (id: number, progress: number) => void;
  markCompleted: (id: number) => void;
  updateStatus: (id:number, status: Download["status"]) => void;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  downloads: [],
  addDownload: (download) =>
    set((state) => ({
      downloads: [...state.downloads, download],
    })),
  updateProgress: (id, progress) =>
    set((state) => ({
      downloads: state.downloads.map((d) =>
        d.id === id ? { ...d, progress } : d
      ),
    })),
  markCompleted: (id) =>
    set((state) => ({
      downloads: state.downloads.map((d) =>
        d.id === id ? { ...d, status: "completed", progress: 100 } : d
      ),
    })),
    updateStatus: (id: number, status: Download["status"]) =>
    set(state => ({
        downloads: state.downloads.map(d =>
        d.id === id ? { ...d, status } : d
        )
    })),
}));
