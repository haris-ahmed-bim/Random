<script lang="ts">
  import { page } from '$app/stores';
</script>

<h1 class="text-2xl font-semibold mb-4">Login</h1>
<form method="POST" action="/api/auth/signin/credentials" class="space-y-3 max-w-sm">
  <input name="callbackUrl" type="hidden" value="/dashboard" />
  <div><input class="w-full border p-2 rounded" name="email" type="email" placeholder="Email" required /></div>
  <div><input class="w-full border p-2 rounded" name="password" type="password" placeholder="Password" required /></div>
  <button class="w-full p-2 bg-black text-white rounded">Sign In</button>
</form>

<div class="my-4 text-center text-sm">or</div>
<div class="flex gap-2">
  <a class="border p-2 rounded" href="/api/auth/signin/github">Continue with GitHub</a>
  <a class="border p-2 rounded" href="/api/auth/signin/google">Continue with Google</a>
</div>

<p class="mt-4 text-sm">No account? <a class="underline" href="/signup">Sign up</a></p>
<p class="mt-2 text-sm"><a class="underline" href="/password-reset">Forgot password?</a></p>
