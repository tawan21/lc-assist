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

  export let user,
    lang,
    bpc,
    ques,
    code = "";

  let editor = null,
    oldCode = "",
    exists = false,
    u = "",
    edt = null,
    unsubscribe = null,
    timer = null,
    done = true;

  const getSnapshot = () => {
    unsubscribe = onSnapshot(
      doc(db, `snippets/${user}/${ques}/${lang.value}`),
      (doc) => {
        const lastPos = edt.getPosition();
        code = doc.data().code;
        if (code !== oldCode) {
          console.log(code);
          if (done) {
            edt.getModel().setValue(code);
            edt.setPosition(lastPos);
            oldCode = code;
          }
        }
      }
    );
  };

  const getCode = async () => {
    const docSnap = await getDoc(
      doc(db, `snippets/${user}/${ques}/${lang.value}`)
    );
    if (docSnap.exists()) {
      exists = true;
      code = docSnap.data().code;
      oldCode = code;
    } else code = bpc;
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) return;
    u = JSON.parse(sessionStorage.user).email;
    await getCode();
    if (exists) getSnapshot();
    loader.init().then((monaco) => {
      edt = monaco.editor.create(editor, {
        language: lang.value === "python3" ? "python" : lang.value,
        value: code,
        theme: "vs-dark",
        "bracketPairColorization.enabled": true,
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
      doc(db, `snippets/${user}/${ques}/${lang.value}`),
      {
        code: code,
        updated: new Date(),
        editBy: u,
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
