<script lang="ts">
  import { onMount } from 'svelte';
  type Msg = { role: 'user'|'assistant', content: string };
  let input = '';
  let messages: Msg[] = [];
  let loading = false;

  async function send() {
    if (!input.trim()) return;
    messages = [...messages, { role: 'user', content: input }];
    const payload = { messages: messages.map(m => ({ role: m.role, content: m.content })), stream: false };
    input = '';
    loading = true;
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    loading = false;
    if (res.ok) {
      const data = await res.json();
      messages = [...messages, { role: 'assistant', content: data.text }];
    }
  }
</script>

<h1 class="text-2xl font-semibold mb-3">AI Chat</h1>
<div class="border rounded p-3 space-y-3">
  {#each messages as m}
    <div class="p-2 rounded {m.role === 'user' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}">
      <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.content}
    </div>
  {/each}
  {#if loading}<div class="text-sm opacity-70">Thinking…</div>{/if}
</div>
<div class="mt-3 flex gap-2">
  <input class="flex-1 border p-2 rounded" bind:value={input} placeholder="Ask something…" on:keydown={(e) => e.key === 'Enter' && send()} />
  <button class="p-2 bg-black text-white rounded" on:click={send}>Send</button>
</div>
