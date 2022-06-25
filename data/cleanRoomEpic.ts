import { Task } from "../utils/interfaces"

const organiseWardrobe: Task = {
    head: false,
    id: 4,
    title: 'Organise wardrobe',
    status: 'Not started',
    dependencies: [],
    parents:[3,5]

}

const putShoesAway: Task = {
    head: false,
    id: 3,
    title: 'Put shoes away',
    status: 'Not started',
    dependencies: [
        {
            task: organiseWardrobe,
            priority: 2

        }
    ],
    parents:[1]
}

const hoover: Task = {
    head: false,
    id: 1,
    title: 'Hoover room',
    status: 'Not started',
    dependencies: [{
        task: putShoesAway,
        priority: 4
    }],
    parents:[6]
}

const putClothesInWardrobe: Task = {
    head: false,
    id: 5,
    title: 'Put clothes in wardrobe',
    status: 'Not started',
    dependencies: [
        {
            task: organiseWardrobe,
            priority: 3
        }
    ],
    parents:[2]
}

const makeBed: Task = {
    head: false,
    id: 2,
    title: 'Change bed sheets',
    status: 'Not started',
    dependencies: [
        {
            task: putClothesInWardrobe,
            priority: 4
        }
    ],
    parents: [6]
}

const cleanRoom: Task = {
    head: true,
    id: 6,
    title: 'Epic - clean room',
    status: 'Not started',
    dependencies: [
        {
            task: makeBed,
            priority: 4
        },
        {
            task: hoover,
            priority: 3
        }
    ],
    parents: []
}

const cleanRoomEpic = [cleanRoom, makeBed, hoover, putClothesInWardrobe, putShoesAway, organiseWardrobe]

export default cleanRoomEpic