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

const initialState = {
  products: [],
  loading: false,
  error: null,
  success: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false
}

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create Product
    case CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        createLoading: true,
        error: null,
        success: null
      }
    
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        createLoading: false,
        products: [...state.products, action.payload],
        success: 'Product created successfully!',
        error: null
      }
    
    case CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        createLoading: false,
        error: action.payload,
        success: null
      }

    // Read Products
    case READ_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      }
    
    case READ_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null
      }
    
    case READ_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    // Update Product
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        updateLoading: true,
        error: null,
        success: null
      }
    
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
        success: 'Product updated successfully!',
        error: null
      }
    
    case UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        updateLoading: false,
        error: action.payload,
        success: null
      }

    // Delete Product
    case DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        deleteLoading: true,
        error: null,
        success: null
      }
    
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        deleteLoading: false,
        products: state.products.filter(product => product.id !== action.payload),
        success: 'Product deleted successfully!',
        error: null
      }
    
    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        deleteLoading: false,
        error: action.payload,
        success: null
      }

    // Clear Messages
    case CLEAR_PRODUCT_MESSAGES:
      return {
        ...state,
        error: null,
        success: null
      }

    default:
      return state
  }
}

export default productReducer 