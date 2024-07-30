"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pantry"));
        const itemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Fetched items:", itemsList);
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newItem || !quantity) return;
    const newItemData = { name: newItem, quantity: parseInt(quantity) };
    const docRef = doc(collection(db, "pantry"));
    await setDoc(docRef, newItemData);
    setItems([...items, { id: docRef.id, ...newItemData }]);
    setNewItem('');
    setQuantity('');
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, "pantry", id));
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = async (id, newQuantity) => {
    await updateDoc(doc(db, "pantry", id), { quantity: parseInt(newQuantity) });
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f9"
    >
      <Box mb={2} display="flex" justifyContent="center">
        <TextField
          label="New Item"
          variant="outlined"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" color="primary" onClick={addItem}>
          Add Item
        </Button>
      </Box>
      <Typography variant="h3" gutterBottom>Pantry Items</Typography>
      <Stack width="800px" spacing={2} overflow={'auto'}>
        {items.map(({ id, name, quantity }) => (
          <Paper
            key={id}
            elevation={3}
            sx={{
              width: '100%',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#fff',
            }}
          >
            <Box>
              <Typography variant="h5" color="primary">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography>Quantity: {quantity}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => updateQuantity(id, e.target.value)}
                label="Quantity"
                variant="outlined"
                size="small"
                sx={{ marginRight: 2 }}
              />
              <Button variant="contained" color="secondary" onClick={() => removeItem(id)}>
                Remove
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
