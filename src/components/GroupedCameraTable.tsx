import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Stack,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete, Edit } from '@mui/icons-material';
import API from '../api'; // adjust path to match your API helper

interface Camera {
  id: string;
  product: string;
  client: string;
  [key: string]: any;
}

interface GroupedCameraTableProps {
  cameras: Camera[];
  onEdit: (camera: Camera) => void;
}

export default function GroupedCameraTable({ cameras, onEdit }: GroupedCameraTableProps) {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [cameraData, setCameraData] = useState<Camera[]>(cameras);

  const handleDelete = async (cameraId: string) => {
    try {
      await API.delete(`/cameras/${cameraId}`);
      setCameraData(prev => prev.filter(cam => cam.id !== cameraId));
    } catch (error) {
      console.error('Failed to delete camera:', error);
    }
  };

  const grouped = cameraData.reduce((acc, cam) => {
    const key = `${cam.client}::${cam.product}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cam);
    return acc;
  }, {} as Record<string, Camera[]>);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Camera ID', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'product', headerName: 'Product', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => onEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Stack>
      )
    },
  ];

  return (
    <Box>
      {Object.entries(grouped).map(([key, group]) => {
        const [client, product] = key.split('::');
        return (
          <Accordion key={key} expanded={expanded === key} onChange={() => setExpanded(expanded === key ? false : key)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>
                {client} / {product} ({group.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DataGrid
                autoHeight
                rows={group.map(cam => ({ id: cam.id, ...cam }))}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
