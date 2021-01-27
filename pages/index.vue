<template>
  <div class="max-w-5xl px-4 pb-16 mx-auto">
    <div class="flex items-center justify-between py-2 text-center border-b">
      <h1 class="text-3xl font-bold text-green-500">
        <span v-show="pomoCount > 0">{{ pomoCount }}</span>
        <span>Pomodoro</span>
      </h1>
      <button
        @click="launchConfetti"
        class="px-4 py-2 text-sm text-green-500 border border-green-500 rounded"
      >
        Login
      </button>
    </div>
    <div v-show="message" class="my-4 text-center">
      <p
        class="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded"
      >
        {{ message }}
      </p>
    </div>
    <div class="mt-4 text-center">
      <div>
        <p class="text-5xl font-bold text-green-500">{{ formattedTimeLeft }}</p>
      </div>
      <div class="mt-4">
        <h2 class="text-3xl font-bold leading-none text-green-500">
          {{ currentTodo.text }}
        </h2>
      </div>
      <div class="mt-10 space-x-4">
        <button
          @click="pomoTimeSelected"
          :class="[
            timeActive === 'pomo'
              ? 'bg-green-500 text-white'
              : 'border border-green-500 border-dashed'
          ]"
          class="px-2 py-1 text-sm rounded focus:outline-none"
        >
          25:00
        </button>
        <button
          :class="[
            timeActive === 'short'
              ? 'bg-green-500 text-white'
              : 'border border-green-500 border-dashed'
          ]"
          @click="shortRestTimeSelected"
          class="px-2 py-1 text-sm rounded focus:outline-none"
        >
          5:00
        </button>
        <button
          @click="longRestTimeSelected"
          :class="[
            timeActive === 'long'
              ? 'bg-green-500 text-white'
              : 'border border-green-500 border-dashed'
          ]"
          class="px-2 py-1 text-sm rounded focus:outline-none"
        >
          15:00
        </button>
      </div>
      <div class="mt-6 space-x-2">
        <button
          v-if="state == 0 || state == 2"
          @click="startPomo"
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
      <div class="grid gap-4 py-8 mt-2 text-center">
        <h2 class="text-xl font-bold text-gray-700">Kegiatan selanjutnya</h2>
        <div class="grid gap-4 mt-4">
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
import confetti from "canvas-confetti";

import play from "@/components/icons/play";
import pause from "@/components/icons/pause";
import check from "@/components/icons/check";
import edit from "@/components/icons/edit";
import deleteIcon from "@/components/icons/delete";

export default {
  head() {
    return {
      title: this.title
    };
  },
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
      timeLimit: 5, // ganti 25 * 60
      timePassed: 0,

      /**
       * 0 = idle
       * 1 = running
       * 2 = paused
       */
      state: 0,

      timeActive: "pomo", // pomo, short, long

      pomoDone: false,
      shortRestDone: false,
      longRestDone: false,

      pomoCount: 0,
      message: "Klik tombol play untuk mulai bekerja."
    };
  },
  computed: {
    title() {
      return `${this.formattedTimeLeft} | ${this.titlePomoState} | ${this.titlePomoCount}`;
    },
    titlePomoState() {
      if (this.state == 0) {
        return "Siap Bekerja";
      } else if (this.state == 1) {
        return "Selamat Bekerja";
      } else {
        return "Berhenti Sementara";
      }
    },
    titlePomoCount() {
      if (this.pomoCount > 0) {
        return `${this.pomoCount} Pomodoro`;
      } else {
        return "Pomodoro";
      }
    },
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
    pomoTimeSelected() {
      this.timeLimit = 5; // ganti 25 * 60
      this.timeActive = "pomo";
      this.timePassed = 0;
    },
    shortRestTimeSelected() {
      this.timeLimit = 2; // ganti 5 * 60
      this.timeActive = "short";
      this.timePassed = 0;
    },
    longRestTimeSelected() {
      this.timeLimit = 3; // ganti 15 * 60
      this.timeActive = "long";
      this.timePassed = 0;
    },

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

      if (this.timeActive == "pomo") {
        this.pomoCount += 1;
        console.log("done, short rest time");
        this.message =
          "Waktu kerja selesai, saatnya untuk istirahat pendek selama 5 menit.";
        this.shortRestTimeSelected();
      } else if (this.timeActive == "short") {
        if (this.pomoCount < 3) {
          console.log("done, time to work again");
          this.message = "Waktu istirahat selesai. Ayo bekerja lagi :D";
          this.pomoTimeSelected();
        } else {
          this.message =
            "Kerja bagus. Nikmatilah istirahat panjang selama 15 menit XD";
          console.log("done, walk");
          this.pomoCount = 0;
          this.longRestTimeSelected();
          // yay enjoy!
          this.launchConfetti();
        }
      } else if (this.timeActive == "long") {
        this.message =
          "Semoga harimu menyenangkan, selamat bekerja, buatlah sesuatu yang keren :D";
        this.pomoTimeSelected();
      } else {
        console.log("congrats");
      }
    },

    startPomo() {
      // start timer 25 menit
      // start timer 5 menit
      // stop

      this.startTimer();
      if (this.timeActive == "pomo") {
        this.message = "Selamat bekerja :)";
      } else if (this.timeActive == "short") {
        this.message =
          "Ambilah minum atau regangkan kepala, pundak, dan bahu :D";
      } else if (this.timeActive == "long") {
        this.message =
          "Saatnya untuk jalan-jalan santai melihat pemandangan diluar ruangan, menonton video, rebahan, atau makan cemilan ;)";
      }
      // console.log("done, rest time");
      // this.timeLimit = 5;
      // this.startTimer();
      // console.log("done, work time");
    },

    launchConfetti() {
      if (typeof window !== "undefined") {
        var duration = 5 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          var particleCount = 50 * (timeLeft / duration);
          // since particles fall down, start a bit higher than random
          confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
          );
          confetti(
            Object.assign({}, defaults, {
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
          );
        }, 250);
      }
    },

    todoComplete() {
      console.log("well todo done");
    }
  }
};
</script>
