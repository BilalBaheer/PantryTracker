"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [updateQuantity, setUpdateQuantity] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pantry'));
        const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      try {
        const docRef = await addDoc(collection(db, 'pantry'), { name: newItem, quantity: quantity });
        setItems([...items, { id: docRef.id, name: newItem, quantity: quantity }]);
        setNewItem('');
        setQuantity('');
        handleClose();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantry', id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const itemDoc = doc(db, 'pantry', id);
      await updateDoc(itemDoc, { quantity: newQuantity });
      setItems(items.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleQuantityChange = (id, value) => {
    setUpdateQuantity({ ...updateQuantity, [id]: value });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      padding="20px"
    >
      <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ marginBottom: 2 }}>
        Add Item
      </Button>
      <Typography variant="h4" gutterBottom>
        Pantry Items
      </Typography>
      <Stack width="80%" spacing={2} overflow="auto">
        {items.map((item) => (
          <Paper
            key={item.id}
            elevation={3}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 20px',
              bgcolor: '#f0f0f0',
            }}
          >
            <Box>
              <Typography variant="h6" color="primary">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="body1">Quantity: {item.quantity}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <TextField
                label="Quantity"
                type="number"
                value={updateQuantity[item.id] || ''}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                sx={{ marginRight: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdateQuantity(item.id, updateQuantity[item.id] || item.quantity)}
                sx={{ marginRight: 2 }}
              >
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                Remove
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item"
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddItem}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
