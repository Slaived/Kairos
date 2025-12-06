import React from 'react'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'
import { TbBrandMeta } from 'react-icons/tb'
import {FiPhoneCall} from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='border-t pt-12'>
            <div className='container mx-auto grid cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Boletín informativo</h3>
                    <p className='text-gray-500 mb-4'>
                        Sé el primero en enterarte de nuevos productos,
                        eventos exclusivos y ofertas en línea.
                    </p>
                    <p className='font-medium text-sm text-gray-600 mb-6'>Registrate y recibe 10% de descuento en tu primera compra.</p>

                    {/* Formulario de boletin */}
                    <form className='flex'>
                        <input
                            type="email"
                            placeholder='Introduce tu correo'
                            className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md
                            focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
                            required
                        />
                        <button type='submit' className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800
                        transition-all'
                        >
                            Suscríbete
                        </button>
                    </form>
                </div>

                {/* Links de tienda */}
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Tienda</h3>
                    <ul className='space-y-2 text-gray-500 transition-colors'>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Ropa Superior de Hombre
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Ropa Superior de Mujer
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Ropa Inferior de Hombre
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Ropa Inferior de Mujer
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* Links de soporte */}
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Soporte</h3>
                    <ul className='space-y-2 text-gray-500 transition-colors'>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Contáctanos
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Sobre Nosostros
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className='hover:text-gray-500 transition-colors'>
                                Características
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* Siguenos */}
                <div>
                    <h3 className='text-lg text-gray-800 mb-4'>Siguenos</h3>
                    <div className='flex items-center space-x-4 mb-6'>
                        <a
                            href="https://www.facebook.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-300'
                        >
                            <TbBrandMeta className='h-5 w-5'/>
                        </a>
                        <a
                            href="https://www.facebook.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-300'
                        >
                            <IoLogoInstagram className='h-5 w-5'/>
                        </a>
                        <a
                            href="https://www.facebook.com"
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-gray-300'
                        >
                            <RiTwitterXLine className='h-4 w-4'/>
                        </a>
                    </div>
                    <p className='text-gray-500'>Llamanos</p>
                    <p>
                        <FiPhoneCall className='inline-block mr-2'/>
                        478-192-1538
                    </p>
                </div>
            </div>
            {/* Boton Footer */}
            <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6'>
                <p className='text-gray-500 tracking-tighter text-center'>© 2025, NextGen Fashion. Todos los derechos</p>
            </div>
        </footer>
    )
}

export default Footer