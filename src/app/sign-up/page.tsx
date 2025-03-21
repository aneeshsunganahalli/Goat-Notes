import AuthForm from '@/components/AuthForm'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function SignUpPage() {
  return (
    <div className='flex flex-1 flex-col mt-20 items-center'>
      <Card className='w-full max-w-md'>
        <CardHeader className='mb-4'>
          <CardTitle className='text-center text-3xl'>Sign Up</CardTitle>
        </CardHeader>

        <AuthForm type="signUp" />
      </Card>
    </div>
  )
}

export default SignUpPage