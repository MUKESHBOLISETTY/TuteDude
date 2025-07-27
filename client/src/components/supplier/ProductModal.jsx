import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Trash2 ,CirclePlus} from 'lucide-react';
import { validateProduct } from '../../lib/utils';
// import  {CirclePlus}  from 'lucide-react';

const ProductModal = ({ isOpen, onClose, onSave, product = null, categories = [] }) => {
  const [bulkDiscounts, setBulkDiscounts] = useState([]);
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  const [previewSource,setPreviewSource] = useState('')

  const isEditing = !!product;

   const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewSource(reader.result)
        setValue('image',reader.result );
        console.log("image un;",reader.result)

      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (product) {
        // Populate form with existing product data
        Object.keys(product).forEach(key => {
          setValue(key, product[key]);
        });
        setBulkDiscounts(product.bulkDiscounts || []);
        setPreviewSource(product.image || '');
      } else {
        // Reset form for new product
        reset();
        setBulkDiscounts([]);
        setPreviewSource('');
      }
    }
  }, [isOpen, product, setValue, reset]);

  const onSubmit = (data) => {
    const productData = {
      ...data,
      bulkDiscounts,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      minOrderQty: parseInt(data.minOrderQty),
      qualityScore: parseFloat(data.qualityScore || 4.0),
    };

    const validation = validateProduct(productData);
    if (!validation.isValid) {
      console.error('Validation errors:', validation.errors);
      return;
    }

    onSave(productData);
    onClose();
  };

  const addBulkDiscount = () => {
    setBulkDiscounts([...bulkDiscounts, { minQty: '', discount: '' }]);
  };

  const removeBulkDiscount = (index) => {
    setBulkDiscounts(bulkDiscounts.filter((_, i) => i !== index));
  };

  const updateBulkDiscount = (index, field, value) => {
    const updated = [...bulkDiscounts];
    updated[index][field] = value;
    setBulkDiscounts(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                {...register('name', { required: 'Product name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Spices">Spices</option>
                <option value="Grains">Grains</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                {...register('unit', { required: 'Unit is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Unit</option>
                <option value="kg">kg</option>
                <option value="g">gram</option>
                <option value="l">liter</option>
                <option value="ml">milliliter</option>
                <option value="pieces">pieces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Unit *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0.01 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                {...register('stock', { required: 'Stock is required', min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Quantity *
              </label>
              <input
                type="number"
                {...register('minOrderQty', { required: 'MOQ is required', min: 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="date"
                {...register('expiryDate', { required: 'Expiry date is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origin
            </label>
            <input
              {...register('origin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Product origin (e.g., Karnataka, Local Farm)"
            />
          </div>

          {/* Bulk Discounts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Bulk Discount Rules
              </label>
              <button
                type="button"
                onClick={addBulkDiscount}
                className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {bulkDiscounts.map((discount, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={discount.minQty}
                      onChange={(e) => updateBulkDiscount(index, 'minQty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Min quantity"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.1"
                      value={discount.discount}
                      onChange={(e) => updateBulkDiscount(index, 'discount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Discount %"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBulkDiscount(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>


          <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700" htmlFor="image">
                Image URL

                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
                <div 
                onClick={() => document.getElementById('image').click()}
                className='flex p-3 items-center justify-between mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'>
                  <p className="text-[16px]">Choose Images</p>
                  <CirclePlus />
                </div>
              </label>
              {
                previewSource ? (
                  <div className="mt-2">
                    <img src={previewSource} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-3">No images choosen yet.</p>
                )
              }

            </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;