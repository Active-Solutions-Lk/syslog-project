'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { formVariants, inputVariants } from '@/lib/animations'
import { signupUser } from '@/lib/actions/user';

const formSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    company: z
      .string()
      .min(2, { message: 'Company name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    activationKey: z.string().regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, {
      message: 'Activation key must be in the format XXXX-XXXX-XXXX'
    }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }), // Updated to match backend validation
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export default function SignupForm () {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Added loading state

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      activationKey: '',
      password: '',
      confirmPassword: ''
    }
  })



  // State to hold server error message
  const [serverError, setServerError] = useState('')

async function onSubmit(values) {
  setIsLoading(true);
  setServerError(""); // Reset error before submit
  try {
    const { confirmPassword, ...payload } = values; // Exclude confirmPassword
    const result = await signupUser(payload);

    if (!result.success) {
      setServerError(result.error);
      toast({
        title: "Sign-up Failed",
        description: result.error,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    toast({
      title: "Sign-up Successful",
      description: result.message,
      variant: "success",
      duration: 3000,
    });
    router.push("/login");
  } catch (error) {
    console.error("Sign-up error:", error);
    setServerError("Unexpected error occurred. Please try again.");
    toast({
      title: "Error",
      description: "Unexpected error occurred. Please try again.",
      variant: "destructive",
      duration: 5000,
    });
  } finally {
    setIsLoading(false);
  }
}

  return (
    <motion.div
      variants={formVariants}
      initial='hidden'
      animate='visible'
      className='w-full h-[calc(100vh-200px)] overflow-y-auto'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>
          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='border-2 border-blue-500 rounded-md p-1 custom-border-radius'>
                  <FormLabel className='text-xs ms-2 text-gray-700'>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Your name'
                      className='h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <style>
              {`
                .no-border,
                .no-border:focus,
                .no-border:focus-visible,
                .no-border:active {
                  border: none !important;
                  outline: none !important;
                  box-shadow: none !important;
                  ring: none !important;
                }
                .no-border:focus,
                .no-border:focus-visible {
                  background-color: #f0f9ff;
                }
                .custom-border-radius {
                  border-radius: 5px !important;
                  transition: border-width 0.2s;
                }
                .custom-border-radius:focus-within {
                  border-left-width: 15px !important;
                  border-top-width: 2px !important;
                  border-right-width: 2px !important;
                  border-bottom-width: 2px !important;
                  border-color: #0B97F9 !important;
                }
              `}
            </style>
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem className='border-2 border-blue-500 rounded-md p-1 custom-border-radius'>
                  <FormLabel className='text-xs ms-2 text-gray-700'>
                    Company
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Company name'
                      className='h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='border-2 border-blue-500 rounded-md p-1 custom-border-radius'>
                  <FormLabel className='text-xs ms-2 text-gray-700'>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='your@email.com'
                      className='h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name='activationKey'
              render={({ field }) => (
                <FormItem className='border-2 border-blue-500 rounded-md p-1 custom-border-radius'>
                  <FormLabel className='text-xs ms-2 text-gray-700'>
                    Activation Key
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='1A2B-3C4D-5E6F'
                      className='h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='border-2 border-blue-500 rounded-md p-1 custom-border-radius'>
                  <FormLabel className='text-xs ms-2 text-gray-700'>
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••••••'
                        className='h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm'
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='border-2 border-blue-500 rounded-md p-1 custom-border-radius'>
                  <FormLabel className='text-xs ms-2 text-gray-700'>
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='••••••••••••'
                        className='h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm'
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type='button'
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Server error message */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs mb-2'
              role='alert'
            >
              {serverError}
            </motion.div>
          )}

          <div className='flex space-x-4 mt-4'>
            <motion.div variants={inputVariants} className='w-1/3'>
              <Link href='/login'>
                <Button
                  type='button'
                  variant='outline'
                  className='w-full h-8 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm'
                  disabled={isLoading}
                >
                  Login
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={inputVariants} className='w-2/4'>
              <Button
                type='submit'
                className='w-full h-8 bg-blue-500 hover:bg-blue-600 text-sm'
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
