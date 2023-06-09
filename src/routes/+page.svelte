<script>
  import Contest from "../components/Contest.svelte";
  import Submissions from "../components/Submissions.svelte";
  import Progress from "../components/Progress.svelte";
  import { onMount } from "svelte";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "../firebase";
  import { goto } from "$app/navigation";
  import IntersectionObserver from "svelte-intersection-observer";

  let u,
    user = null,
    userDeets = null,
    session = null,
    lcData = null,
    loading = false,
    node;

  const getLeetcodeInfo = async () => {
    let response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({ session }),
    });

    response = await response.json();
    lcData = response.data.userStatus;
    user = lcData.username;
    response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ user }),
    });
    response = await response.json();
    userDeets = response.data.matchedUser;
  };

  const getSession = async () => {
    session = sessionStorage.session;
    await getLeetcodeInfo();
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("phrase"))
      goto("/profile");
    loading = true;
    u = JSON.parse(sessionStorage.user);
    await getSession();
    await setDoc(
      doc(db, `lc-session/${u.email}`),
      {
        username: user,
        updated: new Date(),
      },
      { merge: true }
    );
    loading = false;
  });
</script>

<svelte:head>
  <title>Dashboard - LC Assistant</title>
</svelte:head>
<div class="flex flex-col min-w-full">
  <div class="min-w-full mt-3 px-4 pt-4 max-w-sm">
    <div class="flex flex-col items-center pb-10 space-y-5">
      {#if loading}
        <div class="animate-pulse flex flex-col">
          <div class="rounded-full mb-7 bg-lcdull h-24 w-24" />
          <div class="grid grid-cols-3 gap-9">
            <div class="h-2 bg-lcdull rounded col-span-3" />
            <div class="h-2 bg-lcdull rounded col-span-3" />
            <div class="h-2 bg-lcdull rounded col-span-3" />
          </div>
        </div>
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
        <span class="text-sm text-gray-400 dark:text-gray-200"
          >Rank <span class="font-bold">{userDeets.profile.ranking}</span></span
        >
      {/if}
    </div>
    {#if user}
      <Contest {user} />
      <IntersectionObserver once let:intersecting element={node}>
        <div bind:this={node}>
          {#if intersecting}
            <Progress {user} />
            <Submissions {user} />
          {/if}
        </div>
      </IntersectionObserver>
    {/if}
  </div>
</div>
