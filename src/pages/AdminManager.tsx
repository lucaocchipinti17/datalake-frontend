import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import API from '../api';
import GroupedCameraTable from '../components/GroupedCameraTable';

export default function AdminManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [cameras, setCameras] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [flatLabels, setFlatLabels] = useState<any[]>([]);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);
  const [editClient, setEditClient] = useState<any>(null);
  const [editCamera, setEditCamera] = useState<any>(null);
  const [clientProducts, setClientProducts] = useState<string[]>([]);
  const [cameraEdit, setCameraEdit] = useState({ id: '', product: '', client: '' });

  const safeJson = async (res: Response) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  };

  const fetchAll = async () => {
    try {
      const [prod, cli, cam, lab] = await Promise.all([
        API.get('/products/').then(safeJson),
        API.get('/clients/').then(safeJson),
        API.get('/cameras/').then(safeJson),
        API.get('/labels/').then(safeJson),
      ]);
      setProducts(Array.isArray(prod) ? prod : []);
      setClients(Array.isArray(cli) ? cli : []);
      setCameras(Array.isArray(cam) ? cam : []);
      setLabels(Array.isArray(lab?.categories) ? lab.categories : []);
      if (Array.isArray(lab?.categories)) {
        const flattened = lab.categories.flatMap(cat =>
          cat.labels.map(label => ({
            name: label,
            category: cat.category,
          }))
        );
        setFlatLabels(flattened);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      switch (type) {
        case 'product': {
          const product = products.find(p => p.id === id);
          if (!product) throw new Error(`Product "${id}" not found`);
          await API.delete(`/products/${product.name}`, null);
          break;
        }
        case 'client': {
          const client = clients.find(c => c.id === id);
          if (!client) throw new Error(`Client "${id}" not found`);
          await API.delete(`/clients/${client.name}`, null);
          break;
        }
        case 'camera': {
          const camera = cameras.find(c => c.id === id);
          if (!camera) throw new Error(`Camera "${id}" not found`);
          await API.delete(`/cameras/${camera.id}`, null);
          break;
        }
        case 'label': {
          const label = flatLabels.find(l => l.name === id);
          if (!label) throw new Error(`Label "${id}" not found`);
          await API.delete(`/labels/${label.category}`, { label: label.name });
          break;
        }
        default:
          return;
      }
      fetchAll();
    } catch (err) {
      console.error(`Failed to delete ${type} ${id}`, err);
    } finally {
      setDeleteTarget(null);
    }
  };

  const clientsForGrid = clients.map(client => ({
    ...client,
    productsDisplay: client.products?.join(', ') || '',
  }));


  const handleClientEditSave = async () => {
    try {
      await API.put('/clients/', {
        name: editClient.name,
        products: clientProducts,
      });
      setEditClient(null);
      setClientProducts([]);
      fetchAll();
    } catch (err) {
      console.error('Failed to update client', err);
    }
  };

  const handleCameraEditSave = async () => {
    try {
      await API.put(`/cameras/${cameraEdit.id}`, null, {
        headers: {
          'X-Product-Name': cameraEdit.product,
          'X-Client-Name': cameraEdit.client,
        },
      });
      setEditCamera(null);
      setCameraEdit({ id: '', product: '', client: '' });
      fetchAll();
    } catch (err) {
      console.error('Failed to update camera', err);
    }
  };

  const getProductNames = (productNames: string[]) => {
    return productNames
      .map((name) => {
        const match = products.find((p) => p.name === name);
        return match ? match.name : name; // fallback to raw name
      })
      .join(', ');
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box>{children}</Box>
    </Box>
  );

  const renderGrid = (title: string, rows: any[], cols: GridColDef[], type: string) => {
    if (!Array.isArray(rows)) {
      console.error(`${title} rows is not an array`, rows);
      return null;
    }

    return (
      <DataGrid
        autoHeight
        rows={rows.map((r: any) => ({ id: r.name || r.id || r.category, ...r }))}
        columns={[
          ...cols,
          {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
              <Stack direction="row" spacing={1}>
                {(type === 'client' || type === 'camera') && (
                  <IconButton onClick={() => {
                    if (type === 'client') {
                      setEditClient(params.row);
                      setClientProducts(params.row.products || []);
                    }
                    if (type === 'camera') {
                      setEditCamera(params.row);
                      setCameraEdit({ id: params.row.id, product: params.row.product, client: params.row.client });
                    }
                  }}>
                    <Edit />
                  </IconButton>
                )}
                <IconButton onClick={() => setDeleteTarget({ type, id: params.row.id })}>
                  <Delete />
                </IconButton>
              </Stack>
            )
          },
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    );
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Admin Manager</Typography>

      {Array.isArray(products) && (
        <Section title="Products">
          {renderGrid('Products', products, [{ field: 'name', headerName: 'Name', flex: 1 }], 'product')}
        </Section>
      )}

      {Array.isArray(clients) && (
        <Section title="Clients">
          {renderGrid('Clients', clientsForGrid, [
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'productsDisplay', headerName: 'Products', flex: 2 }
          ], 'client')}
        </Section>
      )}

      {Array.isArray(cameras) && (
        <Section title="Cameras">
          <GroupedCameraTable
            cameras={cameras}
            onEdit={(cam) => {
              setEditCamera(cam);
              setCameraEdit({ id: cam.id, product: cam.product, client: cam.client });
            }}
            onDelete={(id) => setDeleteTarget({ type: 'camera', id })}
          />
        </Section>
      )}

      {Array.isArray(flatLabels) && (
        <Section title="Labels">
          {renderGrid('Labels', flatLabels, [
            { field: 'name', headerName: 'Label Name', flex: 1 },
            { field: 'category', headerName: 'Category', flex: 1 }
          ], 'label')}
        </Section>
      )}

      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {deleteTarget?.type} "{deleteTarget?.id}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editClient} onClose={() => setEditClient(null)}>
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Products</InputLabel>
            <Select
              multiple
              value={clientProducts}
              onChange={(e) => setClientProducts(e.target.value as string[])}
              label="Products"
            >
              {products.map(p => (
                <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditClient(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleClientEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editCamera} onClose={() => setEditCamera(null)}>
        <DialogTitle>Edit Camera</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={cameraEdit.product}
                label="Product"
                onChange={(e) => setCameraEdit(prev => ({ ...prev, product: e.target.value }))}
              >
                {products.map(p => (
                  <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={cameraEdit.client}
                label="Client"
                onChange={(e) => setCameraEdit(prev => ({ ...prev, client: e.target.value }))}
              >
                {clients.map(c => (
                  <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCamera(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleCameraEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
