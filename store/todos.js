import { v4 as uuidv4 } from "uuid";

export const state = () => ({
  list: [
    {
      id: uuidv4(),
      text: "Berburu ubur-ubur",
      done: false
    },
    {
      id: uuidv4(),
      text: "Bekerja di krasti kreb",
      done: false
    },
    {
      id: uuidv4(),
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
  remove(state, todo) {
    state.list.splice(state.list.indexOf(todo), 1);
  },
  toggle(state, todo) {
    todo.done = !todo.done;
  },
  moveToFirst(state, todo) {
    state.list.splice(state.list.indexOf(todo), 1);
    state.list.unshift(todo);
  },
  // setActive(state, todo) {
  //   state.list.splice(state.list.indexOf(todo), 1);
  //   state.list.push({
  //     id: uuidv4(),
  //     text,
  //     done: false
  //   });
  // }
};

export const getters = {
  unfinishedTodos(state) {
    return state.list.filter(todo => todo.done === false);
  },
  currentTodo(state, getters) {
    return getters.unfinishedTodos[0];
  },
  nextTodos(state, getters) {
    let currentTodos = [...getters.unfinishedTodos];
    currentTodos.shift();
    return currentTodos;
  },
  find(state) {
    return todoId => {
      return state.list.find(todo => todo.id == todoId);
    };
  }
};
