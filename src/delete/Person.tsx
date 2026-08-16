
import React from "react";
import {number} from "yup";

interface PersonType {
        id: number,
        name: string,
        email: string,
        image: string,
}

export const Person: React.FC<{ person: PersonType }> = ({person}) => {
    return(

        <div>
            <li key={person.email} className="py-4 flex">
                <img className="size-10 rounded-full" src={person.image} alt=""/>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.email}</p>
                </div>
            </li>
        </div>
    )
}