import React from 'react'

import heroImg from "../../assets/hero.webp"
import { Link } from 'react-router-dom'
const Hero = () => {
    return (
        <section className='relative'>
            <img
                src={heroImg}
                alt="Kairos"
                className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover'
            />
            <div className='absolute inset-0 bg-black flex items-center justify-center'
                 style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <div className='text-center text-white p-6'>
                    <h1 className='text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4'>
                        Vacaciones <br/> Listas!!!
                    </h1>
                    <p className='text-sm tracking-tighter md:text-lg mb-6'>
                        Explora nuestros outfits listos para vacaciones con envío rápido nacional.
                    </p>
                    <Link to="#" className='bg-white text-gray-950 px-6 py-2 rounde-sm text-lg'
                    >
                        Comprar Ahora                    
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Hero