<script lang="ts">
  export let data;
</script>

<h1 class="text-2xl font-semibold">Dashboard</h1>
<p class="mt-2">Welcome, {data.user?.name || data.user?.email}!</p>
<p class="text-sm mt-2">Role: {data.user?.role}</p>
