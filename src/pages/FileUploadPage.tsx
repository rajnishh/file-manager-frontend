import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, TextField, AppBar, Toolbar, IconButton } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Dropzone from 'react-dropzone';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { uploadFile, fetchFiles, reorderFiles } from '../redux/fileSlice';
import { logout } from '../redux/authSlice';
import FileCard from '../components/FileCard';
import { File as CustomFile } from '../types/fileTypes';
import { getUsernameFromToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FileFormInputs {
  tags: string;
}

const schema = yup.object().shape({
  tags: yup.string().required('Please provide at least one tag'),
});

const SortableFileCard: React.FC<{ file: CustomFile }> = ({ file }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <Grid item xs={12} sm={6} md={4} ref={setNodeRef} style={style}>
      <Box {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
        {/* A separate handle area to drag the card */}
        <Typography variant="subtitle2" color="textSecondary">Drag</Typography>
      </Box>
      <FileCard file={file} />
    </Grid>
  );
};

const FileUploadPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { files } = useAppSelector((state) => state.files);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FileFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { tags: '' },
  });

  const onDrop = (acceptedFiles: globalThis.File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const onSubmit: SubmitHandler<FileFormInputs> = (data) => {
    if (selectedFile) {
      dispatch(uploadFile({ file: selectedFile, tags: data.tags }));
      reset();
      setSelectedFile(null);
    }
  };

  const username = getUsernameFromToken();

  useEffect(() => {
    if (username) {
      dispatch(fetchFiles(username));
    }
  }, [dispatch, username]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((file) => file._id === active.id);
      const newIndex = files.findIndex((file) => file._id === over.id);
      const reorderedFiles = arrayMove(files, oldIndex, newIndex);
      dispatch(reorderFiles(reorderedFiles));
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome{username ? `, ${username}` : ''}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>File Upload</Typography>

        <Dropzone onDrop={onDrop} accept={{ 'image/*': [], 'video/*': [] }}>
          {({ getRootProps, getInputProps }) => (
            <Box {...getRootProps()} sx={{ p: 3, border: '2px dashed #ccc', textAlign: 'center', cursor: 'pointer', mb: 2 }}>
              <input {...getInputProps()} />
              <Typography variant="body1">Drag & Drop an image or video file here, or click to select</Typography>
            </Box>
          )}
        </Dropzone>

        {selectedFile && (
          <Typography variant="body1" sx={{ mb: 2 }}>Selected file: {selectedFile.name}</Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tags (comma-separated)"
                fullWidth
                error={!!errors.tags}
                helperText={errors.tags?.message}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Button type="submit" variant="contained" color="primary" disabled={!selectedFile}>Upload</Button>
        </form>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Uploaded Files</Typography>

          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={files.map(file => file._id)}>
              <Grid container spacing={2}>
                {files.map((file) => (
                  <SortableFileCard key={file._id} file={file} />
                ))}
              </Grid>
            </SortableContext>
          </DndContext>
        </Box>
      </Box>
    </Box>
  );
};

export default FileUploadPage;
