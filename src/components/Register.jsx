import { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Form as BootstrapForm, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // API Base URL
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`

  // Validation Schema
  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Must be a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess('Registration successful! Please login.')
      resetForm()

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    // Clear messages after 5 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <Card>
        <Card.Header>
          <h2 className="text-center mb-0">Register</h2>
        </Card.Header>
        <Card.Body>
          {/* Success/Error Messages */}
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form>
                {/* Name Field */}
                <div className="mb-3">
                  <BootstrapForm.Label htmlFor="name">Name *</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    className="form-control"
                  />
                  <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                </div>

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

                {/* Confirm Password Field */}
                <div className="mb-3">
                  <BootstrapForm.Label htmlFor="confirmPassword">Confirm Password *</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="form-control"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
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
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => navigate('/login')}
                    >
                      Login here
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

export default Register 