import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Home() {
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
                A comprehensive product management system.
              </p> 
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home 