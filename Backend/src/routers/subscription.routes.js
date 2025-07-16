import { Router } from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    createSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan
} from '../controller.js/subscription.controller.js'



const router = Router();

// Public route (or for authenticated users to view plans)
router.get('/plans', getAllSubscriptionPlans);
router.get('/plan', getSubscriptionPlanById);

// Super Admin only routes for managing plans
router.post('/create', createSubscriptionPlan);
router.put('/update', authMiddleware, updateSubscriptionPlan);
router.delete('/delete', authMiddleware, deleteSubscriptionPlan);

export default router;