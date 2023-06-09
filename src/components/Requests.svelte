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

  let requests = [],
    loading = false,
    user = null;

  export let friends;

  const getRequests = async () => {
    const collec = await getDocs(
      query(collection(db, `users/${user.email}/requests`), orderBy("added"))
    );
    const f = [];
    collec.forEach((doc) => {
      const data = doc.data();
      f.push({ mail: data.mail, added: data.added });
    });
    requests = f;
  };

  const addFriend = async (mail) => {
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
    await setDoc(
      doc(db, `users/${mail}/friends/${user.email}`),
      {
        mail: user.email,
        added: dt,
      },
      { merge: true }
    );
    await removeRequest(mail);
  };

  const removeRequest = async (d) => {
    const idx = requests.findIndex((o) => o.mail === d);
    requests.splice(idx, 1);
    requests = requests;
    await deleteDoc(doc(db, `users/${user.email}/requests/${d}`));
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) goto("/profile");
    user = JSON.parse(sessionStorage.user);
    loading = true;
    await getRequests();
    loading = false;
  });
</script>

<div>
  <h5 class="text-xl text-black dark:text-white font-semibold ml-2">
    Requests
  </h5>
  <div
    class="animate-fade-in-up min-w-full text-center mt-3 px-4 pt-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-lcdull flex flex-col dark:border-0"
  >
    <div
      class="flex flex-col pb-10 justify-center space-y-5 text-gray-900 dark:text-white"
    >
      {#if loading}
        <div class="flex justify-center">
          <Circle color="orange" size="3" unit="rem" />
        </div>
      {:else if requests.length > 0}
        {#key requests}
          <div>
            {#each requests as friend}
              <div
                class="animate-fade-in-up grid grid-cols-3 justify-around items-center overflow-auto min-w-full mt-3 p-2 max-w-sm bg-gray-100 border border-gray-300 rounded-lg shadow dark:bg-lc dark:border-0"
              >
                <div class="flex flex-col py-3 space-y-2 col-span-2">
                  <span
                    class="font-bold text-xs sm:text-xl flex flex-col items-center pb-5 mr-1"
                    >{friend.mail}</span
                  >
                  <span class="text-xs"
                    >requested <span class="font-bold"
                      >{new Date(friend.added.seconds * 1000).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour12: false,
                        }
                      )}</span
                    ></span
                  >
                </div>
                <div class="flex flex-col sm:flex-row sm:space-x-5">
                  <button
                    on:click={addFriend(friend.mail)}
                    type="button"
                    class="bg-green-500 text-xs sm:text-base mb-3 hover:bg-green-700 sm:font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-full focus:outline-none focus:shadow-outline"
                    >Allow</button
                  >
                  <button
                    on:click={removeRequest(friend.mail)}
                    type="button"
                    class="bg-red-500 text-xs sm:text-base mb-3 hover:bg-red-700 sm:font-semibold px-2 sm:px-4 py-1 sm:py-2 rounded-full focus:outline-none focus:shadow-outline"
                    >Remove</button
                  >
                </div>
              </div>
            {/each}
          </div>
        {/key}
      {:else}
        <h5
          class="text-xl font-medium text-gray-900 text-center dark:text-white"
        >
          NO Requests
        </h5>
      {/if}
    </div>
  </div>
</div>
