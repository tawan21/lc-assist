<script>
  import loader from "@monaco-editor/loader";
  import { collection, doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "../firebase";

  export let user, lang, code, ques;

  let editor = null;

  onMount(() => {
    user = JSON.parse(sessionStorage.user);
    storeCode();
  });

  const storeCode = async () => {
    await setDoc(doc(db, `snippets/${user.email}/${ques}/${lang}`), {
      code: code,
      updated: serverTimestamp(),
    });
  };

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        code = data;
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleChange = (value) => {
    onChange("code", value);
  };

  loader.init().then((monaco) => {
    monaco.editor.create(editor, {
      language: lang.value === "python3" ? "python" : lang.value,
      value: code,
      theme: "vs-dark",
    });
  });
</script>

<div bind:this={editor} class="min-h-screen min-w-full" />
