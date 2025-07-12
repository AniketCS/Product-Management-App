import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Home() {
  const testBackendConnection = async () => {
    try {
      const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`
      console.log('Testing backend connection to:', API_BASE_URL)
      
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`)
      const data = await response.json()
      
      console.log('Backend response:', data)
      alert(`Backend is accessible! Response: ${JSON.stringify(data)}`)
    } catch (error) {
      console.error('Backend connection error:', error)
      alert(`Backend connection failed: ${error.message}`)
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Header>
              <h1>Welcome to Product Management App</h1>
            </Card.Header>
            <Card.Body>
              <p className="lead">
                A comprehensive product management system with user authentication and CRUD operations.
              </p>
              
              <Button 
                variant="outline-primary" 
                onClick={testBackendConnection}
                className="mb-3"
              >
                Test Backend Connection
              </Button>
              
              <div className="mt-4">
                <h4>Features:</h4>
                <ul className="list-unstyled">
                  <li>✅ User Registration & Authentication</li>
                  <li>✅ Product CRUD Operations</li>
                  <li>✅ Pagination & Filtering</li>
                  <li>✅ Responsive Bootstrap UI</li>
                  <li>✅ Redux State Management</li>
                  <li>✅ Form Validation</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home 