'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// UploadThing Imports
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css"; // Styles for UploadThing components

export default function AddForm() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '', // To store uploaded image URL
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false); // Upload state
  const router = useRouter();

  // Handle UploadThing Image Upload Success
  const handleImageUpload = (res) => {
    if (res && res[0]) {
      setForm({ ...form, imageUrl: res[0].url }); // Save image URL in form state
      console.log("Image uploaded successfully:", res[0].url);
    }
  };

  // Validate Form Fields
  const validateForm = () => {
    const validationErrors = {};

    if (!form.name.trim()) {
      validationErrors.name = "Product name is required.";
    }
    if (!form.price || isNaN(form.price) || form.price <= 0) {
      validationErrors.price = "Price must be a valid positive number.";
    }
    if (!form.description.trim()) {
      validationErrors.description = "Description is required.";
    }
    if (!form.category.trim()) {
      validationErrors.category = "Category is required.";
    }
    if (!form.imageUrl) {
      validationErrors.imageUrl = "Please upload an image.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Add Product Handler
  const handleAddProduct = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const productData = {
        name: form.name,
        price: form.price,
        description: form.description,
        category: form.category,
        image: form.imageUrl, // Include uploaded image URL
      };

      // Send product data to API
      await axios.post('/api/products', productData);
      router.push('/admin/products'); // Redirect to product list page
    } catch (error) {
      console.error('Failed to add product:', error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>

        {/* Product Form Fields */}
        <div className="space-y-4">
          <div>
            <input
              className={`w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              type="text"
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              className={`w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.price ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <textarea
              className={`w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.description ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Modern Select Dropdown */}
          <div className="relative">
            <select
              className={`appearance-none w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.category ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Clothes">Clothes</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Fragrances">Fragrances</option>
            </select>
            <svg
              className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Upload Image Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Upload Product Image</h2>
          {isUploading && <p className="text-blue-500 mb-2">Uploading...</p>}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              handleImageUpload(res);
              setIsUploading(false); // Stop uploading state
            }}
            onUploadError={(error) => {
              console.error("Upload Error:", error.message);
              setIsUploading(false);
              alert("Failed to upload image. Please try again.");
            }}
            onUploadBegin={() => setIsUploading(true)} // Set uploading state
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          {form.imageUrl && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2">Uploaded Image:</p>
              <img
                src={form.imageUrl}
                alt="Uploaded Product"
                className="w-40 h-40 object-cover rounded-lg shadow-md border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition-all disabled:bg-blue-300"
          onClick={handleAddProduct}
          disabled={isUploading} // Prevent submission during upload
        >
          {isUploading ? "Uploading..." : "Add Product"}
        </button>
      </div>
    </div>
  );
}
