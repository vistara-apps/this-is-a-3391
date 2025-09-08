import React, { useState } from 'react'
import { Plus, Search, MoreVertical, Play, Edit, Trash2, Copy } from 'lucide-react'

const ProjectsList = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const projects = [
    {
      id: 1,
      name: 'Summer Sale Promo',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      lastModified: '2 hours ago',
      duration: '30s',
      status: 'completed',
      platform: 'Instagram'
    },
    {
      id: 2,
      name: 'Product Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      lastModified: '1 day ago',
      duration: '2:15',
      status: 'draft',
      platform: 'YouTube'
    },
    {
      id: 3,
      name: 'Brand Story',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
      lastModified: '3 days ago',
      duration: '1:45',
      status: 'processing',
      platform: 'TikTok'
    },
    {
      id: 4,
      name: 'Customer Testimonial',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
      lastModified: '1 week ago',
      duration: '45s',
      status: 'completed',
      platform: 'LinkedIn'
    },
  ]

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400 bg-opacity-20'
      case 'processing': return 'text-yellow-400 bg-yellow-400 bg-opacity-20'
      case 'draft': return 'text-gray-400 bg-gray-400 bg-opacity-20'
      default: return 'text-gray-400 bg-gray-400 bg-opacity-20'
    }
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
            <p className="text-gray-400">Manage all your video projects in one place</p>
          </div>
          
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="name">Name A-Z</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-200">
              <div className="relative aspect-video bg-gray-700">
                <img 
                  src={project.thumbnail} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center group">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 ml-0.5" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </div>

                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {project.duration}
                </div>

                {/* Menu */}
                <button className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 truncate">{project.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>{project.platform}</span>
                  <span>{project.lastModified}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-6">Create your first video project to get started</p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Create New Project
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsList