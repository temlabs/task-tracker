import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Diagram from "../../components/Diagram"
import TaskWindow from "../../components/TaskWindow"
import hostDinnerEpic from "../../data/hostDinnerEpic"

export default function Epic(): JSX.Element {
    const router = useRouter()
    const { epicId } = router.query
    const [windowShowing, setWindowShowing] = useState(false)

    const popupRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const clickCheck = (e: MouseEvent) => {

            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setWindowShowing(false)
            }
        }
        document.addEventListener('mouseup', clickCheck)

        return () => document.removeEventListener('mouseup', clickCheck)

    }, [windowShowing])


    return (
        <>
            <section className="flex flex-col w-auto relative">
                <h1 onClick={() => setWindowShowing(true)}>
                    Create the first task for {epicId}
                </h1>
                <div>
                    some other stuff that should be greyed out
                </div>

                {windowShowing &&
                    <TaskWindow windowRef={popupRef} />
                }
            </section>
            <section>
                {/* <svg width="100%" height="800">
                    <circle className=" cursor-pointer" cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                    <line x1="50" y1="50" x2="50" y2="200" stroke-width="4" stroke="black" />
                    Sorry, your browser does not support inline SVG.
                </svg> */}
                <Diagram epic={hostDinnerEpic} verticalSeparation={90} radius={10}/>
            </section>


        </>
    )
}