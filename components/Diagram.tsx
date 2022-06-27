import { toNamespacedPath } from "path";
import { Task, Edge } from "../utils/interfaces"



interface DiagramProps {
    epic: Task[]
    radius: number;
    verticalSeparation: number;
}


function instanceOfEdge(object: any): object is Edge {
    return 'task' in object;
}


const priorityToColour = {
    1: "green",
    2: "yellow",
    3: "orange",
    4:"red"
}

export default function Diagram({ epic, radius, verticalSeparation }: DiagramProps): JSX.Element {

    const transformedTasks = transformTasksToSVG(epic, verticalSeparation, radius)
    const transformedEdges = getEdges(transformedTasks, verticalSeparation, radius)


    return (
        <>
            <svg width="800" height="800">

                {/* <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                    markerWidth="6" markerHeight="6"
                    orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" />
                </marker> */}


                {
                    transformedEdges.map((e,i) => {

                        return <line key={i} x1={e.originx! + 400} y1={e.originy} x2={e.destx! + 400} y2={e.desty} stroke={priorityToColour[e.priority]} markerEnd="url(#arrow)" strokeWidth="1.5" ></line>

                    })
                }


                {
                    transformedTasks.map((t, i) => {

                        return <g key={t.title} >
                            <circle className=" cursor-pointer" cx={t.centerx! + 400} cy={t.centery} r={radius} fill="white" stroke="black" strokeWidth="1.5" />
                            <text x={t.centerx! + 400} y={t.centery! + radius + 20} className=" text-xs">{t.title}</text>
                        </g>

                    })
                }
            </svg>
        </>
    )
}



function transformTasksToSVG(epic: Task[], verticalSeparation: number, radius: number): Task[] {
    const tasksWithCoordinates: Task[] = []

    const queue: Task[] = [...epic]
    let iteration = 0
    // for each child of head, getCoordinatesForChildren
    while (queue.length > 0 && iteration < 100) {
        const currentTask = queue[0]

        if (currentTask.head) {
            currentTask.centerx = 0
            currentTask.centery = 20
        }
        const hasCoords: boolean = currentTask.centerx !== undefined && currentTask.centery !== undefined
        if (!hasCoords) {
            const sendToBack = queue.shift()
            if (sendToBack) {
                queue.push(sendToBack)
            }
        }
        else {
            getCoordinatesForChildren(currentTask, epic, verticalSeparation, radius)
            const taskWithCoordinates = queue.shift()
            if (taskWithCoordinates) {
                tasksWithCoordinates.push(taskWithCoordinates)
            }
        }
        iteration++
    }

    return tasksWithCoordinates
}

/**
 * Takes a task and populates it with co-ordinates for the circle itself, then populates each of its edges with an origin and destination
 * @param task the task that is receiving co-ordinates
 * @param epic the collection of tasks. This is required so that 
 * @param verticalSeparation 
 * @param radius 
 */
function getCoordinatesForChildren(task: Task, epic: Task[], verticalSeparation: number, radius: number) {
    const hasChildren = task.dependencies.length > 0
    const numberOfChildren = task.dependencies.length
    // if task has co-ordinates, we can provide co-ordinates for its children
    if (task.centerx !== undefined && task.centery !== undefined && hasChildren) {
        const xPositions = getXPositions(numberOfChildren, task.centerx, radius)
        task.dependencies.forEach((e, i) => {
            const childTask = e.task
            const hasPosition = childTask.centerx !== undefined && childTask.centery !== undefined
            if (!hasPosition && xPositions) {
                childTask.centerx = xPositions[i]
                childTask.centery = task.centery! + verticalSeparation
            }
            else if (hasPosition && childTask.parents.length > 1) { // has another parent that has updated it

                const numberOfParents = childTask.parents.length
                const parents = childTask.parents.map(id => epic.find(t => t.id === id))
                const allParentsHaveCoordinates = parents.every(t => t && t.centerx !== undefined && t.centery !== undefined)

                // if all of the child's parents have co-ords, it can now be properly positioned.
                // otherwise, leave the job for the last parent
                if (allParentsHaveCoordinates) {

                    const parentsx = parents.map(t => t?.centerx)
                    const sumOfParentsx = parentsx.reduce((prev, curr) => {
                        if (prev !== undefined && curr !== undefined) {
                            return prev + curr
                        }
                        return 0
                    }, 0)
                    if (sumOfParentsx !== undefined) {
                        childTask.centerx = sumOfParentsx / numberOfParents
                    }

                    const parentsy = parents.map(t => t?.centery)
                    const lowestParent = parentsy.reduce((prev, curr) => {
                        if (curr && prev && curr > prev) {
                            return curr
                        }
                    }, parentsy[0]) // higher y value is lower on the canvas

                    if (lowestParent) {
                        childTask.centery = lowestParent + verticalSeparation
                    }
                    getCoordinatesForChildren(childTask, epic, verticalSeparation, radius)
                }
            }


        })
    }
}





function getXPositions(numberOfTasks: number, parentx: number, radius: number) {
    if (numberOfTasks === 0) {
        console.log('bad call')
        return
    }
    if (numberOfTasks === 1) {
        return [parentx]
    }
    const margin = 100
    const lineLength = (numberOfTasks) * (radius + margin)
    const halfwayPoint = lineLength / 2
    const xPositions: number[] = []
    const increment = lineLength / (numberOfTasks - 1)
    let currentPosition = 0
    for (let i = 0; i < numberOfTasks; i++) {
        currentPosition = (i * increment)
        xPositions.push(currentPosition - halfwayPoint + parentx)
    }
    return xPositions
}


function getEdges(transformedEpic: Task[], verticalSeparation:number, radius:number) {
    const edges: Edge[] = []

    transformedEpic.forEach(t => {
        if (t.centerx !== undefined && t.centery !== undefined) {
            const x2 = t.centerx
            const y2 = t.centery

            
            t.dependencies.forEach(e => {
                if (e.task.centerx !== undefined && e.task.centery !== undefined) {

                    const x1 = e.task.centerx
                    const y1 = e.task.centery

                    // work out angle to the destination node (parent node)
                    const xDidfference = Math.abs(x1-x2)
                    const angleToDestNode = Math.atan(xDidfference / verticalSeparation)
                    // now we can work out the x and y adjustment for the line so that it touches the edge of the node
                    let xAdjustment = x1 > x2 ?  Math.cos(angleToDestNode)*radius : -Math.cos(angleToDestNode)*radius
                    xAdjustment = x1 === x2 ? 0 : xAdjustment
                    let yAdjustment = Math.sin(angleToDestNode)*radius
                    yAdjustment = x1 === x2 ? radius : yAdjustment
                    
                    e.originx = x1 - xAdjustment
                    e.originy = y1 - yAdjustment
                    e.destx = x2 + xAdjustment
                    e.desty = y2 + yAdjustment
                    edges.push(e)
                }

            })
        }


    })
    return edges
}