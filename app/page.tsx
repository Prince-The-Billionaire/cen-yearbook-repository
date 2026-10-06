import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import WhoWeAre from '@/components/Section1'
import TheYearsWeRemember from '@/components/Section2'
import ThePeople from '@/components/Section3'
import LetsGetThatBread from '@/components/Section4'
import MemoriesPreview from '@/components/MemoriesPreview'
import React from 'react'

// Re-read the Cloudinary memories list at most every 10 minutes.
export const revalidate = 600

const page = () => {
  return (
    <div className="landing-root bg-black">
      <Navbar/>
      <Hero/>
      <WhoWeAre/>
      <TheYearsWeRemember/>
      <ThePeople/>
      <MemoriesPreview/>
      <LetsGetThatBread/>
    </div>
  )
}

export default page
