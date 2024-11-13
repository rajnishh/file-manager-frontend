// src/types/fileTypes.ts

export interface File {
    _id: string;
    fileName: string;
    filePath?: string;
    tags: string[];
    viewCount: number;
    sharedLink?: string;
  }
  
  export interface FileState {
    files: File[];
    loading: boolean;
    error: string | null;
  }
  