import { Card } from 'react-bootstrap'

function Home() {
  return (
    <div style={{ width: '100%' }}>
      <h1 className="text-center mb-4">Welcome to Product Management App</h1>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Manage Your Products</Card.Title>
          <Card.Text>
            This is a comprehensive product management application.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Home 