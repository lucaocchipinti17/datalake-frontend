import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import API from '../api';

type Product = {
  name: string;
};

export default function AddClientPage() {
  const [name, setName] = useState('');
  const [product, setProduct] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products/');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Unexpected response:', data);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post(
        '/clients/',
        {
          id: name,
          name: name,
          products: [product]
        },
      );
      navigate('/import');
    } catch (err) {
      console.error(err);
      setError('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Add Client
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          {/* Product Select */}
          <FormControl fullWidth required>
            <InputLabel>Product</InputLabel>
            <Select
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              label="Product"
            >
              {products.map((p) => (
                <MenuItem key={p.name} value={p.name}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Client Name Input */}
          <TextField
            required
            fullWidth
            label="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name || !product}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Client'
            )}
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
