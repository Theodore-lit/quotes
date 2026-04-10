import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.patch('/disactive/:id', userController.disactive);
router.patch('/:id', userController.update);
router.get('/:id', userController.getProfile);

export default router;