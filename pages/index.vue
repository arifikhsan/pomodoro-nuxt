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
          v-if="state == 0 || state == 2"
          @click="startTimer"
          class="p-2 text-white transition duration-500 transform rounded-full shadow bg-gradient-to-tr from-green-400 to-blue-500 focus:outline-none"
        >
          <play-icon />
        </button>
        <button
          v-if="state == 1"
          @click="pauseTimer"
          class="p-2 text-white transition duration-500 transform rounded-full shadow bg-gradient-to-tr from-green-400 to-blue-500 focus:outline-none"
        >
          <pause-icon />
        </button>
        <button
          @click="todoComplete"
          class="p-2 text-white transition duration-500 transform rounded-full shadow bg-gradient-to-tr from-green-400 to-blue-500 focus:outline-none"
        >
          <check-icon />
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
                <edit-icon />
              </button>
              <button>
                <delete-icon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="pt-8 border-t">
        <div class="prose text-left lg:prose-xl">
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
import play from "@/components/icons/play";
import pause from "@/components/icons/pause";
import check from "@/components/icons/check";
import edit from "@/components/icons/edit";
import deleteIcon from "@/components/icons/delete";

export default {
  components: {
    "play-icon": play,
    "pause-icon": pause,
    "check-icon": check,
    "edit-icon": edit,
    "delete-icon": deleteIcon
  },
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
      state: 0
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
      this.state = 1;
      this.timerInterval = setInterval(() => {
        this.timePassed += 1;
      }, 1000);
    },
    pauseTimer() {
      this.state = 2;
      clearInterval(this.timerInterval);
    },
    stopTimer() {
      this.state = 2;
      clearInterval(this.timerInterval);
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
      this.state = 0;
      console.log("done");
    },

    todoComplete() {
      console.log("well todo done");
    }
  }
};
</script>
