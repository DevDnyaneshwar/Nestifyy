import { subscription } from '../models/subscription.model.js'

const getAllSubscriptionPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlan.find().sort({ priceMonthly: 1 });
        res.status(200).json(plans);
    } catch (error) {
        console.error('Error fetching all subscription plans:', error);
        res.status(500).json({ message: 'Server error while fetching subscription plans.', error: error.message });
    }
};

const getSubscriptionPlanById = async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await subscription.findById(id);

        if (!plan) {
            return res.status(404).json({ message: 'Subscription plan not found.' });
        }

        res.status(200).json(plan);
    } catch (error) {
        console.error(`Error fetching subscription plan with ID ${req.params.id}:`, error);
        // Handle CastError if ID format is invalid
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid subscription plan ID format.' });
        }
        res.status(500).json({ message: 'Server error while fetching subscription plan.', error: error.message });
    }
};

const createSubscriptionPlan = async (req, res) => {
    console.log('req.body:', req.body);
    const { name, priceMonthly, features, description } = req.body;

    // Basic validation
    if (!name || !priceMonthly) {
        return res.status(400).json({ message: 'Name and priceMonthly are required fields.' });
    }
    if (typeof priceMonthly !== 'number' || priceMonthly <= 0) {
        return res.status(400).json({ message: 'priceMonthly must be a positive number.' });
    }

    try {
        const newPlan = new subscription({
            name,
            priceMonthly,
            features: features || [], 
            description
        });

        await newPlan.save();
        res.status(201).json({ message: 'Subscription plan created successfully.', plan: newPlan });
    } catch (error) {
        console.error('Error creating subscription plan:', error);
        // Handle duplicate name error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            return res.status(409).json({ message: 'A subscription plan with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating subscription plan.', error: error.message });
    }
};

const updateSubscriptionPlan = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Basic validation for priceMonthly if it's being updated
    if (updates.priceMonthly !== undefined && (typeof updates.priceMonthly !== 'number' || updates.priceMonthly <= 0)) {
        return res.status(400).json({ message: 'priceMonthly must be a positive number.' });
    }

    try {
        const updatedPlan = await subscription.findByIdAndUpdate(
            id,
            { $set: updates }, 
            { new: true } 
        );

        if (!updatedPlan) {
            return res.status(404).json({ message: 'Subscription plan not found.' });
        }

        res.status(200).json({ message: 'Subscription plan updated successfully.', plan: updatedPlan });
    } catch (error) {
        console.error(`Error updating subscription plan with ID ${req.params.id}:`, error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid subscription plan ID format.' });
        }
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            return res.status(409).json({ message: 'A subscription plan with this name already exists.' });
        }
        res.status(500).json({ message: 'Server error while updating subscription plan.', error: error.message });
    }
};

const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlan = await subscription.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ message: 'Subscription plan not found.' });
        }

        res.status(200).json({ message: 'Subscription plan deleted successfully.' });
    } catch (error) {
        console.error(`Error deleting subscription plan with ID ${req.params.id}:`, error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid subscription plan ID format.' });
        }
        res.status(500).json({ message: 'Server error while deleting subscription plan.', error: error.message });
    }
};

export {getAllSubscriptionPlans, getSubscriptionPlanById, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan }