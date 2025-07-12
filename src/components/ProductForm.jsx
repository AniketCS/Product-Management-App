import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Form as BootstrapForm, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { createProduct, updateProduct, clearProductMessages } from '../actions/productActions'

// Validation Schema
const ProductSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  image: Yup.string()
    .url('Must be a valid URL')
    .required('Image URL is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Description is required'),
  price: Yup.number()
    .positive('Price must be a positive number')
    .required('Price is required')
    .typeError('Price must be a number')
})

const ProductForm = ({ product = null, onSuccess = null }) => {
  const dispatch = useDispatch()
  const { createLoading, updateLoading, success, error } = useSelector(state => state.product)
  const [initialValues, setInitialValues] = useState({
    title: '',
    image: '',
    description: '',
    price: ''
  })

  const isEditing = !!product

  useEffect(() => {
    if (product) {
      setInitialValues({
        title: product.title || '',
        image: product.image || '',
        description: product.description || '',
        price: product.price || ''
      })
    }
  }, [product])

  useEffect(() => {
    // Clear messages after 3 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearProductMessages())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success, error, dispatch])

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const productData = {
        title: values.title,
        image: values.image,
        description: values.description,
        price: parseFloat(values.price)
      }

      if (isEditing) {
        await dispatch(updateProduct(product._id, productData))
      } else {
        await dispatch(createProduct(productData))
      }

      if (onSuccess) {
        onSuccess()
      }

      if (!isEditing) {
        resetForm()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="mb-4">
      <Card.Header>
        <h3 className="mb-0">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
      </Card.Header>
      <Card.Body>
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

        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form>
              {/* Title Field */}
              <div className="mb-3">
                <BootstrapForm.Label htmlFor="title">Title *</BootstrapForm.Label>
                <Field
                  as={BootstrapForm.Control}
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter product title"
                  className="form-control"
                />
                <ErrorMessage name="title" component="div" className="text-danger mt-1" />
              </div>

              {/* Image URL Field */}
              <div className="mb-3">
                <BootstrapForm.Label htmlFor="image">Image URL *</BootstrapForm.Label>
                <Field
                  as={BootstrapForm.Control}
                  type="url"
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  className="form-control"
                />
                <ErrorMessage name="image" component="div" className="text-danger mt-1" />
              </div>

              {/* Description Field */}
              <div className="mb-3">
                <BootstrapForm.Label htmlFor="description">Description *</BootstrapForm.Label>
                <Field
                  as="textarea"
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Enter product description"
                />
                <ErrorMessage name="description" component="div" className="text-danger mt-1" />
              </div>

              {/* Price Field */}
              <div className="mb-3">
                <BootstrapForm.Label htmlFor="price">Price *</BootstrapForm.Label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <Field
                    as={BootstrapForm.Control}
                    type="number"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="form-control"
                  />
                </div>
                <ErrorMessage name="price" component="div" className="text-danger mt-1" />
              </div>

              {/* Submit Button */}
              <div className="d-flex gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="flex-grow-1"
                >
                  {isSubmitting || createLoading || updateLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    isEditing ? 'Update Product' : 'Create Product'
                  )}
                </Button>
                
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => onSuccess && onSuccess()}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}

export default ProductForm 