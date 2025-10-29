import { useEffect, useState } from 'react';
import API from '../api';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Container,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupsIcon from '@mui/icons-material/Groups';
import VideocamIcon from '@mui/icons-material/Videocam';
import ImageIcon from '@mui/icons-material/Image';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    clients: 0,
    cameras: 0,
    images: 0,
    apiStatus: 'Unknown',
    s3Status: 'Unknown',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/metrics/');
        const data = await res.json();
        setStats({
          products: data.products ?? 0,
          clients: data.clients ?? 0,
          cameras: data.cameras ?? 0,
          images: data.images ?? 0,
          apiStatus: data.apiStatus ?? 'Unknown',
          s3Status: data.s3Status ?? 'Unknown',
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setStats((prev) => ({
          ...prev,
          apiStatus: 'Offline',
          s3Status: 'Disconnected',
        }));
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Monitor system status, metrics, and performance insights
      </Typography>

      <Grid container spacing={3} sx={{ my: 3 }}>
        <StatCard label="Products" value={stats.products} icon={<InventoryIcon fontSize="large" />} />
        <StatCard label="Clients" value={stats.clients} icon={<GroupsIcon fontSize="large" />} />
        <StatCard label="Cameras" value={stats.cameras} icon={<VideocamIcon fontSize="large" />} />
        <StatCard label="Images" value={stats.images} icon={<ImageIcon fontSize="large" />} />
      </Grid>

      <Card sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          System Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              API Status:{' '}
              <Chip
                label={stats.apiStatus}
                color={stats.apiStatus === 'Online' ? 'success' : 'error'}
                variant="outlined"
              />
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              S3 Connectivity:{' '}
              <Chip
                label={stats.s3Status}
                color={stats.s3Status === 'Connected' ? 'success' : 'error'}
                variant="outlined"
              />
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactElement;
}) {
  return (
    <Grid item xs={12} sm={6} md={3} size={3}>
      <Card
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderLeft: '5px solid #1976d2',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: 4,
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#1976d2',
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
