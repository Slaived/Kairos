import React from 'react'
import mensCollectionImage from "../../assets/mens-collection.webp"
import womensCollectionImage from "../../assets/womens-collection.webp"
import { Link } from 'react-router-dom'


const GenderCollectionSection = () => {
    return (
        <section className='py-16 px-4 lg:px-0'>
            <div className='container mx-auto flex flex-col md:flex-row gap-8'>
                {/* Colleción de Mujer */}
                <div className='relative flex-1'>
                    <img 
                    src={womensCollectionImage} 
                    alt='Womens Collection'
                    className='w-full h-[700px] object-cover'
                    />
                    <div className='absolute bottom-8 left-8 bg-white p-4'
                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                            Colección de Mujer
                        </h2>
                        <Link 
                            to='collections/all?gender=Women'
                            className='text-gray-900 underline'
                        >
                            Comprar Ahora
                        </Link>
                    </div>
                </div>
                {/* Colleción de Hombre */}
                <div className='relative flex-1'>
                    <img 
                    src={mensCollectionImage} 
                    alt='Mmens Collection'
                    className='w-full h-[700px] object-cover'
                    />
                    <div className='absolute bottom-8 left-8 bg-white p-4'
                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                        <h2 className='text-2xl font-bold text-gray-900 mb-3'>
                            Colección de Hombre
                        </h2>
                        <Link 
                            to='collections/all?gender=Women'
                            className='text-gray-900 underline'
                        >
                            Comprar Ahora
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GenderCollectionSection