 import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import API from "../api";

export default function CameraManager() {
  const [cameras, setCameras] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [form, setForm] = useState({ id: "", product: "", client: "" });

  const fetchCameras = async () => {
    try {
      const res = await API.get("/api/cameras/");
      setCameras(res);
    } catch (err) {
      console.error("Failed to fetch cameras", err);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const handleOpen = (camera = null) => {
    setEditingCamera(camera);
    setForm(camera ? { id: camera.id, product: camera.product, client: camera.client } : { id: "", product: "", client: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCamera(null);
    setForm({ id: "", product: "", client: "" });
  };

  const handleSubmit = async () => {
    try {
      if (editingCamera) {
        await API.put(`/api/cameras/${editingCamera.id}`, null,
          {
            "X-Product-Name": form.product,
            "X-Client-Name": form.client
          });
      } else {
        await API.post("/api/cameras/", form);
      }
      handleClose();
      fetchCameras();
    } catch (err) {
      console.error("Failed to save camera", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/cameras/${id}`);
      fetchCameras();
    } catch (err) {
      console.error("Failed to delete camera", err);
    }
  };

  const columns = [
    { field: "id", headerName: "Camera ID", flex: 1 },
    { field: "product", headerName: "Product", flex: 1 },
    { field: "client", headerName: "Client", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpen(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      )
    }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Manage Cameras
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Camera
      </Button>
      <Box mt={2} style={{ height: 400 }}>
        <DataGrid rows={cameras} columns={columns} getRowId={(row) => row.id} />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCamera ? "Edit Camera" : "Add Camera"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Camera ID"
            fullWidth
            value={form.id}
            disabled={!!editingCamera}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Product"
            fullWidth
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Client"
            fullWidth
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
