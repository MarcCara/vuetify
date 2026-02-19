<template>
  <v-col cols="12" sm="6" md="3">
    <v-card class="pa-4 text-center" variant="outlined">
      <div class="text-h4 mb-2">{{ vots }}</div>
      <v-btn color="primary" block @click="$emit('votar')">
        {{ label }}
      </v-btn>
    </v-card>
  </v-col>
</template>

<script setup>
defineProps({
  vots: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: 'Votar',
  }
})

defineEmits(['votar'])
</script>
