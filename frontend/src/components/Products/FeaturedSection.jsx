import React from 'react'
import { HiArrowPathRoundedSquare, HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi2'

const FeaturedSection = () => {
  return (
    <section className='py-16 px-4 bg-white'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            {/* Característica 1*/}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiShoppingBag className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>ENVÍO NACIONAL GRATIS</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    En todos los pedidos superiores a $500.00
                </p>
            </div>

            {/* Característica 2*/}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiArrowPathRoundedSquare className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>DEVOLUCIÓN DE 45 DÍAS</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    Garantía de devolución de dinero
                </p>
            </div>

            {/* Característica 3*/}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiOutlineCreditCard className='text-xl'/>
                </div>
                <h4 className='tracking-tighter mb-2'>PAGO SEGURO</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    Proceso de pago 100% seguro
                </p>
            </div>
        </div>
    </section>
  )
}

export default FeaturedSection