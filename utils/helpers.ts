import { Task } from "./interfaces"

export function isDependency(parentTask: Task, potentiallyDependentTask: Task): boolean {
    if (parentTask.dependencies.length > 0) {
        return parentTask.dependencies?.some(dep => dep.task.id === potentiallyDependentTask.id)
    }
    return false
}