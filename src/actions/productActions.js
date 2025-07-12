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
    
    // Simulate API call - replace with actual API endpoint
    const newProduct = {
      id: Date.now(), // Generate unique ID
      ...productData,
      createdAt: new Date().toISOString()
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    dispatch(createProductSuccess(newProduct))
  } catch (error) {
    dispatch(createProductFailure(error.message))
  }
}

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(readProductsRequest())
    
    // Simulate API call - replace with actual API endpoint
    const products = [
      { id: 1, name: 'Product 1', description: 'This is product 1 description', price: '$99.99', category: 'Electronics' },
      { id: 2, name: 'Product 2', description: 'This is product 2 description', price: '$149.99', category: 'Clothing' },
      { id: 3, name: 'Product 3', description: 'This is product 3 description', price: '$79.99', category: 'Home' },
      { id: 4, name: 'Product 4', description: 'This is product 4 description', price: '$199.99', category: 'Electronics' }
    ]
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    dispatch(readProductsSuccess(products))
  } catch (error) {
    dispatch(readProductsFailure(error.message))
  }
}

export const updateProduct = (productId, updatedData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest())
    
    // Simulate API call - replace with actual API endpoint
    const updatedProduct = {
      id: productId,
      ...updatedData,
      updatedAt: new Date().toISOString()
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    dispatch(updateProductSuccess(updatedProduct))
  } catch (error) {
    dispatch(updateProductFailure(error.message))
  }
}

export const deleteProduct = (productId) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest())
    
    // Simulate API call - replace with actual API endpoint
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    dispatch(deleteProductSuccess(productId))
  } catch (error) {
    dispatch(deleteProductFailure(error.message))
  }
} 