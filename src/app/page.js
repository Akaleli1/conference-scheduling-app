import ConferenceList from "../components/ConferenceList";
import Sidebar from "../components/Sidebar";

export default function Page() {
  return (
    <div className="bg-background grid grid-cols-5 h-screen">
      <Sidebar/>
      <div className="col-span-4 grid grid-rows-7">
        <div className="row-span-2 pl-7 pt-3">
          <h1 className="text-header text-2xl mb-2 font-bold">Discover Conferences</h1>
          <p className="text-text mb-10">Find and join upcoming conferences</p>
          <button className="bg-primary text-white py-2 px-80 rounded-full">+ New Conference</button>
        </div>
        <div className="row-span-5 grid grid-rows-8">
          <div className="row-span-1">
            <button className="bg-primary text-white py-2 px-4 rounded-full mt-2 ml-7">
              Sort by Name with Quicksort
            </button>
          </div>
          <div className="row-span-7">
            <ConferenceList></ConferenceList>
          </div>
        </div>
      </div>
    </div>
  )
}