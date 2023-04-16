<script>
  import axios from "axios";
  import Contest from "../../../components/Contest.svelte";
  import Progress from "../../../components/Progress.svelte";
  import Submissions from "../../../components/Submissions.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { Circle } from "svelte-loading-spinners";
  import { collection, getDocs, query, where } from "firebase/firestore";
  import { db } from "../../../firebase";

  let user = $page.params.slug,
    userDeets = null,
    e,
    loading = true;

  const getLeetcodeInfo = async () => {
    const response = await axios.get(
      `http://localhost:3000/api/lc/username/${user}`
    );
    userDeets = response.data.data.matchedUser;
  };

  onMount(async () => {
    await getLeetcodeInfo();
    const f = await getDocs(
      query(collection(db, "usernames"), where("username", "==", user))
    );
    f.forEach((doc) => (e = doc.exists()));
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
      {:else if userDeets}
        <img
          alt="avatar"
          class="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={userDeets.profile.userAvatar}
        />
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {userDeets.profile.realName}
        </h5>
        <h5 class="mb-1 font-medium text-gray-900 dark:text-gray-200">
          @{user}
          {#if e}<span class="text-green-600">LA user</span>{/if}
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
