import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import {
  Container,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function ImportPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState(null);

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
      if (!selectedProduct) return;
      try {
        const res = await API.get('/clients/', { 'X-Product-Name': selectedProduct });
        const data = await res.json();
        setClients(data);
      } catch {
        console.error('Failed to fetch clients');
      }
    };
    fetchClients();
  }, [selectedProduct]);

  useEffect(() => {
    const fetchCameras = async () => {
      if (!selectedClient) return;
      try {
        const res = await API.get('/cameras/', { 'X-Client-Name': selectedClient });
        const data = await res.json();
        setCameras(data);
      } catch {
        console.error('Failed to fetch cameras');
      }
    };
    fetchCameras();
  }, [selectedClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProduct || !selectedClient) return;

    setIsSubmitting(true);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.postFormData('/import/', formData, {
        'X-Product-Name': selectedProduct,
        'X-Client-Name': selectedClient,
        'X-Camera-ID': selectedCamera || '',
      });
      const result = await res.json();
      setResponse(result);
    } catch (err) {
      console.error('Import failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Import JSON
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Product Select */}
          <FormControl fullWidth required>
            <InputLabel>Product</InputLabel>
            <Select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedClient('');
                setSelectedCamera('');
                setClients([]);
                setCameras([]);
              }}
              label="Product"
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => navigate('/add-product')}>Add Product</Button>

          {/* Client Select */}
          <FormControl fullWidth required disabled={!selectedProduct}>
            <InputLabel>Client</InputLabel>
            <Select
              value={selectedClient}
              onChange={(e) => {
                setSelectedClient(e.target.value);
                setSelectedCamera('');
                setCameras([]);
              }}
              label="Client"
            >
              {clients.map((c) => (
                <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => navigate('/add-client')}>Add Client</Button>

          {/* Camera Select */}
          <FormControl fullWidth disabled={!selectedClient}>
            <InputLabel>Camera</InputLabel>
            <Select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              label="Camera"
            >
              {cameras.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => navigate('/add-camera')}>Add Camera</Button>

          {/* File Upload */}
          <Button
            component="label"
            variant="contained"
            startIcon={<UploadFileIcon />}
          >
            {file ? file.name : "Choose JSON File"}
            <input
              type="file"
              accept="application/json"
              hidden
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>

          {/* Submit Button */}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!file || !selectedProduct || !selectedClient}
          >
            Import
          </LoadingButton>
        </Box>

        {/* Response Viewer */}
        {response && (
          <Box mt={4}>
            <Alert severity="info" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {JSON.stringify(response, null, 2)}
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
