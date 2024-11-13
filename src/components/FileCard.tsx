import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAppDispatch } from '../hooks/reduxHooks';
import { generateShareableLink, viewStatistics } from '../redux/fileSlice';

interface FileCardProps {
  file: {
    _id: string;
    fileName: string;
    tags: string[];
    viewCount: number;
    sharedLink?: string;
  };
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const dispatch = useAppDispatch();

  const handleShareLink = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag event
    dispatch(generateShareableLink(file._id));
  };

  const handleViewStatistics = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag event
    dispatch(viewStatistics(file._id));
  };

  return (
    <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
  <Typography variant="h6">{file.fileName}</Typography>
  <Typography variant="body2">Tags: {file.tags.join(', ')}</Typography>
  <Typography variant="body2">Views: {file.viewCount}</Typography>
  
  {file.sharedLink ? (
    <Typography variant="body2">
      Link: <a href={file.sharedLink} target="_blank" rel="noopener noreferrer">
        {`${file.sharedLink.slice(0, 30)}...`} {/* Truncate link to first 30 characters */}
      </a>
    </Typography>
  ) : (
    <Button onClick={handleShareLink} variant="outlined" color="primary" sx={{ mt: 1 }}>
      Generate Share Link
    </Button>
  )}

  <Button onClick={handleViewStatistics} variant="outlined" color="secondary" sx={{ mt: 1, ml: 1 }}>
    View Statistics
  </Button>
</Box>

  );
};


export default FileCard;
