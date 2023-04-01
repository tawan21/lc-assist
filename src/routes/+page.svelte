<script>
  import axios from "axios";
  import "../app.css";
  import Navbar from "../components/Navbar.svelte";
  import Contest from "../components/Contest.svelte";
  import Submissions from "../components/Submissions.svelte";
  import Progress from "../components/Progress.svelte";
  import { onMount } from "svelte";
  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../firebase";

  let user = null,
    session = null,
    lcData = null;

  const getLeetcodeInfo = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/user/${session}`
    );

    lcData = response.data.userStatus;
    user = lcData.username;
  };

  const getSession = async () => {
    const u = JSON.parse(sessionStorage.user);
    const d = await getDoc(doc(db, "lc-session", u.email));
    if (d.exists()) {
      session = d.data().leetcodeSession;
      getLeetcodeInfo();
    }
  };

  onMount(() => {
    getSession();
  });
</script>

<div class="flex flex-col min-w-full">
  <div
    class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex flex-col items-center pb-10 space-y-5">
      {#if lcData}
        <img
          alt="avatar"
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={lcData.avatar}
        />
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          @{user}
        </h5>
        <span class="text-sm text-gray-500 dark:text-gray-400"
          >#{lcData.userId}</span
        >
      {/if}
    </div>
    {#if user}
      <Contest {user} />
      <Progress {user} />
      <Submissions {user} />
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.300);
  }
</style>
