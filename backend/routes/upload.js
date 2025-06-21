// routes/upload.js
import express from 'express';
import upload from '../middleware/upload.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', authenticate, upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.error('Image upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

export default router;