import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import WhoWeAre from '@/components/Section1'
import TheYearsWeRemember from '@/components/Section2'
import ThePeople from '@/components/Section3'
import LetsGetThatBread from '@/components/Section4'
import React from 'react'

const page = () => {
  return (
    <div className="bg-black">
      <Navbar/>
      <Hero/>
      <WhoWeAre/>
      <TheYearsWeRemember/>
      <ThePeople/>
      <LetsGetThatBread/>
    </div>
  )
}

export default page
