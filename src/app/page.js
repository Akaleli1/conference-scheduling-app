'use client'

import ConferenceList from "../components/ConferenceList";
import Link from 'next/link'
import { useState } from 'react'

export default function Page() {
  const [listType, setListType] = useState('speakers')

  const handleListType = (type) => {
    setListType(type)
  }
  return (
    <>
      <div className="col-span-4 grid grid-rows-7 w-screen">
        <div className="row-span-1 pl-7 pt-3">
          <h1 className="text-header text-2xl mb-2 font-bold">Discover Conferences</h1>
          {/* <p className="text-text mb-10">Find and join upcoming conferences</p> */}
          {/* <div className="grid grid-cols-2 mr-3">
            <button className="bg-primary text-white py-2 mt-2 rounded-full"><Link href="/speakers">+ New Speakers</Link></button>
            <button className="bg-primary text-white py-2 mt-2 rounded-full">+ New Sessions</button>
            <button className="bg-primary text-white py-2 mt-2 rounded-full">+ New Time Slots</button>
            <button className="bg-primary text-white py-2 mt-2 rounded-full">+ New Rooms</button>
            <button className="bg-primary text-white py-2 mt-2 rounded-full">Schedule Conferences</button> 
          </div> */}

        </div>
        <div className="row-span-5 grid grid-rows-8 mt-10">
          <div className="row-span-1">
            <button className="bg-primary text-white py-2 px-4 rounded-full mt-2 ml-7" onClick={() => handleListType('speakers')}>
              Speakers
            </button>
            <button className="bg-primary text-white py-2 px-4 rounded-full mt-2 ml-7" onClick={() => handleListType('sessions')}>
              Sessions
            </button>
            <button className="bg-primary text-white py-2 px-4 rounded-full mt-2 ml-7" onClick={() => handleListType('time slots')}>
              Time Slots
            </button>
            <button className="bg-primary text-white py-2 px-4 rounded-full mt-2 ml-7" onClick={() => handleListType('rooms')}>
              Rooms
            </button>
            <button className="bg-success text-white py-2 px-4 rounded-full mt-2 ml-7" onClick={() => handleListType('schedule')}>
              Schedule Conference
            </button>
          </div>
          <div className="row-span-1">
            <h2 className="text-header text-lg font-bold ml-7 mt-5">All {listType}</h2>
          </div>
          <div className="row-span-7">
            <ConferenceList listType={listType}></ConferenceList>
          </div>
        </div>
      </div>
    </>
  )
}