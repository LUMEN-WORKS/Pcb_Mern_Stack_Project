import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, FileText, User, Mail, Phone, MapPin, Building, Calendar } from 'lucide-react';
import axios from 'axios';

const CustomerUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [serviceType, setServiceType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      console.log('PDF file selected successfully');
    } else {
      console.log('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      alert('Please select a PDF file');
      return;
    }

    if (!serviceType) {
      alert('Please select a service type');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('pdfFile', selectedFile);
      formData.append('serviceType', serviceType);
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('company', data.company || '');
      formData.append('projectDescription', data.projectDescription || '');
      formData.append('quantity', data.quantity || 1);
      formData.append('specifications', data.specifications || '');
      formData.append('deadline', data.deadline || '');

      const response = await axios.post('http://localhost:3000/api/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Order submitted successfully! We will contact you soon.');
      reset();
      setSelectedFile(null);
      setServiceType('');
      
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-8 py-12 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Submit Your Project
            </h1>
            <p className="text-xl text-blue-100">
              Upload your PDF and provide details for your PCB or 3D printing project
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Service Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Select Service Type *
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setServiceType('PCB Printing')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    serviceType === 'PCB Printing'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      serviceType === 'PCB Printing' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}></div>
                    <span className="font-semibold">PCB Printing</span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setServiceType('3D Printing')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    serviceType === '3D Printing'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      serviceType === '3D Printing' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}></div>
                    <span className="font-semibold">3D Printing</span>
                  </div>
                </button>
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Upload PDF File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {selectedFile ? selectedFile.name : 'Click to upload PDF file'}
                  </p>
                  <p className="text-gray-500">Maximum file size: 10MB</p>
                </label>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="h-4 w-4 inline mr-2" />
                  Company (Optional)
                </label>
                <input
                  type="text"
                  {...register('company')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Address *
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your complete address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Project Description
                </label>
                <textarea
                  {...register('projectDescription')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your project requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Specifications
                </label>
                <textarea
                  {...register('specifications')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Technical specifications and requirements"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  {...register('quantity', { min: 1 })}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of units"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  {...register('deadline')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerUpload;
