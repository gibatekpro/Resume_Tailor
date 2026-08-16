import React from "react";

const people = [
    {

        name: 'Calvin Hawkins',
        email: 'calvin.hawkins@example.com',
        image:
            'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Kristen Ramos',
        email: 'kristen.ramos@example.com',
        image:
            'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Ted Fox',
        email: 'ted.fox@example.com',
        image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
]

export const Example :React.FC = () => {
    return (
        <div>

            <ul className="divide-y divide-gray-200">
                {people.map((person) => (
                    <li key={person.email} className="py-4 flex">
                        <img className="size-10 rounded-full" src={person.image} alt=""/>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.email}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex space-x-4 border p-4">
                <div className="flex-1 bg-blue-200 p-4">Item 1</div>
                <div className="flex-1 bg-green-200 p-4">Item 2</div>
                <div className="flex-1 bg-red-200 p-4">Item 3</div>
                <div className="flex-1 bg-red-200 p-4">Item 4</div>
                <div className="flex-1 bg-red-200 p-4">Item 5</div>
                <div className="flex-1 bg-red-200 p-4">Item 6</div>
                <div className="flex-1 bg-red-200 p-4">Item 7</div>
                <div className="flex-1 bg-red-200 p-4">Item 8</div>
                <div className="flex-1 bg-red-200 p-4">Item 9</div>
                <div className="flex-1 bg-red-200 p-4">Item 10</div>
                <div className="flex-1 bg-red-200 p-4">Item 11</div>
                <div className="flex-1 bg-red-200 p-4">Item 12</div>
                <div className="flex-1 bg-red-200 p-4">Item 13</div>
                <div className="flex-1 bg-red-200 p-4">Item 14</div>
            </div>
        </div>
    )
}