<script>
  import { doc, onSnapshot, setDoc } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "../../firebase";
  import { v4 as uuidv4 } from "uuid";

  let messages = [],
    message = "",
    user,
    friend,
    participants,
    unsubscribe;

  const sendMsg = async () => {
    messages = [
      ...messages,
      {
        message: message,
        sentBy: user.email,
      },
    ];

    await setDoc(
      doc(db, "chat-rooms", `[${participants[0]},${participants[1]}]`),
      {
        id: uuidv4(),
        messages: messages,
      },
      { merge: true }
    );

    message = "";
  };

  onMount(async () => {
    user = JSON.parse(sessionStorage.user);
    friend = sessionStorage.friend;
    participants = [user.email, friend];
    participants.sort();
    unsubscribe = onSnapshot(
      doc(db, `chat-rooms/[${participants[0]},${participants[1]}]`),
      (doc) => {
        if (doc.exists()) messages = doc.data().messages;
      }
    );
  });

  onDestroy(() => unsubscribe());
</script>

<main>
  <div class="flex min-w-full justify-center items-center">
    <div class="flex min-w-full flex-col bg-slate-900 px-8 py-8 rounded-lg">
      <div class="mb-4">
        <h5 class="font-bold text-gray-50 text-3xl text-center">Chat</h5>
        <p class="text-gray-400 text-center">with {friend}</p>
      </div>
      <div
        class="max-h-screen overflow-auto mb-4 bg-gray-300 rounded-md px-4 py-4"
      >
        {#each messages as message}
          <div
            class={`flex flex-col ${
              message.sentBy === user.email ? "items-end" : "items-start"
            }`}
          >
            <div
              class={`w-fit px-4 py-2 mb-2 ${
                message.sentBy === user.email ? "bg-pink-700" : "bg-violet-700"
              } rounded-md font-semibold text-white`}
            >
              {message.message}
            </div>
          </div>
        {/each}
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
          class="rounded-md px-3 py-2 bg-pink-700 text-gray-50 border-0 ml-2"
          >Send</button
        >
      </div>
    </div>
  </div>
</main>
