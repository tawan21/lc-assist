<script>
  import axios from "axios";
  import Contest from "../components/Contest.svelte";
  import Submissions from "../components/Submissions.svelte";
  import Progress from "../components/Progress.svelte";
  import { onMount } from "svelte";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { db } from "../firebase";
  import { Circle } from "svelte-loading-spinners";
  import { goto } from "$app/navigation";

  let u,
    user = null,
    userDeets = null,
    session = null,
    lcData = null,
    loading = false;

  const getLeetcodeInfo = async () => {
    let response = await axios.get(
      `http://localhost:3000/api/lc/user/${session}`
    );

    lcData = response.data.userStatus;
    user = lcData.username;
    response = await axios.get(`http://localhost:3000/api/lc/username/${user}`);
    userDeets = response.data.data.matchedUser;
  };

  const getSession = async () => {
    const d = await getDoc(doc(db, "lc-session", u.email));
    if (d.exists()) {
      session = d.data().leetcodeSession;
      await getLeetcodeInfo();
    }
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) goto("/profile");
    loading = true;
    u = JSON.parse(sessionStorage.user);
    await getSession();
    await setDoc(
      doc(db, `lc-session/${u.email}`),
      {
        username: user,
      },
      { merge: true }
    );
    loading = false;
  });
</script>

<div class="flex flex-col min-w-full">
  <div
    class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex flex-col items-center pb-10 space-y-5">
      {#if loading}
        <Circle color="orange" size="3" unit="rem" />
      {:else if lcData}
        <img
          alt="avatar"
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={lcData.avatar}
        />
        {#if userDeets.profile.realName}
          <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {userDeets.profile.realName}
          </h5>
        {/if}
        <h5 class="mb-1 font-medium text-gray-900 dark:text-gray-200">
          @{user}
        </h5>
        <span class="text-sm text-gray-500 dark:text-gray-400"
          >Rank <span class="font-bold">{userDeets.profile.ranking}</span></span
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
    background-color: theme(colors.gray.200);
  }
</style>
