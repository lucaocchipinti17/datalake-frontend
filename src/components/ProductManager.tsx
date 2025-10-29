import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Delete, Edit, Add } from "@mui/icons-material";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSave = async () => {
    if (editingProduct) {
      await fetch(`/api/products/${editingProduct.name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: name }),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }
    setOpen(false);
    setEditingProduct(null);
    setName("");
    fetchProducts();
  };

  const handleDelete = async (productName) => {
    await fetch(`/api/products/${productName}`, { method: "DELETE" });
    fetchProducts();
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Product Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => {
            setEditingProduct(params.row);
            setName(params.row.name);
            setOpen(true);
          }}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.name)}>
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Product Manager</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingProduct(null);
            setName("");
            setOpen(true);
          }}
        >
          Add Product
        </Button>
      </Stack>
      <DataGrid
        autoHeight
        rows={products.map((p) => ({ id: p.id, ...p }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Product Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}