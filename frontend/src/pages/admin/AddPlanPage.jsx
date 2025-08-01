import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Upload, ArrowLeft } from 'lucide-react'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

const AddPlanPage = () => {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm()

  const isFree = watch('is_free')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      
      // Add form fields
      Object.keys(data).forEach(key => {
        if (key !== 'image' && key !== 'planFile') {
          // Handle checkbox value for is_free
          if (key === 'is_free') {
            formData.append(key, data[key] ? 'true' : 'false')
          } else {
            formData.append(key, data[key])
          }
        }
      })

      // Add files
      const imageFile = document.getElementById('image').files[0]
      const planFile = document.getElementById('planFile').files[0]

      if (imageFile) {
        formData.append('image', imageFile)
      }
      if (planFile) {
        formData.append('planFile', planFile)
      }

      await api.post('/plans', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Plan created successfully!')
      navigate('/admin/plans')
    } catch (error) {
      console.error('Error creating plan:', error)
      if (error.response?.data?.errors) {
        // Show validation errors
        error.response.data.errors.forEach(err => {
          toast.error(err.msg)
        })
      } else {
        toast.error('Failed to create plan')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/plans')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New House Plan</h1>
          <p className="text-gray-600">Create a new house plan listing</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Plan name is required' })}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Modern 3-Bedroom House"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={3}
                  className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the house plan features..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length (ft) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('length', { 
                    required: 'Length is required',
                    min: { value: 0, message: 'Length must be positive' }
                  })}
                  className={`input-field ${errors.length ? 'border-red-500' : ''}`}
                  placeholder="40.0"
                />
                {errors.length && (
                  <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (ft) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('width', { 
                    required: 'Width is required',
                    min: { value: 0, message: 'Width must be positive' }
                  })}
                  className={`input-field ${errors.width ? 'border-red-500' : ''}`}
                  placeholder="30.0"
                />
                {errors.width && (
                  <p className="mt-1 text-sm text-red-600">{errors.width.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq ft) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('area', { 
                    required: 'Area is required',
                    min: { value: 0, message: 'Area must be positive' }
                  })}
                  className={`input-field ${errors.area ? 'border-red-500' : ''}`}
                  placeholder="1200.0"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  {...register('bedrooms', { 
                    required: 'Bedrooms is required',
                    min: { value: 0, message: 'Bedrooms must be 0 or more' }
                  })}
                  className={`input-field ${errors.bedrooms ? 'border-red-500' : ''}`}
                  placeholder="3"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  {...register('bathrooms', { 
                    required: 'Bathrooms is required',
                    min: { value: 0, message: 'Bathrooms must be 0 or more' }
                  })}
                  className={`input-field ${errors.bathrooms ? 'border-red-500' : ''}`}
                  placeholder="2"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floors *
                </label>
                <input
                  type="number"
                  {...register('floors', { 
                    required: 'Floors is required',
                    min: { value: 1, message: 'Floors must be 1 or more' }
                  })}
                  className={`input-field ${errors.floors ? 'border-red-500' : ''}`}
                  placeholder="1"
                />
                {errors.floors && (
                  <p className="mt-1 text-sm text-red-600">{errors.floors.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_free"
                  {...register('is_free')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_free" className="ml-2 block text-sm text-gray-900">
                  This is a free plan
                </label>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { 
                      required: !isFree ? 'Price is required for paid plans' : false,
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                    placeholder="29.99"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload an image</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan File (PDF/ZIP) *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="planFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload plan file</span>
                        <input
                          id="planFile"
                          name="planFile"
                          type="file"
                          accept=".pdf,.zip,.rar"
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, ZIP, RAR up to 50MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/plans')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPlanPage 