import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import WhoWeAre from '@/components/Section1'
import TheYearsWeRemember from '@/components/Section2'
import ThePeople from '@/components/Section3'
import LetsGetThatBread from '@/components/Section4'
import MemoriesPreview from '@/components/MemoriesPreview'
import ClassTeasers from '@/components/ClassTeasers'
import { hasValue } from '@/lib/student-utils'
import { allStudents } from '@/lib/students'
import React from 'react'

// Re-read the Cloudinary memories list at most every 2 minutes (keep in sync with lib/memories.ts).
export const revalidate = 120

// Real graduates: everyone in the yearbook who has a profile photo.
const people = allStudents
  .filter((student) => hasValue(student.profilePic))
  .map((student) => ({
    id: student.slug,
    name: student.name.toUpperCase(),
    image: student.profilePic,
    href: `/student/${student.slug}`,
  }))

const page = () => {
  return (
    <div className="landing-root bg-black">
      <Navbar/>
      <Hero/>
      <WhoWeAre/>
      <TheYearsWeRemember/>
      <ThePeople people={people}/>
      <MemoriesPreview/>
      <ClassTeasers/>
      <LetsGetThatBread/>
    </div>
  )
}

export default page
