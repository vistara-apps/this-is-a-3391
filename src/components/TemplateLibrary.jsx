import React, { useState } from 'react'
import { Search, Filter, Play, Heart, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'

const TemplateLibrary = () => {
  const { state, actions } = useApp()
  const { user, templates } = state
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'social', name: 'Social Media' },
    { id: 'business', name: 'Business' },
    { id: 'education', name: 'Education' },
    { id: 'entertainment', name: 'Entertainment' },
  ]

  // Templates are now loaded from context

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const canUseTemplate = (template) => {
    return !template.isPremium || user.subscriptionTier !== 'free'
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Template Library</h1>
          <p className="text-gray-400">Choose from hundreds of professionally designed templates</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-200">
              <div className="relative aspect-[3/4] bg-gray-700">
                <img 
                  src={template.thumbnail} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center group">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 ml-0.5" />
                  </button>
                </div>

                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    PRO
                  </div>
                )}

                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {template.duration}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-2">{template.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <Heart className="w-4 h-4" />
                    <span>{template.likes}</span>
                  </div>
                  
                  <button 
                    disabled={!canUseTemplate(template)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canUseTemplate(template)
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canUseTemplate(template) ? 'Use Template' : 'Upgrade Required'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No templates found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateLibrary
