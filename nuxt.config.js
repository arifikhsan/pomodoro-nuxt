export default {
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    "@nuxtjs/tailwindcss"
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/firebase"],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  firebase: {
    config: {
      apiKey: "AIzaSyB7QOBjjxpnW0ka6tokH_6CDL_m5gbrKV4",
      authDomain: "pomodoro-nuxt.firebaseapp.com",
      projectId: "pomodoro-nuxt",
      storageBucket: "pomodoro-nuxt.appspot.com",
      messagingSenderId: "793184956075",
      appId: "1:793184956075:web:81c77c182adb1b85fd11ee",
      measurementId: "G-QRQJZEVZJ9"
    },
    services: {
      auth: true,
      firestore: true
    }
  }
};
