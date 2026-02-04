'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/components/ui/Motion'
import { useDebounce } from 'use-debounce'
import { 
  Filter, Grid, List, Search as SearchIcon, 
  SlidersHorizontal, X, Save, Clock, Star,
  MapPin, Briefcase, GraduationCap, Heart,
  Eye, Bookmark, ChevronLeft, ChevronRight
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import SearchFilters from '@/components/search/SearchFilters'
import ProfileCard from '@/components/search/ProfileCard'
import ProfileListItem from '@/components/search/ProfileListItem'
import Button from '@/components/ui/Button'
import { searchApi, type SearchResult } from '@/lib/search-api'
import { type SearchFilters as SearchFiltersType, sortOptions, viewModes } from '@/lib/search-constants'

export default function SearchPage() {
  const [filters, setFilters] = useState<Partial<SearchFiltersType>>({
    gender: 'both',
    ageMin: 22,
    ageMax: 35,
    religion: [],
    caste: [],
    country: '',
    education: [],
    incomeMin: 30000,
    incomeMax: 200000,
    maritalStatus: [],
    dietaryPreference: []
  })
  
  const [debouncedFilters] = useDebounce(filters, 500)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [savedSearchName, setSavedSearchName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Search function
  const performSearch = async (page: number = 1, newFilters?: Partial<SearchFiltersType>) => {
    setIsLoading(true)
    try {
      const filtersToUse = newFilters || debouncedFilters
      const results = await searchApi.searchProfiles(filtersToUse, page, 20, sortBy)
      
      if (page === 1) {
        setSearchResults(results)
      } else {
        // Append results for pagination
        setSearchResults(prev => prev ? {
          ...results,
          profiles: [...prev.profiles, ...results.profiles]
        } : results)
      }
      
      // Add to recent searches
      await searchApi.addToRecentSearches(filtersToUse)
      
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial search and search on filter changes
  useEffect(() => {
    performSearch(1)
    setCurrentPage(1)
  }, [debouncedFilters, sortBy])

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  // Reset filters
  const resetFilters = () => {
    const defaultFilters: Partial<SearchFiltersType> = {
      gender: 'both',
      ageMin: 22,
      ageMax: 35,
      religion: [],
      caste: [],
      country: '',
      education: [],
      incomeMin: 30000,
      incomeMax: 200000,
      maritalStatus: [],
      dietaryPreference: []
    }
    setFilters(defaultFilters)
  }

  // Save search
  const handleSaveSearch = async () => {
    if (!savedSearchName.trim()) {
      toast.error('Please enter a name for your search')
      return
    }
    
    try {
      await searchApi.saveSearch(savedSearchName, filters)
      toast.success('Search saved successfully!')
      setSavedSearchName('')
      setShowSaveDialog(false)
    } catch (error) {
      toast.error('Failed to save search')
    }
  }

  // Load more results
  const loadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    performSearch(nextPage)
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (filters.religion && filters.religion.length > 0) count++
    if (filters.caste && filters.caste.length > 0) count++
    if (filters.country) count++
    if (filters.education && filters.education.length > 0) count++
    if (filters.maritalStatus && filters.maritalStatus.length > 0) count++
    if (filters.dietaryPreference && filters.dietaryPreference.length > 0) count++
    return count
  }

  return (
    <DashboardLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onReset={resetFilters}
            onSave={() => setShowSaveDialog(true)}
          />
        </div>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              />
              
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  onReset={resetFilters}
                  onSave={() => setShowSaveDialog(true)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Find Your Match</h1>
                
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
              </div>

              {/* View Toggle & Sort */}
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {viewModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setViewMode(mode.value as 'grid' | 'list')}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        viewMode === mode.value
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {mode.value === 'grid' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            {searchResults && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {searchResults.profiles.length} of {searchResults.total} matches
                </span>
                
                {/* Active Filters */}
                {getActiveFilterCount() > 0 && (
                  <div className="flex items-center space-x-2">
                    <span>{getActiveFilterCount()} filters active</span>
                    <button
                      onClick={resetFilters}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            {isLoading && !searchResults ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for your perfect matches...</p>
                </div>
              </div>
            ) : searchResults && searchResults.profiles.length > 0 ? (
              <>
                {/* Results Grid/List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {searchResults.profiles.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProfileCard profile={profile} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.profiles.map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProfileListItem profile={profile} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {searchResults.hasMore && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={loadMore}
                      variant="secondary"
                      size="lg"
                      isLoading={isLoading}
                      className="px-8"
                    >
                      Load More Profiles
                    </Button>
                  </div>
                )}
              </>
            ) : searchResults && searchResults.profiles.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search filters to find more profiles
                </p>
                <Button onClick={resetFilters} variant="primary">
                  Reset Filters
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Save Search Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setShowSaveDialog(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Search</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Name
                    </label>
                    <input
                      type="text"
                      value={savedSearchName}
                      onChange={(e) => setSavedSearchName(e.target.value)}
                      placeholder="e.g., Software Engineers in NYC"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setShowSaveDialog(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSearch}
                      variant="primary"
                      className="flex-1"
                    >
                      Save Search
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}