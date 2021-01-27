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
          <svg
            class="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
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
import moment from "moment";

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
      timeLimit: 20,
      timePassed: 0
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
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
    }
  }
};
</script>
