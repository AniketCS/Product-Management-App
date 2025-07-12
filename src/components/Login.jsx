import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Form as BootstrapForm, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Validation Schema
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store token and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to products page
      navigate('/products')

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <Card>
        <Card.Header>
          <h2 className="text-center mb-0">Login</h2>
        </Card.Header>
        <Card.Body>
          {/* Error Messages */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form>
                {/* Email Field */}
                <div className="mb-3">
                  <BootstrapForm.Label htmlFor="email">Email *</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="form-control"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger mt-1" />
                </div>

                {/* Password Field */}
                <div className="mb-3">
                  <BootstrapForm.Label htmlFor="password">Password *</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="form-control"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger mt-1" />
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || !isValid || !dirty || loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0"
                      onClick={() => navigate('/register')}
                    >
                      Register here
                    </Button>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Login 