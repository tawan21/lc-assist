<script>
  import loader from "@monaco-editor/loader";

  export let lang, code;

  let editor = null;

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
