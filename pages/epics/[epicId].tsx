import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Diagram from "../../components/Diagram"
import TaskWindow from "../../components/TaskWindow"
import hostDinnerEpic from "../../data/hostDinnerEpic"
import cleanRoomEpic from "../../data/cleanRoomEpic"
import Button from "../../components/Button"

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
            <section className="flex flex-col items-start w-auto relative p-5">
                <Button onClick={() => setWindowShowing(true)}>
                    New Task
                </Button>

                {windowShowing &&
                    <TaskWindow windowRef={popupRef} setWindowShowing={setWindowShowing} />
                }
            </section>
            <section>
                <Diagram epic={hostDinnerEpic} verticalSeparation={110} radius={15}/>
            </section>


        </>
    )
}