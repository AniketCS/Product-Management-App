import { Card, Badge } from 'react-bootstrap'

function Products() {
  const products = [
    { id: 1, name: 'Product 1', description: 'This is product 1 description', price: '$99.99', category: 'Electronics' },
    { id: 2, name: 'Product 2', description: 'This is product 2 description', price: '$149.99', category: 'Clothing' },
    { id: 3, name: 'Product 3', description: 'This is product 3 description', price: '$79.99', category: 'Home' },
    { id: 4, name: 'Product 4', description: 'This is product 4 description', price: '$199.99', category: 'Electronics' }
  ]

  return (
    <div style={{ width: '100%' }}>
      <h1 className="text-center mb-4">Our Products</h1>
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
              <div className="d-flex justify-content-between align-items-center">
                <Badge bg="primary">{product.category}</Badge>
                <span className="fw-bold">{product.price}</span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Products 