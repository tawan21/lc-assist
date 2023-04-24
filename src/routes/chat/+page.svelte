<script>
  import { doc, onSnapshot, setDoc } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "../../firebase";

  let messages = [],
    message = "",
    user,
    friend,
    participants,
    unsubscribe;

  $: if (user) {
    unsubscribe = onSnapshot(
      doc(db, `chat-rooms/${participants[0]},${participants[1]}`),
      (doc) => {
        if (doc.exists()) {
          messages = doc.data().messages;
          nm.focus();
        }
      }
    );
  }

  const sendMsg = async () => {
    messages = [
      ...messages,
      {
        message: message,
        sentBy: user.email,
        time: { seconds: new Date() / 1000 },
      },
    ];

    await updateMsgs();

    message = "";
  };

  const updateMsgs = async () => {
    await setDoc(
      doc(db, "chat-rooms", `${participants[0]},${participants[1]}`),
      {
        messages: messages,
      },
      { merge: true }
    );
  };

  onMount(async () => {
    user = JSON.parse(sessionStorage.user);
    friend = sessionStorage.friend;
    participants = [user.email, friend];
    participants.sort();
  });

  const getDate = (cd, pd) => {
    const dd = new Date(cd * 1000).getDate() - new Date(pd * 1000).getDate();

    return dd;
  };

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });
</script>

<svelte:head>
  <title>Chat - LC Assistant</title>
</svelte:head>
<main>
  <div class="flex min-w-full justify-center items-center">
    <div class="flex min-w-full flex-col bg-lcdull p-4 sm:p-8 rounded-lg">
      <div class="mb-4">
        <h5 class="font-bold text-gray-50 text-2xl sm:text-3xl text-center">
          Chat
        </h5>
        <p class="text-gray-400 text-sm sm:text-base text-center">
          with {friend}
        </p>
      </div>
      <div
        class="max-h-screen text-center mb-4 bg-gray-300 rounded-md px-4 py-4 flex flex-col-reverse overflow-auto"
      >
        <div>
          {#each messages as message, i}
            {#if i}
              {#if getDate(message.time.seconds, messages[i - 1].time.seconds) > 0}
                <div class="flex justify-center">
                  <div
                    class="text-xs sm:text-sm mt-6 text-white text-center px-2 py-1 rounded-full bg-gray-600"
                  >
                    {new Date(message.time?.seconds * 1000).toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                      }
                    )}
                  </div>
                </div>
              {/if}
            {:else}
              <span
                class="text-xs sm:text-sm text-white px-2 py-1 rounded-full bg-gray-600"
              >
                {new Date(message.time?.seconds * 1000).toLocaleString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                  }
                )}
              </span>
            {/if}
            <div
              class={`flex flex-col mt-3 ${
                message.sentBy === user.email ? "items-end" : "items-start"
              }`}
            >
              <div
                class={`w-fit px-3 py-1.5 ${
                  message.sentBy === user.email
                    ? "bg-pink-700 text-right rounded-l-xl rounded-tr-xl"
                    : "bg-violet-700 text-left rounded-r-xl rounded-tl-xl"
                } sm:font-semibold text-white`}
              >
                {message.message}
              </div>
              <span
                class={`text-gray-700 text-xs ${
                  message.sentBy === user.email ? "mr-1" : "ml-1"
                }`}
              >
                {new Date(message.time?.seconds * 1000).toLocaleString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }
                )}
              </span>
            </div>
          {/each}
        </div>
      </div>
      <div class="w-full flex">
        <input
          bind:value={message}
          class="rounded-md px-2 py-2 w-full border-0"
          placeholder="Message..."
          type="text"
        />
        <button
          on:click={sendMsg}
          disabled={message === ""}
          class="rounded-md px-3 py-2 bg-pink-700 hover:enabled:bg-pink-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-50 border-0 ml-2"
          >Send</button
        >
      </div>
    </div>
  </div>
</main>
