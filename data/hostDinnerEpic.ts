import { Task } from "../utils/interfaces"


const invitePeople: Task = {
    head: false,
    id: 7,
    title: 'Invite people',
    status: 'Not started',
    dependencies: [],
    parents:[6]

}

const decideBudget: Task = {
    head: false,
    id: 6,
    title: 'Decide budget',
    status: 'Not started',
    dependencies: [
        {
            task: invitePeople,
            priority: 4
        }
    ],
    parents:[4]
}

const getMealSuggestions: Task = {
    head: false,
    id: 8,
    title: 'Get meal suggestions',
    status: 'Not started',
    dependencies: [],
    parents:[5]
}

const decideMenu: Task = {
    head: false,
    id: 5,
    title: 'Curate a menu',
    status: 'Not started',
    dependencies: [
        {
            task: getMealSuggestions,
            priority: 3
        }
    ],
    parents:[4]
}

const buyIngredients: Task = {
    head: false,
    id: 4,
    title: 'Buy ingredients',
    status: 'Completed',
    dependencies: [
        {
            task: decideMenu,
            priority: 4
        },
        {
            task: decideBudget,
            priority: 3
        }
    ],
    parents:[3,2]
}

const prepareFood: Task = {
    head: false,
    id: 3,
    title: 'Prepare food',
    status: 'Not started',
    dependencies: [
        {
            task: buyIngredients,
            priority: 4
        }
    ],
    parents:[0]
}


const getBoardGames: Task = {
    head: false,
    id: 2,
    title: 'Get board games',
    status: 'Not started',
    dependencies: [        {
        task: buyIngredients,
        priority: 4
    }],
    parents:[0]
}

const tidyUp: Task = {
    head: false,
    id: 1,
    title: 'Tidy up',
    status: 'Not started',
    dependencies: [],
    parents:[0]
}

const hostDinner: Task = {
    head: true,
    id: 0,
    title: 'Host a dinner',
    status: 'Not started',
    dependencies: [
        {
            task: getBoardGames,
            priority: 2
        },
        {
            task: prepareFood,
            priority: 4
        },
        {
            task: tidyUp,
            priority: 3
        },
    ],
    parents:[]
}


const hostDinnerEpic = [hostDinner, tidyUp, getBoardGames, prepareFood, buyIngredients, decideMenu, getMealSuggestions, decideBudget, invitePeople]

export default hostDinnerEpic