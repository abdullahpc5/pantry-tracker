'use client'
import { useState, useEffect } from "react"
import { firestore } from "./firebase"
import { Box, Typography, Stack, Modal, TextField, Button } from "@mui/material"
import { collection , doc, getDoc, setDoc, deleteDoc, getDocs, query } from "firebase/firestore"
import './globals.css';

export default function Home() {
 const [inventory, setInventory] = useState([])
 const [open, setOpen] = useState(false)
 const [itemName, setItemName] = useState('')

 const updateInventory = async () => {
  const snapshots = query(collection(firestore, 'inventory'))
  const docs = await getDocs(snapshots)
  const inventoryList = []
  docs.forEach((doc) => {
    inventoryList.push({
    name: doc.id,
    ...doc.data(),
    })
  })
  setInventory(inventoryList)
 }
 const addItem = async (item) => {
  const docRef = doc(collection(firestore, 'inventory'), item);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const {quantity} = docSnap.data()
    await setDoc(docRef, {quantity: quantity + 1})
  } 
  else {
    await setDoc(docRef, {quantity: 1})
  }
 await updateInventory()
}


  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
    const {quantity} = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
    }
    else {
      await setDoc(docRef, {quantity: quantity - 1})
    }
  }

  await updateInventory()
 }

 useEffect(() => {
  updateInventory()
 }, [])

   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)

 return ( 
    <Box
     width="100vw"
    height="100vh"
    display="flex"
    flexDirection={"column"}
    justifyContent="center"
    alignItems="center"
    gap={2}
    >
      <Modal 
      open={open}
      onClose={handleClose}>
        <Box  
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="#89CFF0"
        border="2px solid #89CFF0"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection={"column"}
        gap={3}
        transform = 'translate(-50%, -50%)'
        
>
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" Direction="row" spacing={2}>
          <TextField variant='outlined'
          fullWidth
          value={itemName}          
          onChange={(e)=>{
              setItemName(e.target.value)
          }}
          />
          <Button variant='outlined' onClick={()=>{
            addItem(itemName)
            setItemName('')
          }}>Add
          </Button>
          </Stack>
          </Box>
      </Modal>
       <Button variant="contained" onClick={()=>{
        handleOpen()
       }}>
          Add New Item
       </Button>
       <Box border="1px solid #333">
        <Box width="800px" height="100px"
        bgcolor="#ADD8E6"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
          <Typography variant="h2" color="#333">Inventory Management</Typography>
        </Box>

       <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity})=>(
            <Box key={name} width={"100%"} 
              min-height="150px" bgcolor="#f0f0f0" 
              display="flex" alignItems="center" 
               justifyContent="space-between" p={5}>
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase()+name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Button variant="contained" onClick={()=>{removeItem(name)}}>Remove</Button>
               </Box>
          ))}
        </Stack>
    </Box>  
         </Box>
  )
}