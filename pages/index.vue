<template>
  <div class="max-w-xl px-4 pb-16 mx-auto">
    <div class="flex items-center justify-between py-2 text-center border-b">
      <nuxt-link to="/">
        <h1
          class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
        >
          <span v-show="pomoCount > 0">{{ pomoCount }}</span>
          <span>Pomodoro</span>
        </h1>
      </nuxt-link>
      <client-only>
        <div class="relative inline-block text-left">
          <div>
            <button
              @click="isMenuOpen = !isMenuOpen"
              type="button"
              class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
              id="options-menu"
              aria-haspopup="true"
              aria-expanded="true"
            >
              Menu
              <!-- Heroicon name: chevron-down -->
              <svg
                class="w-5 h-5 ml-2 -mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Dropdown Panel -->
          <transition
            enter-active-class="transition duration-100 ease-out transform"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in transform"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
          >
            <div
              v-show="isMenuOpen"
              @click="isMenuOpen = !isMenuOpen"
              class="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
            >
              <div
                class="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  v-if="!isLoggedIn"
                  @click="signIn"
                  class="block w-full px-4 py-2 text-sm text-left text-teal-500 hover:bg-green-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                >
                  Masuk
                </button>
                <button
                  v-if="isLoggedIn"
                  @click="signOut"
                  class="block w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-red-100 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                >
                  Keluar
                </button>
                <button
                  @click="getStatistic"
                  class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                  role="menuitem"
                >
                  Statistik
                </button>
                <a
                  href="https://github.com/arifikhsan/pomodoro-nuxt"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  target="_blank"
                  >Kode Sumber</a
                >
              </div>
            </div>
          </transition>
        </div>
      </client-only>
    </div>

    <client-only>
      <!-- Statistic Panel -->
      <transition
        enter-active-class="transition duration-100 ease-out transform"
        enter-from-class="scale-95 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in transform"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-95 opacity-0"
      >
        <div
          v-show="isStatisticOpen"
          class="fixed inset-0 z-10 p-4 bg-gray-900 bg-opacity-75"
        >
          <div
            class="left-0 right-0 max-w-xl mx-auto mt-2 origin-top bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div class="p-4">
              <div class="inline-flex items-center justify-between w-full">
                <h1
                  class="text-3xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
                >
                  Statistik
                </h1>
                <button
                  @click="isStatisticOpen = !isStatisticOpen"
                  class="p-2 text-red-500 rounded"
                >
                  <close-icon />
                </button>
              </div>
              <div class="mt-4">
                <div v-if="stats.length <= 0">
                  <p>Loading...</p>
                </div>
                <div v-else class="text-sm text-center">
                  <table class="w-full table-auto">
                    <tr>
                      <th>Nama</th>
                      <th>Podomoro</th>
                      <th>Kegiatan</th>
                    </tr>
                    <tr v-for="stat in stats" :key="stat._id">
                      <td>{{ stat.user.name }}</td>
                      <td>{{ stat.pomoCount }}</td>
                      <td>{{ stat.taskCount }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </client-only>

    <div v-show="message" class="my-4 text-center">
      <p
        class="px-4 py-2 text-sm font-semibold text-white rounded from-teal-400 to-blue-500 bg-gradient-to-tr"
      >
        {{ message }}
      </p>
    </div>
    <div class="mt-4 text-center">
      <div>
        <p
          class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
        >
          {{ formattedTimeLeft }}
        </p>
      </div>
      <div class="mt-4">
        <h2
          class="py-3 text-3xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
        >
          {{ currentTodo ? currentTodo.text : "Buat kegiatan baru! :)" }}
        </h2>
      </div>
      <div class="mt-10 space-x-4">
        <button
          @click="pomoTimeSelected"
          :class="[
            timeActive === 'pomo'
              ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white'
              : 'border border-teal-500 border-dashed'
          ]"
          class="px-2 py-1 text-sm transition duration-500 rounded focus:outline-none"
        >
          25:00
        </button>
        <button
          :class="[
            timeActive === 'short'
              ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white'
              : 'border border-teal-500 border-dashed'
          ]"
          @click="shortRestTimeSelected"
          class="px-2 py-1 text-sm transition duration-500 rounded focus:outline-none"
        >
          5:00
        </button>
        <button
          @click="longRestTimeSelected"
          :class="[
            timeActive === 'long'
              ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white'
              : 'border border-teal-500 border-dashed'
          ]"
          class="px-2 py-1 text-sm transition duration-500 rounded focus:outline-none"
        >
          15:00
        </button>
      </div>
      <div class="mt-8 space-x-2">
        <button
          v-show="currentTodo"
          v-if="state == 0 || state == 2"
          @click="startPomo"
          class="p-2 text-white transition duration-500 transform rounded-full shadow hover:scale-95 bg-gradient-to-tr from-teal-400 to-blue-500 focus:outline-none"
        >
          <play-icon />
        </button>
        <button
          v-if="state == 1"
          @click="pauseTimer"
          class="p-2 text-white transition duration-500 transform rounded-full shadow hover:scale-95 bg-gradient-to-tr from-teal-400 to-blue-500 focus:outline-none"
        >
          <pause-icon />
        </button>
        <button
          v-if="state == 1 || state == 2"
          @click="stopTimer"
          class="p-2 text-white transition duration-500 transform rounded-full shadow hover:scale-95 bg-gradient-to-tr from-teal-400 to-blue-500 focus:outline-none"
        >
          <stop-icon />
        </button>
        <button
          v-if="currentTodo"
          @click="todoDone"
          class="p-2 text-white transition duration-500 transform rounded-full shadow hover:scale-95 bg-gradient-to-tr from-teal-400 to-blue-500 focus:outline-none"
        >
          <check-icon />
        </button>
      </div>
      <div class="grid gap-4 py-8 mt-2 text-center">
        <div>
          <h2 class="text-xl font-bold text-gray-800">Kegiatan selanjutnya</h2>
          <p class="inline-flex items-center mt-2 text-xs italic text-gray-700">
            Klik icon &nbsp;<briefcase-icon class="text-teal-500" />&nbsp; untuk
            langsung dikerjakan
          </p>
        </div>
        <div class="grid gap-4 mt-4">
          <div v-if="nextTodos.length <= 0">
            <p class="py-2 text-sm italic text-gray-700">Itu saja :)</p>
          </div>
          <div
            v-else
            v-for="todo in nextTodos"
            :key="todo.id"
            class="flex justify-between px-4 py-2 text-teal-500 transition duration-500 border border-teal-400 rounded cursor-pointer hover:border-opacity-0 hover:text-white bg-gradient-to-r hover:from-teal-400 hover:to-blue-500"
          >
            <p>
              {{ todo.text }}
            </p>
            <div class="inline-flex items-center space-x-2 group">
              <button @click="todoSetActive(todo)">
                <briefcase-icon />
              </button>
              <button @click="removeTodo(todo)">
                <delete-icon />
              </button>
            </div>
          </div>
          <form @submit.prevent="addTodo">
            <input
              v-model="newTodoText"
              class="w-full px-4 py-2 text-gray-800 transition duration-500 border border-teal-400 border-dashed rounded focus:outline-none"
              placeholder="Tambah kegiatan baru..."
              required
            />
            <span class="mt-2 text-sm italic text-gray-700"
              >Tekan "Enter" untuk menambahkan kegiatan.</span
            >
          </form>
        </div>
      </div>
      <div class="pt-8 border-t">
        <div class="prose text-left">
          <div>
            <h1>Latar Belakang</h1>
            <p>
              Disaat kita memiliki pekerjaan yang membutuhkan waktu lama,
              rasanya pekerjaan itu tidak pernah ada selesainya. Meskipun sudah
              didepan komputer siang dan malam.
            </p>
            <p>
              Hal ini membuat pekerjaan menjadi sangat melelahkan. Karena kita
              tidak pernah tahu kapan akan selesai.
            </p>
          </div>
          <div>
            <h1>Fungsi</h1>
            <p>
              Teknik Pomodoro adalah sistem manajemen waktu yang mendorong kita
              untuk bekerja sesuai dengan waktu yang kita miliki.
            </p>
            <p>
              Caranya adalah dengan membagi waktu kerja menjadi 25 menit untuk
              bekerja dan 5 menit untuk istirahat. Gabungan waktu ini disebut
              sebagai 1 pomodoro. Setelah 3 atau 4 pomodoro, ada waktu istirahat
              panjang selama 15 sampai 25 menit.
            </p>
            <p>
              Daripada menghabiskan waktu berjam-jam untuk bekerja tanpa henti,
              teknik pomodoro akan mengingatkan kita untuk istirahat sejenak.
            </p>
          </div>
          <div>
            <h1>Cara menggunakan</h1>
            <ol>
              <li>Tulis dan tambahkan kegiatan baru.</li>
              <li>Pilih kegiatan yang mau dikerjakan.</li>
              <li>Mulai timer kemudian fokus selama 25 menit.</li>
              <li>Istirahat selama 5 menit.</li>
              <li>Ulangi 3-4 kali sampai kegiatan tersebut selesai.</li>
            </ol>
          </div>
          <div>
            <h1>Fitur</h1>
            <ul>
              <li>
                Waktu bisa dijeda (pause), dilanjutkan (resume), dan dihentikan
                (mulai dari awal).
              </li>
              <li>
                Bisa memilih waktu sendiri dengan fleksibel. 25, 5, atau 15
                menit.
              </li>
              <li>Animasi perayaan saat waktu habis.</li>
              <li>Authentikasi mengguankan akun Google.</li>
              <li>Warna gradasi yang bagus.</li>
              <li>Notifikasi audio.</li>
              <li>Statistik.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import confetti from "canvas-confetti";

import play from "@/components/icons/play";
import pause from "@/components/icons/pause";
import stop from "@/components/icons/stop";
import check from "@/components/icons/check";
import edit from "@/components/icons/edit";
import close from "@/components/icons/close";
import deleteIcon from "@/components/icons/delete";
import briefcase from "@/components/icons/briefcase";

import alarm from "@/assets/audio/alarm.mp3";

export default {
  head() {
    return {
      title: this.title,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "dicoding:email",
          name: "dicoding:email",
          content: "arif.ikhsanudin.id@gmail.com"
        }
      ]
    };
  },
  components: {
    "play-icon": play,
    "pause-icon": pause,
    "stop-icon": stop,
    "check-icon": check,
    "edit-icon": edit,
    "close-icon": close,
    "delete-icon": deleteIcon,
    "briefcase-icon": briefcase
  },
  data() {
    return {
      isMenuOpen: false,
      isStatisticOpen: false,
      run: false,
      timerInterval: null,
      timeLimit: 25 * 60, // ganti 25 * 60
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
      message:
        "Klik tombol play untuk mulai bekerja. Masuk dengan akun google untuk menyimpan hasil ke statistik.",
      newTodoText: "",

      stats: []
    };
  },
  computed: {
    title() {
      if (!this.run)
        return "Pomodoro Timer | Manajemen waktu dengan teknik pomodoro";
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

    todos() {
      this.$store.state.todos.list;
    },
    ...mapGetters("todos", ["currentTodo", "nextTodos", "unfinishedTodos"]),
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
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    authUser() {
      return this.$store.getters.authUser;
    }
  },
  created() {
    // console.log(this.$fire.auth.currentUser)
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
      this.timeLimit = 25 * 60; // ganti 25 * 60
      this.timeActive = "pomo";
      this.timePassed = 0;
    },
    shortRestTimeSelected() {
      this.timeLimit = 5 * 60; // ganti 5 * 60
      this.timeActive = "short";
      this.timePassed = 0;
    },
    longRestTimeSelected() {
      this.timeLimit = 15 * 60; // ganti 15 * 60
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
      this.message = "Pomodoro dijeda.";
      clearInterval(this.timerInterval);
    },
    stopTimer() {
      this.state = 0;
      this.message = "Pomodoro berhenti.";
      this.timePassed = 0;
      clearInterval(this.timerInterval);
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
      this.state = 0;

      if (this.timeActive == "pomo") {
        console.log("done, short rest time");
        this.message =
          "Waktu kerja selesai, saatnya untuk istirahat pendek selama 5 menit.";
        this.shortRestTimeSelected();
        this.launchRealisticConfetti();

        this.startTimer();
      } else if (this.timeActive == "short") {
        // increment pomo
        this.pomoCount += 1;
        if (this.isLoggedIn) {
          this.$fire.firestore
            .collection("users")
            .doc(this.authUser.uid)
            .update({
              pomoCount: this.$fireModule.firestore.FieldValue.increment(1)
            });
        }

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
          this.launchFireworksConfetti();
        }
      } else if (this.timeActive == "long") {
        this.message =
          "Semoga harimu menyenangkan, selamat bekerja, buatlah sesuatu yang keren :D";
        this.pomoTimeSelected();
      } else {
        console.log("congrats");
      }

      let audio = new Audio(alarm);
      audio.play();
    },

    startPomo() {
      this.run = true;
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
    },

    ...mapMutations({
      toggle: "todos/toggle"
    }),
    addTodo() {
      this.$store.commit("todos/add", this.newTodoText);
      this.newTodoText = "";
    },
    removeTodo(todo) {
      this.$store.commit("todos/remove", todo);
    },

    launchFireworksConfetti() {
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
    },
    launchSmallConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    },
    launchRealisticConfetti() {
      if (!process.server) {
        var count = 400;
        var defaults = {
          origin: { y: 0.7 }
        };

        function fire(particleRatio, opts) {
          confetti(
            Object.assign({}, defaults, opts, {
              particleCount: Math.floor(count * particleRatio)
            })
          );
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55
        });
        fire(0.2, {
          spread: 60
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45
        });
      }
    },

    todoSetActive(todo) {
      this.$store.commit("todos/moveToFirst", todo);
    },
    async todoDone() {
      console.log("well todo done");
      this.launchSmallConfetti();
      this.removeTodo(this.currentTodo);
      if (this.isLoggedIn) {
        this.$fire.firestore
          .collection("users")
          .doc(this.authUser.uid)
          .update({
            taskCount: this.$fireModule.firestore.FieldValue.increment(1)
          });
      }
    },

    async signIn() {
      let provider = new this.$fireModule.auth.GoogleAuthProvider();

      this.$fire.auth
        .signInWithPopup(provider)
        .then(result => {
          console.log(result);
          console.log(result.user);

          this.$store.dispatch("onAuthStateChanged", { authUser: result.user });

          // if user not exists, create
          let userRef = this.$fire.firestore
            .collection("users")
            .doc(result.user.uid);

          userRef.get().then(docSnapshot => {
            if (!docSnapshot.exists) {
              userRef.set({
                pomoCount: 0,
                taskCount: 0,
                user: {
                  uid: result.user.uid,
                  email: result.user.email,
                  name: result.user.displayName
                }
              });
            }
          });

          this.message = `Selamat datang, ${this.authUser.name}.`;
          console.log("loggedin");
        })
        .catch(error => {
          console.log("gagal login");
          console.log(error);
        });
    },
    async signOut() {
      await this.$fire.auth.signOut();
      this.message = `Selamat tinggal, ${this.authUser.name}.`;
      this.$store.dispatch("onAuthStateChanged", false);
    },

    getStatistic() {
      let stats = [];
      this.isStatisticOpen = !this.isStatisticOpen;
      this.$fire.firestore
        .collection("users")
        .orderBy("pomoCount", "desc")
        .orderBy("taskCount", "desc")
        .limit(10)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            stats.push(doc.data());
          });
          this.stats = stats;
        });
    }
  }
};
</script>
