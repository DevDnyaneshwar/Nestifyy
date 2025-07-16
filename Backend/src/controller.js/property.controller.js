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
      try {
        const uploadPromises = req.files.map((file) => uploadImage(file.path));
        const uploadedResults = await Promise.all(uploadPromises);
        imageUrls = uploadedResults.map((result) => result.secure_url);
        await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      } catch (error) {
        console.error("createproperty: Cloudinary upload error:", error);
        if (req.files && req.files.length > 0) {
          await Promise.all(req.files.map((file) => fs.unlink(file.path)));
        }
        return res.status(500).json({ message: `Image upload failed: ${error.message}` });
      }
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
      allowBroker: allowBroker === "true" || allowBroker === "yes",
      image: imageUrls,
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

    let newImageUrl = '';
    if (req.file) {
      try {
        const uploadedResult = await uploadImage(req.file.path);
        newImageUrl = uploadedResult.secure_url;
        await fs.unlink(req.file.path);
      } catch (error) {
        return res.status(500).json({ message: `Image upload failed: ${error.message}` });
      }
      updates.image = [newImageUrl];
    }

    const propertyToUpdate = await Property.findById(propertyId);
    if (!propertyToUpdate) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (propertyToUpdate.owner.toString() !== authenticatedUserId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this property" });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: updates },
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
    if (req.file) {
      await fs.unlink(req.file.path);
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

    const deletedProperty = await Property.findByIdAndDelete(propertyId);

    if (deletedProperty.image && deletedProperty.image.length > 0) {
      await Promise.all(
        deletedProperty.image.map((imageUrl) => {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          return deleteImage(publicId);
        })
      );
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProperty:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.status(200).json({ properties });
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
    res.status(200).json({ property });
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
};

export { createproperty, updateProperty, deleteProperty, getAllProperties, getPropertyById };