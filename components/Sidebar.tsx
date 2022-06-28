import Link from "next/link"
import React, { MouseEventHandler, useState } from "react"
export default function Sidebar(): JSX.Element {

    interface EpicName {
        displayName: string;
        epicId: string;
    }

    const initialEpicNames: EpicName[] = [
        {
            displayName: "Test Epic",
            epicId: "example1"
        },
        {
            displayName: "Other test epic",
            epicId: "example2"
        }
    ]

    const newEpic: EpicName = {
        displayName: "New Epic",
        epicId: "test"
    }




    const [epicNames, setEpicNames] = useState(initialEpicNames)



    function showMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault()
        console.log("menu")
    }



    return (
        <>
            <div className="flex flex-col bg-white p-0  text-gray shadow-xl w-2/12 min-h-full h-full fixed">
                <Link href="/">
                    <span className=" text-sm flex items-center px-3 cursor-pointer h-10 hover:bg-gray-100 hover:px-6 ">
                        <p>Home</p>
                    </span>
                </Link>
                <Link href={"/"}>
                    <span className=" text-sm flex items-center px-3 cursor-pointer h-10 hover:bg-gray-100 hover:px-6 ">
                        <p>About</p>
                    </span>
                </Link>

                <span onClick={() => setEpicNames(p => [...p, newEpic])} className=" text-sm flex items-center px-3 cursor-pointer h-10 bg-rose-800 text-white hover:px-6 ">
                    <p>Create new epic</p>
                </span>

                {
                    epicNames.map(en =>
                        <Link key={en.epicId} href={`/epics/${en.epicId}`}>
                            <div onContextMenu={(e) => showMenu(e)} className=" text-sm flex items-center px-3 cursor-pointer h-10 hover:bg-gray-100 hover:px-6 transition-all ">
                                <p>{en.displayName}</p>
                            </div>
                        </Link>
                    )
                }




            </div>
        </>
    )
}