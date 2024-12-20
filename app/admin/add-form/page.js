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
    imageUrl: '' // To store uploaded image URL
  });

  const [isUploading, setIsUploading] = useState(false); // Upload state
  const router = useRouter();

  // Handle UploadThing Image Upload Success
  const handleImageUpload = (res) => {
    if (res && res[0]) {
      setForm({ ...form, imageUrl: res[0].url }); // Save image URL in form state
      console.log("Image uploaded successfully:", res[0].url);
    }
  };

  // Add Product Handler
  const handleAddProduct = async () => {
    if (!form.imageUrl) {
      alert("Please upload an image before submitting the form.");
      return;
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>

      {/* Product Form Fields */}
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      {/* Upload Image Section */}
      <h2 className="text-lg font-semibold mb-2">Upload Product Image</h2>
      {isUploading && <p className="text-blue-500">Uploading...</p>}
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

      {/* Submit Button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={handleAddProduct}
        disabled={isUploading} // Prevent submission during upload
      >
        {isUploading ? "Uploading..." : "Add Product"}
      </button>
    </div>
  );
}
