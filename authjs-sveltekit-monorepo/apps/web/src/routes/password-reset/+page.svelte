<script lang="ts">
  import { page } from '$app/stores';
  let email = '';
  let token = '';
  let password = '';
  let sent = false;
  $: token = $page.url.searchParams.get('token') || '';
  async function requestLink() {
    const res = await fetch('/api/password/reset/request', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    sent = true;
  }
  async function resetPassword() {
    const res = await fetch('/api/password/reset/confirm', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    if (res.ok) location.href = '/login';
  }
</script>

<h1 class="text-2xl font-semibold mb-4">Password Reset</h1>
{#if !token}
  <div class="space-y-3 max-w-sm">
    <input class="w-full border p-2 rounded" bind:value={email} type="email" placeholder="Your email" />
    <button class="p-2 bg-black text-white rounded" on:click={requestLink}>Send reset link</button>
    {#if sent}<p class="text-sm">If the email exists, a link was sent.</p>{/if}
  </div>
{:else}
  <div class="space-y-3 max-w-sm">
    <input class="w-full border p-2 rounded" bind:value={password} type="password" placeholder="New password" minlength="6"/>
    <button class="p-2 bg-black text-white rounded" on:click={resetPassword}>Set new password</button>
  </div>
{/if}
