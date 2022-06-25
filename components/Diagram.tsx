import { Task, Edge } from "../utils/interfaces"
import { isDependency } from "../utils/helpers"


interface DiagramProps {
    epic: Task[]
}


const defaultRadius = 10

function instanceOfEdge(object: any): object is Edge {
    return 'task' in object;
}

export default function Diagram({ epic }: DiagramProps): JSX.Element {

    const transformedTasks: (Task | Edge)[] = transformTasksToSVG(epic)

    return (
        <>
            <svg width="100%" height="800">
                {
                    transformedTasks.map((t,i) => {
                        if (instanceOfEdge(t)) {
                            return <line key={i} x1={t.originx} y1={t.originy} x2={t.destx} y2={t.desty} stroke="black" />
                        } 
                        else {
                            return <circle key={i} cx={t.centerx} cy={t.centery} r={defaultRadius} />
                        }
                    })
                }
            </svg>
        </>
    )
}



function transformTasksToSVG(epic: Task[]): (Task | Edge)[] {
    const tasksWithCoordinates: (Task | Edge)[] = []

    // find head
    const headTask = epic.find(t => t.head === true) as Task
    updateCoordinates(headTask, epic)
    tasksWithCoordinates.push(headTask)
    headTask.dependencies.forEach(d => tasksWithCoordinates.push(d))
    return tasksWithCoordinates
}


function updateCoordinates(task: Task, epic: Task[]) {
    // It is a necessary requirement that epic is organised from head to last child for this to work.
    const headCoords = { x: 500, y: 80 }
    const minEdgeLength = 180
    const taskRadius = defaultRadius

    // give the node centre coords. headcoords if head, or the dest coords of the edge connecting to it
    if (task.head) {
        task.centerx = headCoords.x
        task.centery = headCoords.y
    } else {
        const parentEdges = epic.filter(t => isDependency(t, task)).map(p => p.dependencies.find(e => e.task.id === task.id))
        if (parentEdges) {
            task.centerx = parentEdges[0]?.destx
            task.centery = parentEdges[0]?.desty
        }
    }

    // give each edge an origin at the centre, then destinations.
    const numberOfEdges = task.dependencies.length
    const increment = 180 / (numberOfEdges + 1)
    const edgeAngles = getEdgeAngles(numberOfEdges)


    task.dependencies.forEach((e, i) => {
        e.originx = task.centerx
        e.originy = task.centery

        const edgeAngle = edgeAngles[i]
        const prevEdgeLength = i === 0 ? minEdgeLength : task.dependencies[i - 1].length
        // const edgeLength = prevEdgeLength && i > 0 ? getEdgeLength(prevEdgeLength, increment, taskRadius) : minEdgeLength
        const edgeLength = minEdgeLength
        const destinationCoords = getEdgeDestination(edgeAngle, edgeLength, e.originx!, e.originy!)

        e.destx = destinationCoords.destx
        e.desty = destinationCoords.desty
        e.length = edgeLength

    })





}


function getEdgeAngles(numberOfEdges: number): number[] {
    const edgeAngles: number[] = []
    const increment = 180 / (numberOfEdges + 1)
    let currentAngle = 0
    let multiple = 1
    while (currentAngle < 180 - increment) {
        currentAngle = multiple * increment
        edgeAngles.push(currentAngle)
        multiple++
    }
    return edgeAngles
}


function getEdgeLength(prevEdgeLength: number, angleSpacing: number, r: number): number {
    const radiusMargin = 2

    const b = prevEdgeLength
    const C = angleSpacing
    const c = 2 * (r + radiusMargin)
    const B = Math.asin((b * Math.sin(C)) / c) * (180 / Math.PI)
    const A = 180 - (C + B)
    const a = (c * Math.sin(A)) / Math.sin(C) // a is the length of the edge
    return a

}

function getEdgeDestination(edgeAngle: number, edgeLength: number, originx: number, originy: number) {

    const angleWithVertical = Math.abs(90 - edgeAngle)
    const x = (Math.sin(angleWithVertical) * edgeLength)
    const desty = originy + Math.abs((Math.cos(angleWithVertical) * edgeLength))
    // const destx = originx + x
    const destx = edgeAngle < 90 ? originx - x : originx + x

    return { destx: destx, desty: desty }

}