<template>
  <v-container>

    <v-row class="mb-6" justify="center">
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="textCerca"
          label="Buscar películas"
          @keyup.enter="enviarPeticio"
          outlined
          clearable
          prepend-inner-icon="mdi-movie-search"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-btn
          @click="enviarPeticio"
          color="primary"
          block
          class="rounded-lg"
        >
          <v-icon start>mdi-magnify</v-icon>
          Buscar
        </v-btn>
      </v-col>
    </v-row>


    <v-row justify="center" v-if="loading" class="my-6">
      <v-progress-circular size="50" indeterminate color="primary"></v-progress-circular>
    </v-row>


    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="pelicula in pelicules"
        :key="pelicula.imdbID"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            class="mx-auto transition-swing"
            max-width="344"
            rounded="xl"
            :elevation="isHovering ? 10 : 2"
          >
            <v-img
              :src="pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450?text=Sin+imagen'"
              height="450"
              cover
              class="rounded-t-xl"
            ></v-img>
            <v-card-title class="text-truncate">
              {{ pelicula.Title }}
            </v-card-title>
            <v-card-subtitle class="text-grey">{{ pelicula.Year }}</v-card-subtitle>
            <v-card-actions>
              <v-btn
                color="orange lighten-2"
                variant="tonal"
                block
                @click="demanarMesInfo(pelicula.imdbID)"
              >
                <v-icon start>mdi-information</v-icon>
                Más información
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

<!-- Diálogo de detalles -->
<v-dialog v-model="dialog" max-width="500">
  <v-card rounded="xl">
    <v-img
      :src="infoDetallada.Poster !== 'N/A' ? infoDetallada.Poster : 'https://via.placeholder.com/300x450?text=Sin+imagen'"
      height="auto"
      max-width="350"
      contain
      class="rounded-t-xl"
    ></v-img>
    <v-card-title class="text-h6 font-weight-bold">
      {{ infoDetallada.Title }}
    </v-card-title>
    <v-card-text>
      <p><strong>Año:</strong> {{ infoDetallada.Year }}</p>
      <p><strong>Género:</strong> {{ infoDetallada.Genre }}</p>
      <p><strong>Director:</strong> {{ infoDetallada.Director }}</p>
      <p><strong>Actores:</strong> {{ infoDetallada.Actors }}</p>
      <p class="mt-2"><strong>Sinopsis:</strong> {{ infoDetallada.Plot }}</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" variant="tonal" @click="dialog = false">
        <v-icon start>mdi-close</v-icon>
        Cerrar
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  </v-container>
</template>

<script setup>
import { ref } from "vue";

const textCerca = ref("");
const pelicules = ref([]);
const infoDetallada = ref({});
const dialog = ref(false);
const loading = ref(false);

const API_KEY = "9166615"; // tu API key
const BASE_URL = "http://www.omdbapi.com/";

async function enviarPeticio() {
  if (!textCerca.value) return;
  loading.value = true;

  try {
    const response = await fetch(`${BASE_URL}?s=${textCerca.value}&apikey=${API_KEY}`);
    const data = await response.json();

    if (data.Response === "True") {
      pelicules.value = data.Search;
    } else {
      pelicules.value = [];
      alert("No se encontraron películas");
    }
  } catch (error) {
    console.error("Error al buscar películas:", error);
  } finally {
    loading.value = false;
  }
}

async function demanarMesInfo(id) {
  try {
    const response = await fetch(`${BASE_URL}?i=${id}&apikey=${API_KEY}`);
    const data = await response.json();
    infoDetallada.value = data;
    dialog.value = true;
  } catch (error) {
    console.error("Error al obtener detalles:", error);
  }
}
</script>
