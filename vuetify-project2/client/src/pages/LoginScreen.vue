<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h5 mb-4">
            Login
          </v-card-title>
          
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="Username"
              prepend-inner-icon="mdi-account"
              variant="outlined"
            ></v-text-field>
            
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
            ></v-text-field>
            
            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              variant="tonal"
            >
              {{ error }}
            </v-alert>
            
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
            >
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';

const router = useRouter();
const store = useAppStore();

const username = ref('');
const password = ref('');
const error = ref('');

function handleLogin() {
  if (username.value === 'user' && password.value === '123') {
    store.setLoginInfo({
      loggedIn: true,
      username: username.value,
      image: 'https://cdn.vuetifyjs.com/images/john.jpg', // Dummy image
    });
    router.push('/votacions');
  } else {
    error.value = 'Invalid credentials';
  }
}
</script>
