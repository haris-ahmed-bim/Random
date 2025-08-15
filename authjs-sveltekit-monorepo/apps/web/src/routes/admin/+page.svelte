<script lang="ts">
  export let data;
  async function setRole(id: number, role: string) {
    await fetch(`/api/admin/users/${id}/role`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ role }) });
    location.reload();
  }
  async function setStatus(id: number, disabled: boolean) {
    await fetch(`/api/admin/users/${id}/status`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ disabled }) });
    location.reload();
  }
</script>

<h1 class="text-2xl font-semibold">Admin</h1>
<p class="text-sm mt-1">Total users: {data.stats.total} — Disabled: {data.stats.disabled}</p>
<table class="w-full mt-4 text-sm border">
  <tr class="bg-gray-100 dark:bg-gray-800">
    <th class="p-2 text-left">ID</th><th class="p-2 text-left">Name</th><th class="p-2 text-left">Email</th><th class="p-2">Role</th><th class="p-2">Disabled</th><th class="p-2">Actions</th>
  </tr>
  {#each data.users as u}
  <tr class="border-t">
    <td class="p-2">{u.id}</td>
    <td class="p-2">{u.name}</td>
    <td class="p-2">{u.email}</td>
    <td class="p-2">{u.role}</td>
    <td class="p-2">{u.disabled ? 'Yes' : 'No'}</td>
    <td class="p-2 space-x-2">
      <button class="px-2 py-1 border rounded" on:click={() => setRole(u.id, u.role === 'admin' ? 'user' : 'admin')}>Toggle Role</button>
      <button class="px-2 py-1 border rounded" on:click={() => setStatus(u.id, !u.disabled)}>{u.disabled ? 'Enable' : 'Disable'}</button>
    </td>
  </tr>
  {/each}
</table>
