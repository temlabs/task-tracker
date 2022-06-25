import { Task, Edge } from "../utils/interfaces"
import { isDependency } from "../utils/helpers"


interface DiagramProps {
    epic: Task[]
    radius: number;
    verticalSeparation: number;
}


function instanceOfEdge(object: any): object is Edge {
    return 'task' in object;
}

export default function Diagram({ epic, radius, verticalSeparation }: DiagramProps): JSX.Element {

    const transformedTasks: (Task | Edge)[] = transformTasksToSVG(epic, verticalSeparation, radius)
    return (
        <>
            <svg width="800" height="800">
                {
                    transformedTasks.map((t, i) => {
                        if (instanceOfEdge(t)) {
                            return <line key={i} x1={t.originx} y1={t.originy} x2={t.destx} y2={t.desty} stroke="black" />
                        }
                        else {
                            return <circle key={i} cx={t.centerx} cy={t.centery} r={radius} />
                        }
                    })
                }
            </svg>
        </>
    )
}



function transformTasksToSVG(epic: Task[], verticalSeparation: number, radius: number): (Task | Edge)[] {
    const tasksWithCoordinates: (Task | Edge)[] = []

    // find head
    epic.forEach( t => {
        updateCoordinates(t,epic,verticalSeparation,radius)
        tasksWithCoordinates.push(t)
        t.dependencies.forEach(e => tasksWithCoordinates.push(e))
    })

    return tasksWithCoordinates
}

/**
 * Takes a task and populates it with co-ordinates for the circle itself, then populates each of its edges with an origin and destination
 * @param task the task that is receiving co-ordinates
 * @param epic the collection of tasks. This is required so that 
 * @param verticalSeparation 
 * @param radius 
 */
function updateCoordinates(task: Task, epic: Task[], verticalSeparation: number, radius: number) {
    // It is a necessary requirement that epic is organised from head to last child for this to work.
    // This is because if it isn't a head node, it will use the destination co-ordinates of the parent edge as center point.
    // It is assumed that these edges will already have destinations, which means this function should be called on the parents of this task before this task is processed.
    const headCoords = { x: 500, y: 80 }
    console.log(task.title)
    // give the task node center co-ords. give default head co-ords if head. otherwise, give the dest coords of the edge connecting to it
    if (task.head === true) {
        task.centerx = headCoords.x
        task.centery = headCoords.y
    } else {
        // find the first edge that conects to the tasks and use its dest co-rords as center co-ords
        const parentEdges = epic.filter(t => isDependency(t, task)).map(p => p.dependencies.find(e => e.task.id === task.id))
        if (parentEdges) {
            task.centerx = parentEdges[0]?.destx
            task.centery = parentEdges[0]?.desty
        }
    }


    // give each edge an origin at the centre, then destinations.
    
    const numberOfEdges = task.dependencies.length
    if(numberOfEdges > 0){
        const angleRange = getAngleRange(verticalSeparation, numberOfEdges, radius)
        const edgeAngles = getEdgeAngles(numberOfEdges, angleRange)
    
        for (let i = 0; i < task.dependencies.length; i++) {
            const e = task.dependencies[i]
            e.originx = task.centerx
            e.originy = task.centery
    
            const edgeAngle = edgeAngles[i]
            const edgeLength = getEdgeLength(edgeAngle, verticalSeparation)
            const destinationCoords = getEdgeDestination(edgeAngle, edgeLength, e.originx!, e.originy!)
    
            e.destx = destinationCoords.destx
            e.desty = destinationCoords.desty
            e.length = edgeLength

        }
    }
}

/**
 * Divides the angle range proportionately such that each edge has an angle (wrt to horizon) from which it travels to the next node
 * @param numberOfEdges 
 * @param angleRange 
 * @returns 
 */
function getEdgeAngles(numberOfEdges: number, angleRange: number): number[] {
    const edgeAngles: number[] = []
    if(numberOfEdges===1){
        return [90]
    }
    const startingAngle = (180 - angleRange) / 2
    const endAngle = (180 + angleRange) / 2
    const increment = angleRange / (numberOfEdges -1)
    let currentAngle = startingAngle
    let multiple = 0
    while (currentAngle < endAngle) {
        currentAngle = startingAngle + (multiple * increment)
        console.log({currentAngle, increment, multiple})
        edgeAngles.push(currentAngle)
        multiple++
    }
    console.log({edgeAngles, startingAngle, endAngle})
    return edgeAngles
}


/**
 * Calculates the length of the edge so that it meets the vertical separation
 * @param edgeAngle 
 * @param verticlaDistance 
 * @returns 
 */
function getEdgeLength(edgeAngle: number, verticlaDistance: number): number {
    const angleWithVertical = Math.abs(90 - edgeAngle)
    const edgeLength = verticlaDistance / Math.cos(angleWithVertical * (Math.PI / 180))
    return Math.abs(edgeLength)
}

/**
 * Given the angle at which the edge leaves the horizontal, and its length, the destination co-ordinates can be calculated.
 * @param edgeAngle 
 * @param edgeLength 
 * @param originx 
 * @param originy 
 * @returns 
 */
function getEdgeDestination(edgeAngle: number, edgeLength: number, originx: number, originy: number) {

    const angleWithVertical = Math.abs(90 - edgeAngle)
    const x = (Math.sin(angleWithVertical * (Math.PI / 180)) * edgeLength)
    const desty = originy + Math.abs((Math.cos(angleWithVertical * (Math.PI / 180)) * edgeLength))
    const destx = edgeAngle < 90 ? originx - x : originx + x

    return { destx: destx, desty: desty }

}

/**
 * Uses the width of the children nodes to calculate an angle that given the vertical separation will ensure no overlap between nodes.
 * @param verticalSeparation 
 * @param numberOfEdges 
 * @param r 
 * @returns 
 */
function getAngleRange(verticalSeparation: number, numberOfEdges: number, r: number) {
    // const baseWidth = (2*numberOfEdges - 2)*r
    const baseWidth = (numberOfEdges + 1) * (r+10)
    const halfAngleRange = Math.atan((baseWidth / 2) / verticalSeparation) * (180 / Math.PI)
    return halfAngleRange * 2
}