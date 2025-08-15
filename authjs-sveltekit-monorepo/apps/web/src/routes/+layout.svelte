<script lang="ts">
  export let data;
  let dark = false;
  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
  }
</script>

<link rel="stylesheet" href="/app.css" />
<div class="max-w-5xl mx-auto p-4">
  <header class="flex items-center justify-between py-4">
    <a href="/" class="font-semibold">Auth.js App</a>
    <nav class="flex gap-3 text-sm">
      <a href="/chat">Chat</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/admin">Admin</a>
      {#if data.session?.user}
        <form method="POST" action="/api/auth/signout"><button class="underline">Logout</button></form>
      {:else}
        <a href="/login" class="underline">Login</a>
      {/if}
      <button class="px-2 py-1 border rounded" on:click={toggleTheme}>Theme</button>
    </nav>
  </header>
  <slot />
</div>
