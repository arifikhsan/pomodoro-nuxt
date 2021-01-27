<template>
  <div class="max-w-5xl px-4 pb-16 mx-auto">
    <div class="py-2 text-center border-b">
      <h1 class="text-3xl font-bold text-green-500">Pomodoro</h1>
    </div>
    <div class="mt-8 text-center">
      <div>
        <p class="text-5xl font-bold text-green-500">{{ formattedTimeLeft }}</p>
      </div>
      <div class="mt-4">
        <h2 class="text-3xl font-bold leading-none text-green-500">
          {{ currentTodo.text }}
        </h2>
      </div>
      <div class="mt-8">
        <button
          @click="startTimer"
          class="p-2 text-white transition duration-500 transform rounded-full shadow bg-gradient-to-tr from-green-400 to-blue-500 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
        </button>
        <button
          @click="stopTimer"
          class="p-2 text-white transition duration-500 transform rounded-full shadow bg-gradient-to-tr from-green-400 to-blue-500 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        </button>
        <button
          @click="todoComplete"
          class="p-2 text-white transition duration-500 transform rounded-full shadow bg-gradient-to-tr from-green-400 to-blue-500 focus:outline-none"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
        </button>
      </div>
      <div class="grid gap-4 py-8 text-center">
        <h2 class="text-xl font-bold text-gray-700">Kegiatan selanjutnya</h2>
        <div class="grid gap-4">
          <div
            v-for="todo in nextTodos"
            :key="todo.id"
            class="flex justify-between px-4 py-2 text-gray-800 transition duration-500 border border-green-400 rounded hover:bg-green-500 hover:text-white"
          >
            <p>
              {{ todo.text }}
            </p>
            <div class="inline-flex items-center space-x-2">
              <button>
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button>
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-8 border-t">
        <div class="prose lg:prose-xl">
          <div>
            <h1>Cara menggunakan Pomodoro timer</h1>
            <ol>
              <li>Tambahkan kegiatan baru.</li>
              <li>Pilih kegiatan yang mau dikerjakan.</li>
              <li>Mulai timer kemudian fokus selama 25 menit.</li>
              <li>Istirahat selama 5 menit ketika alarm berbunyi.</li>
              <li>Ulangi 3-5 kali sampai kegiatan tersebut selesai.</li>
            </ol>
          </div>
          <div>
            <h1>Fitur</h1>
            <ul>
              <li>Desain responsif untuk layar desktop dan hp.</li>
              <li>Notifikasi audio.</li>
              <li>
                (Segera datang) Transisi warna untuk menyesuaikan mood ketika
                bekerja dan istirahat.
              </li>
              <li>(Segera datang) Statistik.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const IDLE = 0
const RUN = 1
const PAUSED = 2

export default {
  data() {
    return {
      run: false,
      todos: [],
      dummyTodos: [
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
      ],
      timerInterval: null,
      timeLimit: 5,
      timePassed: 0,

      /**
       * 0 = idle
       * 1 = running
       * 2 = paused
       */
      state: IDLE
    };
  },
  computed: {
    currentTodo() {
      return this.todos[0];
    },
    nextTodos() {
      let currentTodos = [...this.todos];
      currentTodos.shift();
      return currentTodos;
    },
    timeLeft() {
      return this.timeLimit - this.timePassed;
    },
    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      const minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    }
  },
  created() {
    this.todos = this.dummyTodos;
  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();
      }
    }
  },
  methods: {
    startTimer() {
      this.state = RUN
      this.timerInterval = setInterval(() => {
        this.timePassed += 1;
      }, 1000);
    },
    pauseTimer() {
      this.state = PAUSED
      // this.timerInterval.
    },
    stopTimer() {
      this.state = PAUSED
      clearInterval(this.timerInterval);
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
      this.state = IDLE
      console.log("done");
    },

    todoComplete() {
      console.log('well todo done')
    }
  }
};
</script>
