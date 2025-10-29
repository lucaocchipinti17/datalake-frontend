import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, IconButton, List, ListItem, ListItemText,
} from '@mui/material';
import API from '../api';
import { Delete, Edit } from '@mui/icons-material';

export default function LabelManager() {
  const [categories, setCategories] = useState<{ category: string, labels: string[] }[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const fetchLabels = async () => {
    const res = await fetch('/api/labels/');
    const data = await res.json();
    setCategories(data.categories || []);
  };

  const addLabel = async () => {
    await API.post(`/api/labels/${newCategory}`, { label: newLabel });
    setNewLabel('');
    fetchLabels();
  };

  const deleteLabel = async (category: string, label: string) => {
    await fetch(`/api/labels/${category}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    });
    fetchLabels();
  };

  const deleteCategory = async (category: string) => {
    await fetch(`/api/labels/${category}`, { method: 'DELETE' });
    fetchLabels();
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Manage Labels</Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
        <TextField label="Label" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
        <Button variant="contained" onClick={addLabel}>Add</Button>
      </Box>

      {categories.map(({ category, labels }) => (
        <Box key={category} mb={2}>
          <Typography variant="subtitle1">{category}</Typography>
          <List dense>
            {labels.map(label => (
              <ListItem
                key={label}
                secondaryAction={
                  <IconButton edge="end" onClick={() => deleteLabel(category, label)}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </List>
          <Button size="small" color="error" onClick={() => deleteCategory(category)}>Delete Category</Button>
        </Box>
      ))}
    </Paper>
  );
}