export default function Footer() 
{
    return (
        <footer className="bg-lime-600 shadow-md text-gray-900 mt-16 py-6 text-center text-sm">
            <p>@ {new Date().getFullYear()} CarShop. Усі права захищені</p>
            <p className="mt-1">
                Зв'язок: <a href="mailto:Vadi-Avto@ukr.net" className="text-gray-900 hover:text-gray-700">Vadi-Avto@ukr.net</a> | Тел: <a href="tel:+380961365299" className="text-gray-900 hover:text-gray-700">+38 096 136 5299</a>
            </p>
        </footer>
    );
}