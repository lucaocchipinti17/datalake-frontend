import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import API from '../api';

export default function AddProductPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/products/', { name });
      navigate('/import');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Add Product
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        >
          <TextField
            required
            fullWidth
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Add Product'
            )}
          </Button>

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
