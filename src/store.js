import { createStore, applyMiddleware, combineReducers } from 'redux'
import { thunk } from 'redux-thunk'
import productReducer from './reducers/productReducer'

// Combine reducers
const rootReducer = combineReducers({
  product: productReducer
})

// Create store with Thunk middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

export default store 