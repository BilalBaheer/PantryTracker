"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
        console.log("Fetched items:", itemsList); // Log the fetched items
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

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box mb={2}>
        <button onClick={() => {
          const newItemName = prompt('Enter the new item:');
          if (newItemName) setNewItem(newItemName);
        }}>Add Item</button>
      </Box>
      <Typography variant="h3">Pantry Items</Typography>
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
              bgcolor: '#f0f0f0',
            }}
          >
            <Box>
              <Typography variant="h5" color="primary">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography>Quantity: {quantity}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                style={{ marginRight: '10px' }}
              />
              <button onClick={() => removeItem(id)}>Remove</button>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
