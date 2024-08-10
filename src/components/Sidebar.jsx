const navlist = [
  {
    id: 1,
    key: 'home',
    name: 'Home',
    iconUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    key: 'search',
    name: 'Search',
    iconUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export default function Sidebar() {
  return (
    <div className="grid grid-rows-5">
      <div className="row-span-4">
        <ul role="list" className="pl-7 pr-7 divide-y divide-gray-100">
          {navlist.map((item) => (
            <li key={item.id} className="flex justify-between gap-x-6 py-5">{item.name}</li>
          ))}
        </ul>
      </div>
      <div className="row-span-1">
        <button className="bg-primary text-white py-2 px-4 rounded-full mt-2 ml-3">
          Sign in
        </button>
      </div>
    </div>
  )
}
