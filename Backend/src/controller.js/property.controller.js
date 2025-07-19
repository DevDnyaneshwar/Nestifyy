import { Property } from "../models/property.model.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs/promises";
import jwt from 'jsonwebtoken';

const createproperty = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      district,
      zipcode,
      location,
      rent,
      propertyType,
      noOfBedroom,
      bhkType,
      area,
      deposit,
      amenities,
      allowBroker,
    } = req.body;

    // Log incoming request for debugging
    console.log("createproperty: Received body:", req.body);
    console.log("createproperty: Received files:", req.files);
    console.log("createproperty: req.user:", req.user);

    // Verify authenticated user
    const ownerId = req.user?._id || req.user?.id;
    if (!ownerId) {
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    // Validate required fields
    if (
      !title ||
      !address ||
      !city ||
      !district ||
      !zipcode ||
      !location ||
      !rent ||
      !propertyType ||
      !noOfBedroom
    ) {
      if (req.files && req.files.length > 0) {
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      }
      return res.status(400).json({
        message:
          "Please fill all required fields: title, address, city, district, zipcode, location, rent, propertyType, noOfBedroom.",
      });
    }

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(file => uploadImage(file))
      );
    }

    // Create new property
    const newProperty = new Property({
      title,
      description,
      address,
      city,
      district,
      zipcode: Number(zipcode),
      location,
      rent: Number(rent),
      propertyType,
      noOfBedroom: Number(noOfBedroom),
      bhkType: bhkType || undefined,
      area: area ? Number(area) : undefined,
      deposit: deposit ? Number(deposit) : 0,
      amenities: Array.isArray(amenities) ? amenities : [],
      allowBroker: allowBroker === "true" || allowBroker === true,
      imageUrls,
      owner: ownerId,
    });

    // Save to MongoDB
    await newProperty.save();
    console.log("createproperty: Property saved:", newProperty._id);

    res.status(201).json({
      message: "Property created successfully!",
      propertyId: newProperty._id,
      property: newProperty,
    });
  } catch (error) {
    console.error("createproperty: Error:", error);
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
    res.status(500).json({
      message: "Failed to create property",
      error: error.message,
    });
  }
};

const updateProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const updates = req.body;
    const authenticatedUserId = req.user._id;

    let imageUrls = updates.imageUrls || [];
    if (req.files && req.files.length > 0) {
      imageUrls = await Promise.all(
        req.files.map(file => uploadImage(file))
      );
    }

    const propertyToUpdate = await Property.findById(propertyId);
    if (!propertyToUpdate) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (propertyToUpdate.owner.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this property" });
    }

    // Remove old images from Cloudinary if new images are provided
    if (imageUrls.length > 0 && propertyToUpdate.imageUrls.length > 0) {
      await Promise.all(
        propertyToUpdate.imageUrls.map(imageUrl => {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          return deleteImage(publicId);
        })
      );
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: { ...updates, imageUrls } },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      property: updatedProperty,
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error('Error in updateProperty:', error);
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
    }
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const authenticatedUserId = req.user._id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this property' });
    }

    // Delete images from Cloudinary
    if (property.imageUrls && property.imageUrls.length > 0) {
      await Promise.all(
        property.imageUrls.map(imageUrl => {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          return deleteImage(publicId);
        })
      );
    }

    await Property.findByIdAndDelete(propertyId);

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    const sanitizedProperties = properties.map(property => ({
      ...property.toObject(),
      imageUrls: Array.isArray(property.imageUrls) ? property.imageUrls : [],
    }));
    res.status(200).json({ properties: sanitizedProperties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const sanitizedProperty = {
      ...property.toObject(),
      imageUrls: Array.isArray(property.imageUrls) ? property.imageUrls : [],
    };
    res.status(200).json({ property: sanitizedProperty });
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
};
const searchProperties = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && typeof search === 'string' && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query = {
        $or: [
          { city: { $regex: escapedSearch, $options: 'i' } },
          { district: { $regex: escapedSearch, $options: 'i' } },
          { area: { $regex: escapedSearch, $options: 'i' } },
          { propertyType: { $regex: escapedSearch, $options: 'i' } },
        ],
      };
    }
    const properties = await Property.find(query)
      .populate({ path: 'owner', select: 'name email', strictPopulate: false })
      .limit(4);
    const sanitizedProperties = properties.map(property => ({
      ...property.toObject(),
      imageUrls: Array.isArray(property.imageUrls) ? property.imageUrls : [],
    }));
    res.status(200).json({ properties: sanitizedProperties });
  } catch (error) {
    console.error('Error searching properties:', { message: error.message, stack: error.stack });
    res.status(500).json({ message: 'Failed to search properties', error: error.message });
  }
};
export { createproperty, updateProperty, deleteProperty, getAllProperties, getPropertyById, searchProperties };