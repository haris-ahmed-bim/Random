<script lang="ts">
  let name = '', email = '', password = '';
  let msg = '';
  async function submit(e: Event) {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    msg = res.ok ? 'Signup successful! Check your email to verify.' : (data.error?.message || data.error || 'Failed');
  }
</script>

<h1 class="text-2xl font-semibold mb-4">Sign up</h1>
<form class="space-y-3 max-w-sm" on:submit|preventDefault={submit}>
  <input class="w-full border p-2 rounded" bind:value={name} placeholder="Name" required />
  <input class="w-full border p-2 rounded" bind:value={email} type="email" placeholder="Email" required />
  <input class="w-full border p-2 rounded" bind:value={password} type="password" placeholder="Password (min 6)" minlength="6" required />
  <button class="w-full p-2 bg-black text-white rounded">Create Account</button>
</form>
{#if msg}<p class="mt-3 text-sm">{msg}</p>{/if}
