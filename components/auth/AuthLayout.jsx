'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Facebook, Globe } from 'lucide-react'
import { logoVariants, containerVariants, itemVariants } from '@/lib/animations'
import Logo from '../ui/logo'
import Image from 'next/image'

export default function AuthLayout ({
  children,
  title,
  welcomeHeading,
  welcomeSubheading,
  sidePosition = 'left'
}) {

  var loginBgUrl = '/images/login-bg.jpg';

  return (
    <div className='flex flex-col md:flex-row h-screen w-full'>
      {/* Background/Branding Side */}
      <motion.div
        className={`relative md:w-3/4 flex flex-col justify-center items-start p-8 text-white ${
          sidePosition === 'right' ? 'md:order-2' : 'md:order-1'
        }`}
        style={{
          backgroundColor: 'transparent'
        }}
        initial={{ opacity: 0, x: sidePosition === 'left' ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Image using next/image */}
        <div className='absolute inset-0 -z-10'>
          <Image
            src={loginBgUrl}
            alt='Background'
            className='w-full h-full object-cover opacity-80'
            style={{ objectPosition: 'center' }}
            draggable={false}
            width={100}
            height={100}
            priority
          />
        </div>

        <div className='absolute mb-3 top-8 left-8'>
          <motion.div
            variants={logoVariants}
            initial='hidden'
            animate='visible'
          >
            <Logo height={200} width={200} />
          </motion.div>
        </div>

        <motion.div
          className='max-w-md mt-12 text-start left-8 max-sm:flex max-sm:flex-col max-sm:items-center max-sm:text-center max-sm:mt-20 max-sm:left-0 max-sm:w-full'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.h1
            className='text-[40px] leading-[40px] font-bold mb-9 font-istok md:text-[100px] md:leading-[100px]'
            variants={itemVariants}
          >
            {welcomeHeading}
          </motion.h1>
          <motion.p
            className='text-sm mt-12 leading-relaxed w-full max-sm:text-base max-sm:leading-normal'
            variants={itemVariants}
          >
            {welcomeSubheading}
          </motion.p>
        </motion.div>
      </motion.div>
      <motion.div
        className={`md:w-1/2 flex justify-center items-center p-8 bg-white ${
          sidePosition === 'right' ? 'md:order-1' : 'md:order-2'
        }`}
        initial={{ opacity: 0, x: sidePosition === 'left' ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className='w-full max-w-md'>
          <motion.h2
            className='text-7xl font-bold text-blue-500 mb-5 font-istok  '
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {title}
          </motion.h2>
          {children}

          <div className=' flex mt-6 items-center justify-start space-x-2  text-sm text-gray-500'>
            <div className='text-blue-500'>Stay Updated</div>
            <div className='flex  space-x-4'>
              <Link
                href='#'
                className='text-blue-500 hover:text-blue-700 transition-colors'
              >
                <Facebook size={20} />
              </Link>
              <Link
                href='#'
                className='text-blue-500 hover:text-blue-700 transition-colors'
              >
                <Globe size={20} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
