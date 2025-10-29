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
import API from '../api';

export default function ClientManager() {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [name, setName] = useState("");
  const [products, setProducts] = useState("");

  const fetchClients = async () => {
    try {
      const res = await API.get("/api/clients/");
      const data = await res.json(); // <-- this is the important part
      setClients(data.clients || []);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const handleSave = async () => {
    const productArray = products
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p);

    try {
      if (editingClient) {
        await API.put("/api/clients/", {
          name,
          products: productArray,
        });
      } else {
        await API.post("/api/clients/", {
          id: name,
          name,
          products: productArray,
        });
      }

      handleClose();
      fetchClients();
    } catch (err) {
      console.error("Failed to save client", err);
    }
  };

  const handleDelete = async (clientName: string) => {
    try {
      await API.delete(`/api/clients/${clientName}`, null);
      fetchClients();
    } catch (err) {
      console.error("Failed to delete client", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClient(null);
    setName("");
    setProducts("");
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Client Name", flex: 1 },
    {
      field: "products",
      headerName: "Products",
      flex: 2,
      renderCell: (params) => params.value.join(", "),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => {
              setEditingClient(params.row);
              setName(params.row.name);
              setProducts(params.row.products.join(", "));
              setOpen(true);
            }}
          >
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
    fetchClients();
  }, []);

  return (
    <Box p={4}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Client Manager</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingClient(null);
            setName("");
            setProducts("");
            setOpen(true);
          }}
        >
          Add Client
        </Button>
      </Stack>
      <DataGrid
        autoHeight
        rows={clients.map((c) => ({ id: c.name, ...c }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Client Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!editingClient}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Products (comma-separated)"
            fullWidth
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
