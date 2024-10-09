import express from 'express';
import { signup, login, logout } from '../controller/authController.js'; // Correctly import controllers

const router = express.Router();

router.post('/signup', signup); // Create signup route
router.post('/login', login);   // Create login route
router.post('/logout', logout); // Create logout route

export default router;


