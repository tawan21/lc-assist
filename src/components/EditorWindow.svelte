<script>
  import loader from "@monaco-editor/loader";
  import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
  } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "../firebase";

  export let user, lang, bpc, ques;

  let editor = null,
    code = "",
    oldCode = "",
    exists = false,
    edt = null,
    unsubscribe = null,
    timer = null,
    done = true;

  const getSnapshot = () => {
    unsubscribe = onSnapshot(
      doc(db, `snippets/${user.email}/${ques}/${lang.value}`),
      (doc) => {
        code = doc.data().code;
        if (code !== oldCode) {
          console.log(code);
          if (done) {
            edt.getModel().setValue(code);
            oldCode = code;
          }
        }
      }
    );
  };

  const getCode = async () => {
    const docSnap = await getDoc(
      doc(db, `snippets/${user.email}/${ques}/${lang.value}`)
    );
    if (docSnap.exists()) {
      exists = true;
      code = docSnap.data().code;
      oldCode = code;
    } else code = bpc;
  };

  onMount(async () => {
    user = JSON.parse(sessionStorage.user);
    await getCode();
    if (exists) getSnapshot();
    loader.init().then((monaco) => {
      edt = monaco.editor.create(editor, {
        language: lang.value === "python3" ? "python" : lang.value,
        value: code,
        theme: "vs-dark",
      });

      edt.onDidChangeModelContent(() => {
        code = edt.getValue();
      });
    });
  });

  onDestroy(() => {
    if (exists) unsubscribe();
  });

  const storeCode = async () => {
    await setDoc(
      doc(db, `snippets/${user.email}/${ques}/${lang.value}`),
      {
        code: code,
        updated: new Date(),
      },
      { merge: true }
    );
  };

  const handleKeyPress = (e) => {
    done = false;
    clearTimeout(timer);
  };

  const handleKeyUp = (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      done = true;
      if (code !== oldCode) {
        console.log(code);
        storeCode();
        oldCode = code;
      }
    }, 1000);
  };
</script>

<div
  bind:this={editor}
  on:keypress={handleKeyPress}
  on:keyup={handleKeyUp}
  class="min-h-screen min-w-full"
/>
