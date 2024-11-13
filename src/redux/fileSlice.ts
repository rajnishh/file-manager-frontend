import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axios';
import { File, FileState } from '../types/fileTypes';

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

// Fetch files from the backend
export const fetchFiles = createAsyncThunk('files/fetchFiles', async (username: string) => {
    const response = await axiosInstance.get(`/files/${username}/all`);
    return response.data;
  });

// Async thunk for uploading a file
export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async ({ file, tags }: { file: globalThis.File; tags: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', tags);
      const response = await axiosInstance.post('/files/upload', formData);
      return response.data as File;
    }
  );

// Async thunk for generating a shareable link
export const generateShareableLink = createAsyncThunk(
  'files/generateShareableLink',
  async (fileId: string) => {
    const response = await axiosInstance.post(`/files/${fileId}/share`);
    return { fileId, sharedLink: response.data.sharedLink };
  }
);

// Async thunk for viewing statistics
export const viewStatistics = createAsyncThunk(
  'files/viewStatistics',
  async (fileId: string) => {
    const response = await axiosInstance.get(`/files/${fileId}/statistics`);
    return { fileId, viewCount: response.data.viewCount };
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    reorderFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch files';
      })
      .addCase(uploadFile.fulfilled, (state, action: PayloadAction<File>) => {
        state.files.push(action.payload);
      })
      .addCase(generateShareableLink.fulfilled, (state, action: PayloadAction<{ fileId: string; sharedLink: string }>) => {
        const file = state.files.find((f) => f._id === action.payload.fileId);
        if (file) file.sharedLink = action.payload.sharedLink;
      })
      .addCase(viewStatistics.fulfilled, (state, action: PayloadAction<{ fileId: string; viewCount: number }>) => {
        const file = state.files.find((f) => f._id === action.payload.fileId);
        if (file) file.viewCount = action.payload.viewCount;
      });
  },
});
export const { reorderFiles } = fileSlice.actions;
export default fileSlice.reducer;
