import { Phone } from "lucide-react";
import { Mail } from 'lucide-react';
import { Clock } from 'lucide-react';

export default function Contacts() 
{
    return (
        <section className="text-center py-12">
            <div className="w-200 h-150 bg-gray-200">
                <h1 className="text-2xl text-gray-900 font-semibold pt-6">
                    Зворотній зв'язок
                </h1>
                <div className="flex justify-center items-center space-x-2 text-gray-900 pt-4">
                    <Phone className="w-7 h-7" />
                    <p className="text-lg">+38 (063) 123 45 67</p>
                </div>
                <div className="flex justify-center items center space-x-2 text-gray-900 pt-4">
                    <Mail className="w-7 h-7" />
                    <p className="text-lg"><a href="mailto:Vadi-Avto@ukr.net">Vadi-Avto@ukr.net</a></p>
                </div>
                <div className="flex justify-center items center space-x-2 text-gray-900 pt-4 mt-3">
                    <Clock className="w-7 h-7" />
                    <p className="text-lg">Робочі години</p>
                </div>
                <div className="flex justify-center items center space-x-2 text-gray-900 pt-4 mt-3">
                    <p className="text-base font-semibold">Понеділок - П'ятниця </p>
                </div>
            </div>
        </section>
    )
}