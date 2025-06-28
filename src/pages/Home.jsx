import React from 'react'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import StatsSection from '../components/home/Stats'
import Words from '../components/home/Words'
import Footer from '../components/home/Footer'

export default function Home() {
  return (
    <main className='w-full bg-white dark:bg-[#0a0a0a] transition-colors duration-300'>
      <Hero/>

      <Words/>
      <StatsSection/>

      <Features/>
      <Footer/>
    </main>
  )
}
