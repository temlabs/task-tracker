/**
 * Node in a 'Task tree'. The epic has head set to true. Dependencies are 'Edge' types which contain a task and the priority w.r.t the direct parent.
 */
//  export interface Task {
//     head: boolean;
//     id: number;
//     title: string;
//     status: Status;
//     dependencies: Edge[];
//     comment?: string;
// }

export interface Edge {
    task: Task;
    priority: Priority;
    originx?: number;
    originy?: number;
    destx?: number;
    desty?: number;
    length?: number;

}

export type Status = 'Not started' | 'In progress' | 'Blocked' | 'Completed'
export type Priority = 1 | 2 | 3 | 4

export interface Task {
    head: boolean;
    id: number;
    title: string;
    description?: string;
    earliestStart?: string;
    estimatedTime?: string;
    deadline?: string;
    status: Status;
    dependencies: Edge[]
    centerx?: number;
    centery?: number;
}