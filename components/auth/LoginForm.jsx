'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { formVariants, inputVariants } from '@/lib/animations';
import { loginUser } from '@/lib/actions/user';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await loginUser(values);

      if (!response.success) {
        setErrorMessage(response.error);
        toast({
          title: 'Login Failed',
          description: response.error,
          variant: 'destructive',
          duration: 5000,
        });
        return;
      }

      // Store session token
      if (values.rememberMe) {
        localStorage.setItem('sessionToken', response.data.sessionToken);
        document.cookie = `sessionToken=${response.data.sessionToken}; path=/; max-age=2592000`; // 30 days
      } else {
        sessionStorage.setItem('sessionToken', response.data.sessionToken);
        document.cookie = `sessionToken=${response.data.sessionToken}; path=/`; // Session cookie
      }

      toast({
        title: 'Login Successful',
        description: response.message || 'Welcome back to Active Solutions!',
        variant: 'success',
        duration: 3000,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = 'Network error. Please check your connection and try again.';
      setErrorMessage(errorMsg);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="border-[2px] rounded-[5px] border-[#0B97F9] custom-border-radius">
                  <FormLabel className="text-gray-700 ms-2">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      className="h-12 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
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
              name="password"
              render={({ field }) => (
                <FormItem className="border-[2px] rounded-[5px] border-[#0B97F9] custom-border-radius">
                  <FormLabel className="text-gray-700 ms-2">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        className="h-12 bg-transparent border-none focus:border-none focus:ring-0 outline-none pr-10 no-border"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            variants={inputVariants}
          >
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex h-5 items-center justify-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-5 w-5 text-blue-500 border-2 border-blue-500 rounded focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal pb-2 text-gray-700 cursor-pointer leading-none flex items-center">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot Password?
            </Link>
          </motion.div>

          {errorMessage && (
            <motion.div
              variants={inputVariants}
              className="text-sm text-red-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errorMessage}
            </motion.div>
          )}

          <div className="flex items-start gap-2 w-full">
            <motion.div variants={inputVariants} className="pt-2">
              <Button
                type="submit"
                className="w-[135px] h-[45px] bg-blue-500 hover:bg-blue-600 text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Login'}
              </Button>
            </motion.div>
            <motion.div variants={inputVariants} className="pt-2">
              <Link href="/signup">
                <Button
                  type="button"
                  className="w-[160px] h-[45px] bg-transparent border-2 text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white text-lg"
                  disabled={isLoading}
                >
                  Signup
                </Button>
              </Link>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}