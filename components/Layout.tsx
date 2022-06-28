import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: JSX.Element }): JSX.Element {


    return (
        <>
            <section className="flex flex-row align-top justify-start">
                <section className="w-2/12 h-screen min-h-full">
                    <Sidebar />
                </section>
                <section className=" w-10/12 flex flex-col bg-white overflow-x-clip">
                    {children}
                </section>
            </section>
        </>
    )
}