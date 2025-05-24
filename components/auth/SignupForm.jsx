"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formVariants, inputVariants } from "@/lib/animations";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values) {
    console.log(values);
    
    toast({
      title: "Account created!",
      description: "Welcome to Active Solutions!",
    });

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-[calc(100vh-200px)] overflow-y-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="border-2 border-blue-500 rounded-md p-1 custom-border-radius">
                  <FormLabel className="text-xs ms-2 text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      className="h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
              name="company"
              render={({ field }) => (
                <FormItem className="border-2 border-blue-500 rounded-md p-1 custom-border-radius">
                  <FormLabel className="text-xs ms-2 text-gray-700">Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company name"
                      className="h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="border-2 border-blue-500 rounded-md p-1 custom-border-radius">
                  <FormLabel className="text-xs ms-2 text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      className="h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="border-2 border-blue-500 rounded-md p-1 custom-border-radius">
                  <FormLabel className="text-xs ms-2 text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={inputVariants}>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="border-2 border-blue-500 rounded-md p-1 custom-border-radius">
                  <FormLabel className="text-xs ms-2 text-gray-700">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="h-5 bg-transparent border-none focus:border-none focus:outline-none focus:ring-0 outline-none ring-0 shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none no-border text-sm"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </motion.div>

          <div className="flex space-x-4 mt-4">
            <motion.div variants={inputVariants} className="w-1/3">
              <Link href="/login">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-8 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm"
                >
                  Login
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={inputVariants} className="w-2/4">
              <Button
                type="submit"
                className="w-full h-8 bg-blue-500 hover:bg-blue-600 text-sm"
              >
                Sign Up
              </Button>
            </motion.div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}