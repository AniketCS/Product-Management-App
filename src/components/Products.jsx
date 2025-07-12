import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Badge, Button, Spinner, Alert } from 'react-bootstrap'
import { fetchProducts, deleteProduct, clearProductMessages } from '../actions/productActions'
import ProductForm from './ProductForm'

function Products() {
  const dispatch = useDispatch()
  const { products, loading, error, success, deleteLoading } = useSelector(state => state.product)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    // Clear messages after 3 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearProductMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error, dispatch])

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(productId))
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (loading) {
    return (
      <div style={{ width: '100%', textAlign: 'center', padding: '2rem' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading products...</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Our Products</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Hide Form' : 'Add New Product'}
        </Button>
      </div>
      
      {/* Product Form */}
      {showForm && (
        <ProductForm 
          product={editingProduct}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Success/Error Messages */}
      {success && (
        <Alert variant="success" dismissible onClose={() => dispatch(clearProductMessages())}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearProductMessages())}>
          {error}
        </Alert>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        width: '100%'
      }}>
        {products.map((product) => (
          <Card key={product.id}>
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>{product.description}</Card.Text>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Badge bg="primary">{product.category}</Badge>
                <span className="fw-bold">{product.price}</span>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Products 