import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  interests: Yup.string().required('Please select an interest'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms'),
})

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (values) => {
    // ... existing submit logic ...
    const userData = {
      id: Date.now(),
      name: `${values.firstName} ${values.lastName}`.trim(),
      email: values.email,
      // ... rest of userData ...
    }
    login(userData)
    navigate('/')
  }

  return (
    <div className="flex items-center justify-center bg-slate-50 p-4 min-h-screen">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link to="/" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center border-b">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">Q</div>
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <p className="text-slate-500">Join our community and start earning rewards</p>
          </div>
          <div className="p-6">
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                interests: '',
                agreeToTerms: false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="text-sm">First Name</label>
                      <Field name="firstName" className="w-full border rounded p-2" />
                      <ErrorMessage name="firstName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm">Last Name</label>
                      <Field name="lastName" className="w-full border rounded p-2" />
                      <ErrorMessage name="lastName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm">Email</label>
                    <Field name="email" type="email" className="w-full border rounded p-2" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="password" className="text-sm">Password</label>
                    <Field name="password" type="password" className="w-full border rounded p-2" />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="interests" className="text-sm">Primary Interest</label>
                    <Field as="select" name="interests" className="w-full border rounded p-2">
                      <option value="" disabled>Select your main interest</option>
                      <option value="technology">Technology</option>
                      <option value="business">Business</option>
                      <option value="creative">Creative</option>
                      <option value="finance">Finance</option>
                      <option value="marketing">Marketing</option>
                      <option value="health">Health & Wellness</option>
                    </Field>
                    <ErrorMessage name="interests" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="flex items-start gap-2">
                    <Field type="checkbox" name="agreeToTerms" className="mt-1" />
                    <label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </label>
                    <ErrorMessage name="agreeToTerms" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <button type="submit" className="w-full bg-black text-white rounded p-2 hover:bg-blue-700">Create Account</button>
                </Form>
              )}
            </Formik>
            {/* ... social login and footer ... */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register