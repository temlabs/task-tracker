import { Task, Edge } from "../utils/interfaces"
import { isDependency } from "../utils/helpers"


interface DiagramProps {
    epic: Task[]
}


const defaultRadius = 20
const defaultVerticalSeparation = 50

function instanceOfEdge(object: any): object is Edge {
    return 'task' in object;
}

export default function Diagram({ epic }: DiagramProps): JSX.Element {

    const transformedTasks: (Task | Edge)[] = transformTasksToSVG(epic)

    return (
        <>
            <svg width="800" height="800">
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
    const verticalSeparation = defaultVerticalSeparation
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
    const angleRange = getAngleRange(verticalSeparation,numberOfEdges,taskRadius)
    const edgeAngles = getEdgeAngles(numberOfEdges,angleRange)


    task.dependencies.forEach((e, i) => {
        e.originx = task.centerx
        e.originy = task.centery

        const edgeAngle = edgeAngles[i]
        const edgeLength = getEdgeLength(edgeAngle,verticalSeparation)
        const destinationCoords = getEdgeDestination(edgeAngle, edgeLength, e.originx!, e.originy!)

        e.destx = destinationCoords.destx
        e.desty = destinationCoords.desty
        e.length = edgeLength

    })





}


function getEdgeAngles(numberOfEdges: number, angleRange: number): number[] {
    const edgeAngles: number[] = []
    const startingAngle  = (180 - angleRange) / 2
    const endAngle = (180 + angleRange) / 2
    const increment = angleRange / (numberOfEdges + -1)
    let currentAngle = startingAngle
    let multiple = 0
    while (currentAngle < endAngle) {
        currentAngle = startingAngle + (multiple * increment)
        edgeAngles.push(currentAngle)
        multiple++
    }
    return edgeAngles
}


function getEdgeLength(edgeAngle: number, verticlaDistance: number): number {
    const angleWithVertical = Math.abs(90 - edgeAngle)
    const edgeLength = verticlaDistance/Math.cos(angleWithVertical*(Math.PI/180))
    return Math.abs(edgeLength)
}

function getEdgeDestination(edgeAngle: number, edgeLength: number, originx: number, originy: number) {

    const angleWithVertical = Math.abs(90 - edgeAngle)
    const x = (Math.sin(angleWithVertical*(Math.PI/180)) * edgeLength)
    const desty = originy + Math.abs((Math.cos(angleWithVertical*(Math.PI/180)) * edgeLength))
    const destx = edgeAngle < 90 ? originx - x : originx + x

    return { destx: destx, desty: desty }

}

function getAngleRange(verticalSeparation: number, numberOfEdges:number, r:number){
    // const baseWidth = (2*numberOfEdges - 2)*r
    const baseWidth = numberOfEdges*2*r
    const halfAngleRange = Math.atan((baseWidth/2)/verticalSeparation)*(180/Math.PI) 
    return halfAngleRange*2
}