import React from 'react'
import AuthLayout from '../components/auth/AuthLayout'
import Signup from '../components/auth/SignUp'

const SignUpPage = ({ onSignup }) => {
  return (
    <AuthLayout>
        <Signup onSignup={onSignup} />
    </AuthLayout>
  )
}

export default SignUpPage
