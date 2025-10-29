import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function AddCameraPage() {
  const [cameraId, setCameraId] = useState('');
  const [product, setProduct] = useState('');
  const [client, setClient] = useState('');
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products/');
        const data = await res.json();
        setProducts(data);
      } catch {
        console.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      if (!product) return;
      try {
        const res = await API.get('/clients/', {
          'X-Product-Name': product,
        });
        const data = await res.json();
        setClients(data);
      } catch {
        console.error('Failed to fetch clients');
      }
    };
    fetchClients();
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post(
        '/cameras/',
        {
          id: cameraId,
          client: client,
          product: product
        }
      );
      navigate('/import');
    } catch {
      setError('Failed to add camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Add Camera
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Product Select */}
          <FormControl fullWidth required>
            <InputLabel>Product</InputLabel>
            <Select
              value={product}
              onChange={(e) => {
                setProduct(e.target.value);
                setClient('');
                setClients([]);
              }}
              label="Product"
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Client Select */}
          <FormControl fullWidth required disabled={!product}>
            <InputLabel>Client</InputLabel>
            <Select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              label="Client"
            >
              {clients.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Camera ID Input */}
          <TextField
            required
            fullWidth
            label="Camera ID"
            value={cameraId}
            onChange={(e) => setCameraId(e.target.value)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !cameraId || !client || !product}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Camera'}
          </Button>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
