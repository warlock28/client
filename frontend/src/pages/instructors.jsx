import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Instructors = () => {

  const { speciality } = useParams()

  const [filterInstructor, setFilterInstructor] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { instructors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterInstructor(instructors.filter(instructor => instructor.speciality === speciality))
    } else {
      setFilterInstructor(instructors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [instructors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the legal education specialists.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'Corporate Law' ? navigate('/instructors') : navigate('/instructors/Corporate Law')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Corporate Law' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Corporate Law</p>
          <p onClick={() => speciality === 'Criminal Law' ? navigate('/instructors') : navigate('/instructors/Criminal Law')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Criminal Law' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Criminal Law</p>
          <p onClick={() => speciality === 'Family Law' ? navigate('/instructors') : navigate('/instructors/Family Law')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Family Law' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Family Law</p>
          <p onClick={() => speciality === 'Intellectual Property' ? navigate('/instructors') : navigate('/instructors/Intellectual Property')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Intellectual Property' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Intellectual Property</p>
          <p onClick={() => speciality === 'Employment Law' ? navigate('/instructors') : navigate('/instructors/Employment Law')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Employment Law' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Employment Law</p>
          <p onClick={() => speciality === 'Environmental Law' ? navigate('/instructors') : navigate('/instructors/Environmental Law')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Environmental Law' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Environmental Law</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterInstructor.map((item, index) => (
            <div onClick={() => { navigate(`/consultation/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
              <img className='bg-[#EAEFFF]' src={item.image} alt="" />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                  <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                </div>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Instructors
