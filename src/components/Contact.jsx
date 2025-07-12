import { Form, Button, Card } from 'react-bootstrap'

function Contact() {
  return (
    <div style={{ width: '100%' }}>
      <h1 className="text-center mb-4">Contact Us</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem',
        width: '100%'
      }}>
        <Card>
          <Card.Body>
            <Card.Title>Get in Touch</Card.Title>
            <Card.Text>
              Have questions about our products? We'd love to hear from you.
              Send us a message and we'll respond as soon as possible.
            </Card.Text>
            <div className="mt-3">
              <p><strong>Email:</strong> info@productmanagement.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Product Street, Management City, MC 12345</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Contact 