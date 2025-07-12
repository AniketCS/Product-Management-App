import axios from 'axios'
import { toast } from 'react-toastify'
import {
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  READ_PRODUCTS_REQUEST,
  READ_PRODUCTS_SUCCESS,
  READ_PRODUCTS_FAILURE,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAILURE,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAILURE,
  CLEAR_PRODUCT_MESSAGES
} from '../constants/productConstants'

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api'

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      toast.error('Session expired. Please login again.')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Action Creators
export const createProductRequest = () => ({
  type: CREATE_PRODUCT_REQUEST
})

export const createProductSuccess = (product) => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: product
})

export const createProductFailure = (error) => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error
})

export const readProductsRequest = () => ({
  type: READ_PRODUCTS_REQUEST
})

export const readProductsSuccess = (products) => ({
  type: READ_PRODUCTS_SUCCESS,
  payload: products
})

export const readProductsFailure = (error) => ({
  type: READ_PRODUCTS_FAILURE,
  payload: error
})

export const updateProductRequest = () => ({
  type: UPDATE_PRODUCT_REQUEST
})

export const updateProductSuccess = (product) => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product
})

export const updateProductFailure = (error) => ({
  type: UPDATE_PRODUCT_FAILURE,
  payload: error
})

export const deleteProductRequest = () => ({
  type: DELETE_PRODUCT_REQUEST
})

export const deleteProductSuccess = (productId) => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: productId
})

export const deleteProductFailure = (error) => ({
  type: DELETE_PRODUCT_FAILURE,
  payload: error
})

export const clearProductMessages = () => ({
  type: CLEAR_PRODUCT_MESSAGES
})

// Thunk Actions
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch(createProductRequest())
    
    const response = await api.post('/products', productData)
    
    dispatch(createProductSuccess(response.data.product))
    toast.success('Product created successfully!')
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to create product'
    dispatch(createProductFailure(errorMessage))
    toast.error(errorMessage)
  }
}

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(readProductsRequest())
    
    const response = await api.get('/products')
    
    dispatch(readProductsSuccess(response.data.products))
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch products'
    dispatch(readProductsFailure(errorMessage))
    toast.error(errorMessage)
  }
}

export const fetchMyProducts = () => async (dispatch) => {
  try {
    dispatch(readProductsRequest())
    
    const response = await api.get('/products/my')
    
    dispatch(readProductsSuccess(response.data.products))
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch your products'
    dispatch(readProductsFailure(errorMessage))
    toast.error(errorMessage)
  }
}

export const updateProduct = (productId, updatedData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest())
    
    const response = await api.put(`/products/${productId}`, updatedData)
    
    dispatch(updateProductSuccess(response.data.product))
    toast.success('Product updated successfully!')
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update product'
    dispatch(updateProductFailure(errorMessage))
    toast.error(errorMessage)
  }
}

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest())
    
    await api.delete(`/products/${productId}`)
    
    dispatch(deleteProductSuccess(productId))
    toast.success('Product deleted successfully!')
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete product'
    dispatch(deleteProductFailure(errorMessage))
    toast.error(errorMessage)
  }
}

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
} 