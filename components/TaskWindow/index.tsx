import { RefObject, useEffect, useRef, useState } from "react"
import { Task } from "../../utils/interfaces"

interface TaskWidowProps {
    windowRef: RefObject<HTMLDivElement>;
    setWindowShowing: (windowShowing:boolean) => void
}

interface TaskWindowState extends Task {
    earliestPossibleStartDateInput: string;
    earliestPossibleStartTime: string;
}



export default function TaskWindow({ windowRef, setWindowShowing }: TaskWidowProps): JSX.Element {

    return (

        <div ref={windowRef} className="bg-white absolute  left-[50%] top-[50vh] translate-x-[-50%] translate-y-[-50%] w-[70vw] h-[80vh] m-auto rounded-2xl shadow-2xl p-10 flex flex-col">
            <div className="flex justify-end">
                <p className=" underline text-sky-600 cursor-pointer" onClick={() => setWindowShowing(false)}>Cancel</p>

            </div>
            <input placeholder="Enter a title for your task" className="text-4xl outline-none w-auto p-2 focus:outline-sky-600 rounded-sm" />
            <textarea placeholder="Provide a description" className=" my-2 resize-none outline-none h-24 overflow-hidden p-2 focus:outline-sky-600 rounded-sm " maxLength={240} />
            <hr className="my-4"></hr>
            <div className="flex my-2 px-2 justify-between">
                <span className="flex flex-col justify-between my-1">
                    <p className=" text-xs mb-2 text-gray-800">Estimated remaining time *</p>
                    <DurationInput onChange={() => console.log('hi')} className="text-gray-700 outline outline-1 outline-gray-300 rounded-md w-48 px-1" />

                </span>
                <span className="flex flex-col items-start justify-start my-1">
                    <p className="text-xs mb-2 text-gray-800">Earliest possible start</p>
                    <span>
                        <input className="text-gray-700 outline outline-1 outline-gray-300 rounded-md mr-2  w-30 px-1" type="date"></input>
                        <input className="text-gray-700 outline outline-1 outline-gray-300 rounded-md  w-20 px-1" type="time"></input>
                    </span>
                </span>
                <span className="flex flex-col justify-between my-1">
                    <p className="text-xs mb-2 text-gray-800">Deadline</p>
                    <span>
                        <input className="text-gray-700 outline outline-1 outline-gray-300 rounded-md mr-2 w-30 px-1" type="date"></input>
                        <input className="text-gray-700 outline outline-1 outline-gray-300 rounded-md w-20 px-1" type="time"></input>
                    </span>
                </span>
            </div>
            <hr className="mt-10 mb-6"></hr>
            <div className="flex flex-col">
                <p className="text-sm text-gray-800">Dependent on:</p>

            </div>
        </div>

    )
}




function DurationInput(props: { onChange: (value: string) => any; className: string; }): JSX.Element {

    const inputRef = useRef<HTMLInputElement>(null)

    interface Duration {
        days: number;
        hours: number;
        minutes: number;
        value: string;
        typedValue: string;
    }

    const initialDuration: Duration = {
        days: 0,
        hours: 0,
        minutes: 0,
        value: '',
        typedValue: ''
    }

    const [duration, setDuration] = useState<Duration>(initialDuration)
    const [inputFocused, setInputFocused] = useState<boolean>(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [suggestionIndex, setSuggestionIndex] = useState<number>(-1)


    function handleFocus() {
        setInputFocused(true)
        if (duration) {
            validateInput(duration.value)
        }
    }

    function validateInput(input: string) {
        // get current input and
        const daysRegex = /(\d\s)(?=day)/gmi
        const daysMatch = input.match(daysRegex)
        const days = daysMatch && daysMatch.length > 0 ? parseInt(daysMatch[0]) : 0

        const hoursRegex = /(\d\s)(?=hour)/gmi
        const hoursMatch = input.match(hoursRegex)
        const hours = hoursMatch && hoursMatch.length > 0 ? parseInt(hoursMatch[0]) : 0

        const minutesRegex = /(\d\s)(?=minute)/gmi
        const minutesMatch = input.match(minutesRegex)
        const minutes = minutesMatch && minutesMatch.length > 0 ? parseInt(minutesMatch[0]) : 0

        setDuration({
            days: days,
            hours: hours,
            minutes: minutes,
            value: input,
            typedValue: input
        })
        const timeUnits = ['day', 'hour', 'minute']

        const trailingNumberRegex = /(\d+|\d+\s)$/gm
        const trailingNumberMatch = input.match(trailingNumberRegex)
        const lastValueIsNumber = trailingNumberMatch !== null && trailingNumberMatch.length > 0 ? true : false
        const trailingNumber = trailingNumberMatch !== null ? parseInt(trailingNumberMatch[0].trim()) : null

        if (!lastValueIsNumber) {

            const lastWordRegex = /\w+$/g
            const lastWordMatch = input.match(lastWordRegex)
            if (lastWordMatch) {
                const lastWord = lastWordMatch[0]
                const remainingTimeUnits = timeUnits.filter(u => u.includes(lastWord))
                const lastNumberRegex = /\d+/g
                const lastNumberMatch = input.match(lastNumberRegex)
                const lastNumber = lastNumberMatch ? parseInt(lastNumberMatch[0]) : 0
                const newSuggestions = remainingTimeUnits.map(u => `${input.replace(lastWordRegex, '').trim()} ${lastNumber === 1 ? u : `${u}s`}`)
                setSuggestions(newSuggestions)
            } else {
                setSuggestions([])
                setSuggestionIndex(-1)
            }

        } else if (trailingNumber !== null) {
            const remainingTimeUnits = timeUnits.filter(u => !input.includes(u))
            const newSuggestions = remainingTimeUnits.map(u => `${input.trim()} ${trailingNumber === 1 ? u : `${u}s`}`)
            setSuggestions(newSuggestions)
        }

    }

    function handleSuggestionScrubbing(e: React.KeyboardEvent<HTMLInputElement>) {
        const key = e.key
        if (key === 'ArrowDown') {
            e.preventDefault()
            if (suggestionIndex < suggestions.length - 1) {
                setSuggestionIndex(s => s + 1)
                const newValue = suggestions[suggestionIndex + 1]
                const newDuration: Duration = { ...duration, value: newValue }
                setDuration(newDuration)
            }
        }

        if (key === 'ArrowUp') {
            e.preventDefault()
            if (suggestionIndex > 0) {
                setSuggestionIndex(s => s - 1)
                const newValue = suggestions[suggestionIndex - 1]
                const newDuration: Duration = { ...duration, value: newValue }
                setDuration(newDuration)
            } else if (suggestionIndex === 0) {
                setSuggestionIndex(-1)
                const newDuration: Duration = { ...duration, value: duration.typedValue }
                setDuration(newDuration)
            }
        }


        if (key === 'Enter' || key === 'Escape') {
            e.preventDefault()
            setSuggestions([])
        }

    }


    return (



        <>
            <div onFocus={handleFocus} onBlur={() => setInputFocused(false)} className="flex flex-col justify-start items-center h-auto">
                <input ref={inputRef} onKeyDown={(e) => handleSuggestionScrubbing(e)} className={props.className} onChange={((e) => validateInput(e.target.value))} value={duration?.value.toLowerCase()} ></input>
                {inputFocused && suggestions.length > 0 &&
                    <div className="flex flex-col absolute mt-7 w-48 z-10 bg-white border border-stone-500">
                        {suggestions.map((s, i) => <div key={s.length * i} style={{ backgroundColor: i === suggestionIndex ? 'blue' : undefined }} className="px-2 hover:bg-red-500 w-[100%]">{s}</div>)}
                    </div>
                }
            </div>
        </>
    )
}