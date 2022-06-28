import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
}

export default function Button({children, onClick}:ButtonProps){



    return (
        <button onClick={e => onClick(e) } className=" text-sm flex items-center justify-center px-4 py-1 bg-blue-900 text-white rounded-md hover:bg-blue-600 transition-all">
            {children}
        </button>
    )
}