<template>
  <HeaderBlock />
  <img alt="logo" :src="logo" />
  <div v-if="!isLoggedIn" class="login">
    <h2>登入</h2>
    <form label="表單" @submit.prevent="handleLogin">
      <div>
        <label for="account"
          >帳號：
          <input
            id="account"
            aria-label="accountLabel"
            v-model="username"
            required
          />
        </label>
      </div>
      <div>
        <label for="password"
          >密碼：
          <input id="password" type="password" v-model="password" required />
        </label>
      </div>
      <button type="submit">登入</button>
    </form>
  </div>

  <div v-else>
    <h1>商品列表</h1>
    <ul>
      <li v-for="item in products" :key="item.id">
        {{ item.title }}
      </li>
    </ul>

    <div @click="handleLogout()">登出</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { getProducts } from '@/api/products'
import { login } from '@/api/login'
import logo from '@/assets/vue.svg'
import { commonStore } from '@/stores/common'

const store = commonStore()

const HeaderBlock = defineAsyncComponent(() => import('remote_app/Header'))

const username = ref('')
const password = ref('')
const isLoggedIn = computed(() => store.isLoggedIn)
const products = ref([])

const handleLogin = async () => {
  const result = await store.handleLogin(username.value, password.value)
  if (result) {
    await loadProducts()
  }
}

const handleLogout = async () => {
  await store.clearToken()
}

const loadProducts = async () => {
  try {
    products.value = await getProducts()
  } catch (err) {
    console.error('商品載入失敗', err)
  }
}

onMounted(() => {
  if (isLoggedIn) loadProducts()
})
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.login input {
  width: 100%;
  margin: 8px 0;
  padding: 8px;
}
.login button {
  padding: 8px 16px;
}
</style>
