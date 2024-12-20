'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditForm() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: '', image: '' });
  const [newImage, setNewImage] = useState(null); // For file input
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products?id=${id}`);
        setForm(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleFileUpload = async () => {
    if (!newImage) return form.image; // Use existing image if no new image is uploaded

    const formData = new FormData();
    formData.append('file', newImage);

    try {
      const { data } = await axios.post('/api/uploadthing', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.fileUrl; // Assuming UploadThing returns a file URL
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const imageUrl = await handleFileUpload(); // Upload image and get the URL

      const updatedProduct = {
        ...form,
        image: imageUrl, // Update the image URL
      };

      await axios.put('/api/products', { id, ...updatedProduct });
      router.push('/admin/products'); // Redirect to the product list page
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
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
        type="file"
        onChange={(e) => setNewImage(e.target.files[0])}
      />
      <button
        className="bg-yellow-500 text-white px-4 py-2"
        onClick={handleUpdateProduct}
      >
        Update Product
      </button>
    </div>
  );
}
