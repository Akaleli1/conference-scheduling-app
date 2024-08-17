'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'


function SpeakerList({ data }) {
  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.map((data, key) => (
        <li key={key} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{data.name}</p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm leading-6 text-gray-900">{data.expertise}</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Availibility: {
              data.availability ? data.availability.map((avail) => (
                <span> {avail}</span>
              )) :
              'Not available'
              }
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function SessionList({ data }) {
  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.map((data, key) => (
        <li key={key} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{data.name}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function TimeSlotList({ data }) {
  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.map((data, key) => (
        <li key={key} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{data.start_time} - {data.end_time}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function RoomList({ data }) {
  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.map((data, key) => (
        <li key={key} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{data.name}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function ScheduledConferenceList({ data }) {
  return (
    <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
      {data.map((data, key) => (
        <li key={key} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{data.room}</p>
              <p className="text-sm leading-6 text-gray-900">{data.session}</p>
            </div>
          </div>
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{data.speaker}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{data.time_slot}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function ConferenceList({ listType}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    switch (listType) {
      case 'speakers':
        axios.get('http://127.0.0.1:5000/speakers').then((response) => {
          setData(response.data)
        })
        break
      case 'sessions':
        axios.get('http://127.0.0.1:5000/sessions').then((response) => {
          setData(response.data)
        })
        break
      case 'time slots':
        axios.get('http://127.0.0.1:5000/time-slots').then((response) => {
          setData(response.data)
        })
        break
      case 'rooms':
        axios.get('http://127.0.0.1:5000/rooms').then((response) => {
          setData(response.data)
        })
        break
      case 'schedule':
        axios.get('http://127.0.0.1:5000/schedule-conference').then((response) => {
          setData(response.data)
        })
        break
    }
    setLoading(false)
  }, [listType])

  switch (listType) {
    case 'sessions':
      return <SessionList data={data}/>
    case 'speakers':
      return <SpeakerList data={data}/>
    case 'time slots':
      return <TimeSlotList data={data}/>
    case 'rooms':
      return <RoomList data={data}/>
    case 'schedule':
      return <ScheduledConferenceList data={data}/>
    default:
      return <></>
  }

}
