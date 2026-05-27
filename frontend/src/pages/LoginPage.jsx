import React from 'react'
import AuthLayout from '../components/auth/AuthLayout'
import Login from '../components/auth/Login'

const LoginPage = ({ onLogin }) => {
  return (
    <AuthLayout>
        <Login onLogin={onLogin} />
    </AuthLayout>
  )
}

export default LoginPage
