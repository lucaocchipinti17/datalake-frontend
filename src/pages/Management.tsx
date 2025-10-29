// src/pages/ManagementPage.tsx
import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ProductManager from '../components/ProductManager';
import ClientManager from '../components/ClientManager';
import CameraManager from '../components/CameraManager';
import LabelManager from '../components/LabelManager';

export default function ManagementPage() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Management</Typography>
      <Tabs value={tabIndex} onChange={handleChange} indicatorColor="primary" textColor="primary">
        <Tab label="Products" />
        <Tab label="Clients" />
        <Tab label="Cameras" />
        <Tab label="Labels" />
      </Tabs>

      <Box mt={3}>
        {tabIndex === 0 && <ProductManager />}
        {tabIndex === 1 && <ClientManager />}
        {tabIndex === 2 && <CameraManager />}
        {tabIndex === 3 && <LabelManager />}
      </Box>
    </Box>
  );
}
