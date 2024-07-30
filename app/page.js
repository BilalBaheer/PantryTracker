"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';

const isClient = typeof window !== 'undefined';

const item = [
  'tomato',
  'potato',
  'onion',
  'garlic',
  'ginger',
  'carrot',
  'kale',
  'cucumber'
];

export default function Home() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pantry"));
      const itemsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsList);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchItems();
    }
  }, []);

  const handleAddClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddItem = async () => {
    if (newItem.trim() !== '' && quantity.trim() !== '') {
      const itemData = { name: newItem, quantity: quantity };
      await addDoc(collection(db, "pantry"), itemData);
      fetchItems();
      setNewItem('');
      setQuantity('');
      handleClose();
    }
  };

  const handleRemoveItem = async (id) => {
    await deleteDoc(doc(db, "pantry", id));
    fetchItems();
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    await updateDoc(doc(db, "pantry", id), { quantity: newQuantity });
    fetchItems();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Button variant="contained" color="primary" onClick={handleAddClickOpen}>
        Add Item
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item"
            type="text"
            fullWidth
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" mt={2}>
        Pantry Items
      </Typography>
      <Stack width="800px" mt={2} spacing={2}>
        {items.map((i) => (
          <Paper
            key={i.id}
            elevation={3}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              bgcolor: '#f0f0f0',
            }}
          >
            <Box>
              <Typography variant="h6" color="primary">
                {i.name.charAt(0).toUpperCase() + i.name.slice(1)}
              </Typography>
              <Typography>
                Quantity: {i.quantity}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <TextField
                label="Quantity"
                type="number"
                value={i.quantity}
                onChange={(e) => handleUpdateQuantity(i.id, e.target.value)}
                sx={{ width: '80px', marginRight: '16px' }}
              />
              <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(i.id)}>
                Remove
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
