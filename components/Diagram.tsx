import { Task, Edge } from "../utils/interfaces"



interface DiagramProps {
    epic: Task[]
    radius: number;
    verticalSeparation: number;
}


function instanceOfEdge(object: any): object is Edge {
    return 'task' in object;
}

export default function Diagram({ epic, radius, verticalSeparation }: DiagramProps): JSX.Element {

    const transformedTasks = transformTasksToSVG(epic, verticalSeparation, radius)

    return (
        <>
            <svg width="800" height="800">
                {
                    transformedTasks.map((t, i) => {

                        return <circle id={t.title} key={t.title} cx={t.centerx !== undefined ? t.centerx + 400 : 200} cy={t.centery} r={radius} />

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
                        if (prev !==undefined && curr !== undefined) {
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
    const margin = 50
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