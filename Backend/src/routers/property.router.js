// property.router.js
import { Router } from "express";
import { createproperty, updateProperty, deleteProperty, getPropertyById, getAllProperties } from "../controller.js/property.controller.js";
import authMiddleware from "../middlewares/auth.js"; 
import upload from "../middlewares/multer.middleware.js";

const router = Router();

// Add authMiddleware to ensure only authenticated users can create properties
router.post('/register', authMiddleware, upload.array('image', 10), createproperty);
router.put('/id', authMiddleware, updateProperty);
router.delete('/id', authMiddleware, deleteProperty);
router.get('/all', getAllProperties);
router.get('/:id', getPropertyById);

export default router;