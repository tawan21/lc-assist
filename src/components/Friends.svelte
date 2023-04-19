<script>
  import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    setDoc,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../firebase";
  import { Circle } from "svelte-loading-spinners";
  import { goto } from "$app/navigation";

  let mail = "",
    friends = [],
    loading = false,
    user = null;

  const getFriends = async () => {
    const collec = await getDocs(
      query(collection(db, `users/${user.email}/friends`), orderBy("added"))
    );
    const f = [];
    collec.forEach((doc) => {
      const data = doc.data();
      f.push({ mail: data.mail, added: data.added });
    });
    friends = f;
  };

  const addFriend = async () => {
    const dt = new Date();
    friends = [...friends, { mail: mail, added: { seconds: dt / 1000 } }];
    await setDoc(
      doc(db, `users/${user.email}/friends/${mail}`),
      {
        mail: mail,
        added: dt,
      },
      { merge: true }
    );
  };

  const removeFriend = async (d) => {
    const idx = friends.findIndex((o) => o.mail === d);
    friends.splice(idx, 1);
    friends = friends;
    await deleteDoc(doc(db, `users/${user.email}/friends/${d}`));
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) goto("/profile");
    user = JSON.parse(sessionStorage.user);
    loading = true;
    await getFriends();
    loading = false;
  });
</script>

<div
  class="min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col"
>
  <div class="flex flex-col pb-10 justify-center space-y-5 text-white">
    {#if loading}
      <Circle color="orange" size="3" unit="rem" />
    {:else}
      {#key friends}
        <div>
          {#each friends as friend}
            <div
              class="flex justify-around items-center overflow-auto min-w-full mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            >
              <div class="flex flex-col py-3">
                <span
                  class="font-bold text-xs sm:text-2xl flex flex-col items-center pb-10 mr-1"
                  >{friend.mail}</span
                >
                <span class="text-xs"
                  >added <span class="font-bold"
                    >{new Date(friend.added.seconds * 1000).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}</span
                  ></span
                >
              </div>
              <button
                on:click={() => {
                  sessionStorage.friend = friend.mail;
                  goto("/chat");
                }}
                type="button"
                class="bg-violet-500 mb-3 hover:bg-violet-700 sm:font-semibold px-4 py-2 rounded-full focus:outline-none focus:shadow-outline"
                >Chat</button
              >
              <button
                on:click={removeFriend(friend.mail)}
                type="button"
                class="bg-red-500 mb-3 hover:bg-red-700 sm:font-semibold p-1 rounded-full focus:outline-none focus:shadow-outline"
                ><svg
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
                </svg></button
              >
            </div>
          {/each}
        </div>
      {/key}
    {/if}
  </div>

  <input
    type="text"
    class="shadow mb-3 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline"
    placeholder="Friend's Gmail"
    bind:value={mail}
  />
  <button
    type="button"
    class="bg-blue-500 mb-3 hover:enabled:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xs sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
    on:click={addFriend}
    disabled={!mail.endsWith("@gmail.com") || mail.startsWith("@")}>Add</button
  >
</div>
