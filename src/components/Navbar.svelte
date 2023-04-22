<script>
  import { auth, googleProvider } from "../firebase";
  import {
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    getAuth,
    setPersistence,
    browserSessionPersistence,
  } from "firebase/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let expanded = false,
    pg = "";

  export let loggedIn;

  onMount(() => {
    loggedIn = sessionStorage.getItem("user") !== null;
  });

  const login = () => {
    const auth = getAuth();
    setPersistence(auth, browserSessionPersistence).then(() => {
      return signInWithPopup(auth, googleProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const usr = result.user;
          sessionStorage.user = JSON.stringify(usr);
          loggedIn = true;
          goto("/profile");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        loggedIn = false;
        sessionStorage.removeItem("user");
        goto("/profile");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onMount(() => {
    pg = $page.route.id;
  });
</script>

<nav class="bg-lcdull sticky top-0 z-50">
  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
      <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <!-- Mobile menu button-->
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-controls="mobile-menu"
          aria-expanded="false"
          on:click={() => {
            expanded = !expanded;
          }}
        >
          <span class="sr-only">Open main menu</span>
          {#if expanded}
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          {:else}
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          {/if}
        </button>
      </div>
      <div
        class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
      >
        <div class="flex flex-shrink-0 items-center">
          <span class="uppercase text-white font-semibold text-sm sm:text-base"
            >LeetCode Assistant</span
          >
        </div>
        <div class="hidden sm:ml-6 sm:block">
          <div class="flex space-x-4">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a
              href="/"
              class={`${
                pg === "/"
                  ? "bg-lc text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } rounded-md px-3 py-2 text-sm font-medium`}
              aria-current="page"
              data-sveltekit-preload-data="tap">Dashboard</a
            >
            <a
              href="/profile"
              class={`${
                pg === "/profile"
                  ? "bg-lc text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } rounded-md px-3 py-2 text-sm font-medium`}
              aria-current="page"
              data-sveltekit-preload-data="tap">Profile</a
            >
            <a
              href="/question"
              class={`${
                pg === "/question"
                  ? "bg-lc text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } rounded-md px-3 py-2 text-sm font-medium`}
              aria-current="page"
              data-sveltekit-preload-data="tap">Solve</a
            >
            <a
              href="/friends"
              class={`${
                pg === "/friends"
                  ? "bg-lc text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              } rounded-md px-3 py-2 text-sm font-medium`}
              aria-current="page"
              data-sveltekit-preload-data="tap">Friends</a
            >
          </div>
        </div>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
      >
        <!-- Profile dropdown -->
        <div class="relative ml-3">
          <div class="flex space-x-2">
            {#if loggedIn}
              <button
                type="button"
                class="flex text-red-400 border-2 border-white hover:bg-red-600 hover:text-white border-opacity-20 px-1 sm:px-2 py-1 rounded-full bg-lc text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                on:click={logout}
                >Logout
              </button>
            {:else}
              <button
                type="button"
                class="flex text-green-400 border-2 border-white hover:bg-green-600 hover:text-white border-opacity-20 px-1 sm:px-2 py-1 rounded-full bg-lc text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
                on:click={login}
                >Login
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <div class="sm:hidden" id="mobile-menu">
    {#if expanded}
      <div class="space-y-1 px-2 pt-2 pb-3">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <a
          href="/"
          class={`${
            pg === "/"
              ? "bg-lc text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } rounded-md px-2 py-1 text-xs font-medium`}
          aria-current="page"
          data-sveltekit-preload-data="tap">Dashboard</a
        >
        <a
          href="/profile"
          class={`${
            pg === "/profile"
              ? "bg-lc text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } rounded-md px-2 py-1 text-xs font-medium`}
          aria-current="page"
          data-sveltekit-preload-data="tap">Profile</a
        >
        <a
          href="/question"
          class={`${
            pg === "/question"
              ? "bg-lc text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } rounded-md px-2 py-1 text-xs font-medium`}
          aria-current="page"
          data-sveltekit-preload-data="tap">Solve</a
        >
        <a
          href="/friends"
          class={`${
            pg === "/friends"
              ? "bg-lc text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } rounded-md px-2 py-1 text-xs font-medium`}
          aria-current="page"
          data-sveltekit-preload-data="tap">Friends</a
        >
      </div>
    {/if}
  </div>
</nav>
