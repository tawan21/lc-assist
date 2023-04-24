<script>
  import loader from "@monaco-editor/loader";
  import {
    doc,
    getDoc,
    onSnapshot,
    setDoc,
  } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { db } from "../firebase";

  export let user, lang, bpc, ques, code;

  let editor = null,
    u = "",
    edt = null,
    unsubscribe,
    timer = null,
    done = true;

  $: getSnapshot = () => {
    if (!user || !ques) return;

    unsubscribe = onSnapshot(
      doc(db, `snippets/${user}/${ques}/${lang.value}`),
      (doc) => {
        if (!doc.exists()) return;

        const data = doc.data();
        const author = data.editBy;
        if (author === u) return;

        const lastPos = edt.getPosition();

        if (done) {
          code = data.code;
          edt.getModel().setValue(code);
          edt.setPosition(lastPos);
        }
      }
    );
  };

  const getCode = async () => {
    if (!user || !ques) return;
    const docSnap = await getDoc(
      doc(db, `snippets/${user}/${ques}/${lang.value}`)
    );
    if (docSnap.exists()) {
      code = docSnap.data().code;
    } else code = bpc;
  };

  onMount(async () => {
    if (!sessionStorage.getItem("user")) return;
    u = JSON.parse(sessionStorage.user).email;
    await getCode();
    getSnapshot();
    loader.init().then((monaco) => {
      if (editor) {
        edt = monaco.editor.create(editor, {
          language: lang.value === "python3" ? "python" : lang.value,
          value: code ? code : "print('Pick a Question!')",
          theme: "vs-dark",
          fontSize: "16px",
          minimap: { enabled: false },
          "bracketPairColorization.enabled": true,
          lineNumbersMinChars: 2,
        });

        edt.onDidChangeModelContent(() => {
          code = edt.getValue();
        });
      }
    });
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  const storeCode = async () => {
    if (!user || !ques) return;
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
      storeCode();
    }, 1000);
  };
</script>

<div
  bind:this={editor}
  on:keypress={handleKeyPress}
  on:keyup={handleKeyUp}
  class="animate-fade-in-up min-h-screen min-w-full"
/>
