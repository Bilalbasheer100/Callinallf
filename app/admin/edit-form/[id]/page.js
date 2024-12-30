'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

// UploadThing Imports
import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css"; // Styles for UploadThing components

export default function EditForm() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '', // Store the current image URL
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false); // Upload state
  const router = useRouter();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products?id=${id}`);
        setForm({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          imageUrl: data.image, // Set the existing image URL
        });
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle UploadThing Image Upload Success
  const handleImageUpload = (res) => {
    if (res && res[0]) {
      setForm({ ...form, imageUrl: res[0].url }); // Update the image URL
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

  // Update Product Handler
  const handleUpdateProduct = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const updatedProduct = {
        name: form.name,
        price: form.price,
        description: form.description,
        category: form.category,
        image: form.imageUrl, // Include updated image URL
      };

      // Send updated product data to API
      await axios.put('/api/products', { id, ...updatedProduct });
      router.push('/admin/products'); // Redirect to product list page
    } catch (error) {
      console.error('Failed to update product:', error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>

        {/* Product Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-gray-700 font-semibold mb-1">
              Product Name
            </label>
            <input
              id="productName"
              className={`w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              type="text"
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="productPrice" className="block text-gray-700 font-semibold mb-1">
              Price
            </label>
            <input
              id="productPrice"
              className={`w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.price ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              type="number"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="productDescription" className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              id="productDescription"
              className={`w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 ${
                errors.description ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
              }`}
              placeholder="Enter product description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="productCategory" className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <div className="relative">
              <select
                id="productCategory"
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

        {/* Update Button */}
        <button
          className="w-full mt-6 bg-yellow-600 text-white py-3 rounded-lg shadow hover:bg-yellow-700 transition-all disabled:bg-yellow-300"
          onClick={handleUpdateProduct}
          disabled={isUploading} // Prevent submission during upload
        >
          {isUploading ? "Uploading..." : "Update Product"}
        </button>
      </div>
    </div>
  );
}
