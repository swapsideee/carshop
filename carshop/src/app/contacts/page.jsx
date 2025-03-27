import { Phone } from 'lucide-react';


export default function Contacts () {
    return (
<section className="text-center py-12">
        <div className="w-200 h-150 bg-gray-200">
        <h1 className='text-2xl text-gray-900 font-semibold pt-6'>Зворотній зв'язок</h1>
        <div className="flex items-center space-x-2  text-gray-900">
            <span className="text-lg text-gray-900 max-w-2xl mx-auto">+38 096 136 5299</span>
            <Phone className='w-7 h-7 text-black'/>
            </div>
        </div>
      </section>

    )
}