"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pantry"));
        const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const addItem = async () => {
    if (newItem.trim() === '' || newQuantity.trim() === '') return;

    try {
      const docRef = await addDoc(collection(db, "pantry"), { name: newItem, quantity: newQuantity });
      setItems([...items, { id: docRef.id, name: newItem, quantity: newQuantity }]);
      setNewItem('');
      setNewQuantity('');
      document.getElementById('add-item-form').style.display = 'none';
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, "pantry", id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      const itemDoc = doc(db, "pantry", id);
      await updateDoc(itemDoc, { quantity: newQuantity });
      setItems(items.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bgcolor="#f4f4f9"
      p={3}
    >
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => document.getElementById('add-item-form').style.display = 'block'}
        sx={{ mb: 2 }}
      >
        Add Item
      </Button>
      <Box
        id="add-item-form"
        display="none"
        width="300px"
        p={3}
        mt={2}
        mb={2}
        border="1px solid #ccc"
        borderRadius="8px"
        boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
        bgcolor="#fff"
      >
        <Typography variant="h6" gutterBottom>Add Item</Typography>
        <TextField
          label="Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addItem} fullWidth>Add</Button>
      </Box>
      <Typography variant="h4" mb={2} color="primary">Pantry Items</Typography>
      <Stack 
        width="800px" 
        spacing={2} 
        overflow="auto" 
        p={2}
        borderRadius="8px"
        boxShadow="0px 0px 10px rgba(0,0,0,0.1)"
        bgcolor="#fff"
      >
        {items.map((item) => (
          <Paper
            key={item.id}
            elevation={3}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 2,
              bgcolor: '#f9f9f9',
              mb: 1,
              borderRadius: '8px',
            }}
          >
            <Box>
              <Typography variant="h5" color="primary">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Quantity: {item.quantity}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <TextField
                label="Quantity"
                type="number"
                defaultValue={item.quantity}
                onBlur={(e) => updateQuantity(item.id, e.target.value)}
                margin="normal"
                sx={{ width: '100px', mr: 2 }}
              />
              <Button variant="contained" color="secondary" onClick={() => removeItem(item.id)}>
                Remove
              </Button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
