export default function Footer() 
{
    return (
        <footer className="bg-white border-t mt-16 py-6 text-center text-sm text-gray-500">
            <p>@ {new Date().getFullYear()} CarShop. Усі права захищені</p>
            <p className="mt-1">
                Зв'язок: <a href="mailto:Vadi-Avto@ukr.net" className="text-blue-600 hover:underline">Vadi-Avto@ukr.net</a> | Тел: <a href="tel:+380961365299" className="text-blue-600 hover:underline">+38 096 136 5299</a>
            </p>
        </footer>
    );
}