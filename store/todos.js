import { v4 as uuidv4 } from "uuid";

export const state = () => ({
  list: [
    {
      id: 1,
      text: "Berburu ubur-ubur",
      done: false
    },
    {
      id: 2,
      text: "Bekerja di krasti kreb",
      done: false
    },
    {
      id: 3,
      text: "Memberi makan geri",
      done: false
    }
  ]
});

export const mutations = {
  add(state, text) {
    state.list.push({
      id: uuidv4(),
      text,
      done: false
    });
  },
  remove(state, { todo }) {
    state.list.splice(state.list.indexOf(todo), 1);
  },
  toggle(state, todo) {
    todo.done = !todo.done;
  }
};

export const getters = {
  currentTodo(state) {
    return state.list[0];
  },
  find(state) {
    return todoId => {
      return state.list.find(todo => todo.id == todoId);
    };
  }
};
