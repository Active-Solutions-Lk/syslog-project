
import React from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

export default function GreetingSection({ itemVariants }) {
  const greetingRef = React.useRef(null)
  const inViewGreeting = useInView(greetingRef, { once: true })

  return (
    <motion.div
      ref={greetingRef}
      initial='hidden'
      animate={inViewGreeting ? 'visible' : 'hidden'}
      variants={itemVariants}
      className='mb-3 rounded-lg h-25 bg-specialbg bg-opacity-50 p-2 relative'
    >
      <div className='flex items-center justify-between ps-4'>
        <div>
          <h1 className='text-xl font-bold text-gray-800'>Hi, Shaheer</h1>
          <p className='text-sm text-gray-600 mt-1'>
            Ready to see what's happening on your devices?
          </p>
        </div>
        <div className='absolute top-0 right-0 justify-start -translate-x-1/4 -translate-y-1/4'>
          <Image
            src='/images/dashboardpc.png'
            alt='Dashboard'
            width={120}
            height={120}
            className='h-20 w-20 md:h-32 md:w-32 rounded-lg object-cover justify-start'
          />
        </div>
      </div>
    </motion.div>
  )
}