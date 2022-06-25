import Link from "next/link"
export default function Sidebar(): JSX.Element {


    return (
        <>
            <div className="flex flex-col bg-white border-l-2 border h-screen text-gray shadow-2xl">
                <Link href="/">
                    Home
                </Link>
                <Link href={"/epics/test"}>
                    Test Epic
                </Link>
                <Link href={"/epics/new"}>
                    Create new epic
                </Link>
                <Link href={"/"}>
                    About
                </Link>
            </div>
        </>
    )
}