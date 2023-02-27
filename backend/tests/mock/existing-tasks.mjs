const date = new Date();

/** Tasks who will be populated in the database */
export const EXISTING_TASKS = [
  {
    name: 'Do homework',
    description: 'Do math and english homework',
    priority: 1,
    done: false,
    deadline: new Date(date.setDate(date.getDate())),
  },
  {
    name: 'Do homework',
    description: 'Do math and english homework',
    priority: 1,
    done: true,
    deadline: new Date(date.setDate(date.getDate() + 1)),
  },
  {
    name: "Buy the dog's food",
    priority: 2,
    done: false,
    deadline: new Date(date.setDate(date.getDate())),
  },
  {
    name: 'Pay water bill',
    description: 'R$ 105.00',
    priority: 2,
    done: true,
    deadline: new Date(date.setDate(date.getDate() + 1)),
  },
  {
    name: 'Pay back ricardo',
    description: 'R$ 300.00',
    priority: 2,
    done: false,
    deadline: new Date(date.setDate(date.getDate() + 1)),
  },
  {
    name: "Buy Anna's Christmas gift.",
    description: '',
    priority: 2,
    done: true,
    deadline: new Date(date.setDate(date.getDate() + 1)),
  },
];
