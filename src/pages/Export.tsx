import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  keyframes,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import API from '../api';

interface exportResultInterface {
  images_exported: 0,
  images_failed: 0,
  export_prefix: '',
  export_folder: '',
  metadata: [],
  failed_images: [],
  status: '',
}

export default function ExportPage() {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [labels, setLabels] = useState<string[]>([]);

  const [form, setForm] = useState({
    product: '',
    client: '',
    camera_id: '',
    label_value: '',
    limit: '',
    min_vehicles: '',
    max_vehicles: '',
    min_pedestrians: '',
    max_pedestrians: '',
    min_animals: '',
    max_animals: '',
    min_labels: '',
    max_labels: '',
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportResult, setExportResult] = useState<exportResultInterface[]>();

  useEffect(() => {
    API.get('/products/').then(res => res.json()).then(setProducts);    
  }, []);
  
  useEffect(() => {
    API.get('/labels/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.categories)) {
          const allLabels: string[] = data.categories.flatMap(cat => cat.labels);
          setLabels(allLabels);
        }
      })
      .catch(err => console.error('Failed to fetch labels:', err));
  }, []);

  useEffect(() => {
    if (form.product) {
      API.get('/clients/', { 'X-Product-Name': form.product })
        .then(res => res.json())
        .then(setClients);
    }
  }, [form.product]);

  useEffect(() => {
    if (form.product && form.client) {
      API.get('/cameras/', {
        'X-Product-Name': form.product,
        'X-Client-Name': form.client,
      }).then(res => res.json()).then(setCameras);
    }
  }, [form.product, form.client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const buildRequestPayload = () => {
    const payload: any = {};

    Object.entries(form).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) return;

      if (
        key.startsWith('min_') ||
        key.startsWith('max_') ||
        key === 'limit'
      ) {
        const intValue = parseInt(value);
        if (!isNaN(intValue)) payload[key] = intValue;
      } else {
          payload[key] = value;
      }
    });
    return payload;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await API.post('/search/', buildRequestPayload());
      const data = await res.json();
      setResults(data);
      setExportResult(null);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await API.post('/export/', buildRequestPayload());
      const data = await res.json();
      setExportResult(data);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setLoading(false);
    }
  };

  const renderRangeInputs = (label, key) => (
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2" gutterBottom>{`${label} (Min - Max)`}</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            name={`min_${key}`}
            label="Min"
            value={form[`min_${key}`]}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            name={`max_${key}`}
            label="Max"
            value={form[`max_${key}`]}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Box className="p-6 max-w-6xl mx-auto space-y-6">
      <Typography variant="h4" fontWeight="bold" color="primary">Export Images</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2" gutterBottom>Product</Typography>
          <Select
            fullWidth
            name="product"
            value={form.product}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">Select Product</MenuItem>
            {products.map(p => (
              <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2" gutterBottom>Client</Typography>
          <Select
            fullWidth
            name="client"
            value={form.client}
            onChange={handleChange}
            disabled={!form.product}
            displayEmpty
          >
            <MenuItem value="">Select Client</MenuItem>
            {clients.map(c => (
              <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2" gutterBottom>Camera ID</Typography>
          <Select
            fullWidth
            name="camera_id"
            value={form.camera_id}
            onChange={handleChange}
            disabled={!form.client}
            displayEmpty
          >
            <MenuItem value="">Select Camera</MenuItem>
            {cameras.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.id}</MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {renderRangeInputs("Vehicles", "vehicles")}
        {renderRangeInputs("Pedestrians", "pedestrians")}
        {renderRangeInputs("Animals", "animals")}
        {renderRangeInputs("Labels", "labels")}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>Label (optional)</Typography>
          <Select
            fullWidth
            name="label_value"
            value={form.label_value}
            onChange={handleChange}
            displayEmpty
          >
            <MenuItem value="">Any Label</MenuItem>
            {labels.map((label, idx) => (
              <MenuItem key={idx} value={label}>{label}</MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" gutterBottom>Limit</Typography>
          <TextField
            fullWidth
            type="number"
            name="limit"
            label="Limit"
            value={form.limit}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box className="flex gap-4 mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Search'}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleExport}
          disabled={!results || loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Export'}
        </Button>
      </Box>

      {loading && (
        <Typography variant="body2" color="textSecondary">Processing... Please wait.</Typography>
      )}

      {results && (
        <Card className="mt-6">
          <CardContent>
            <Typography variant="h6" gutterBottom>Search Results</Typography>
            <Typography><strong>Product:</strong> {results.product}</Typography>
            <Typography><strong>Client:</strong> {results.client}</Typography>
            <Typography><strong>Matching Images:</strong> {results.count}</Typography>
          </CardContent>
        </Card>
      )}

      {exportResult && (
        <Card className="mt-6 border-green-500">
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>Export Completed</Typography>
            <Typography><strong>Exported:</strong> {exportResult.images_exported}</Typography>
            <Typography><strong>Failed:</strong> {exportResult.images_failed}</Typography>
            <Typography><strong>Export Folder:</strong> {exportResult.export_prefix}</Typography>
            <Button
              variant="outlined"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify(exportResult.metadata, null, 2)],
                  { type: 'application/json' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'metadata.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download Metadata JSON
            </Button>


            {exportResult.images_failed?.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" color="error">Failed Images:</Typography>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {exportResult.images_failed.map((img, i) => <li key={i}>{img}</li>)}
                </ul>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
