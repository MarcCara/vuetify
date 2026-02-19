<template>
  <v-container>
    <h1 class="text-h3 text-center mb-6">Sistema de Votacions</h1>
    
    <!-- User info display is good practice -->
    <div class="d-flex align-center justify-end mb-4">
      <v-avatar size="40" class="mr-2">
        <v-img :src="store.loginInfo.image" alt="Profile"></v-img>
      </v-avatar>
      <span>{{ store.loginInfo.username }}</span>
    </div>

    <!-- Chart from user provided snippet -->
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- Voting Buttons -->
    <v-row class="mt-8" justify="center" v-if="isConnected">
      <BotoVotar
        v-for="(votos, index) in store.votos"
        :key="index"
        :vots="votos"
        :label="`Click to Vote`"
        @votar="handleVote(index)"
      />
    </v-row>
    <v-alert v-else type="warning" class="mt-4">
      Connecting to server...
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';
// Import BotoVotar component explicitly if not auto-registered
// Assuming auto-import via unplugin-vue-components if configured, but safe to import.
import BotoVotar from '@/components/BotoVotar.vue';

const store = useAppStore();
const router = useRouter();

// --- Auth Guard ---
onMounted(() => {
  if (!store.isLoggedIn) {
    router.replace('/');
  }
});

// --- WebSocket Management ---
const socket = ref(null);
const isConnected = ref(false);

function connectWebSocket() {
  // Use location.hostname for docker/network compatibility, default port 3000
  // Or hardcode localhost for local dev if not running via docker network setup
  // Since we run local dev separately usually: localhost:3000
  // But inside Docker they might be on same network.
  // For now localhost:3000 is safe for browser access.
  socket.value = new WebSocket('ws://localhost:3000');
  
  socket.value.onopen = () => {
    console.log('Connected to WebSocket server');
    isConnected.value = true;
  };

  socket.value.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'UPDATE_VOTOS') {
        store.setVotos(message.data);
      }
    } catch (e) {
      console.error('Error parsing WebSocket message:', e);
    }
  };

  socket.value.onclose = () => {
    console.log('Disconnected from WebSocket server');
    isConnected.value = false;
    // Simple reconnect logic could be added here
  };
}

function handleVote(index) {
  if (socket.value && socket.value.readyState === WebSocket.OPEN) {
    socket.value.send(JSON.stringify({ type: 'VOTAR', index }));
  }
}

onMounted(() => {
  if (store.isLoggedIn) {
     connectWebSocket();
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
  }
});

// --- Chart Logic (Provided by User) ---
const chartCanvas = ref(null);
let chartInstance = null;

const chartData = ref({
  labels: ['Opció 1', 'Opció 2', 'Opció 3', 'Opció 4'],
  datasets: [{
    label: 'Vots',
    data: store.votos,
    backgroundColor: [
      'rgba(75, 192, 192, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
    ],
  }],
});

onMounted(() => {
  if (chartCanvas.value && store.isLoggedIn) {
    const ctx = chartCanvas.value.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar', // Using bar chart as implied by user snippet context (though snippet said "bar")
      data: chartData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
                stepSize: 1
            }
          },
        },
      },
    });
  }
});

watch(() => store.votos, (newVotos) => {
  if (chartInstance) {
    chartInstance.data.datasets[0].data = [...newVotos]; // Spread for reactivity safety
    chartInstance.update();
  }
}, { deep: true });

</script>

<style scoped>
.chart-container {
  position: relative;
  height: 50vh;
  width: 90vw;
  max-width: 800px;
  margin: 20px auto;
}
</style>
