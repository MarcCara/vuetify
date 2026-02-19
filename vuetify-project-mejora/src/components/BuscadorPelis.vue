<template>
  <v-container fluid class="pa-0 bg-grey-darken-4 min-vh-100">
    <!-- Hero Section: High Contrast & Proximity -->
    <v-sheet color="deep-purple-darken-4" class="py-16 px-4 text-center rounded-b-xl elevation-10">
      <h1 class="text-h3 font-weight-bold mb-2 text-white">
        <v-icon icon="mdi-movie-roll" color="amber-accent-3" class="mr-2"></v-icon>
        Movie Search
      </h1>
      <p class="text-subtitle-1 text-grey-lighten-1 mb-8">Troba les teves pel·lícules preferides a l'instant</p>

      <!-- Alignment: Centered Search Bar -->
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card color="surface" elevation="8" rounded="pill" class="pa-1">
            <v-text-field
              v-model="textCerca"
              label="Escriu un títol..."
              variant="solo"
              hide-details
              bg-color="transparent"
              flat
              rounded="pill"
              prepend-inner-icon="mdi-magnify"
              @keyup.enter="enviarPeticio"
              class="custom-search-field"
            >
              <template v-slot:append-inner>
                <v-btn
                  @click="enviarPeticio"
                  color="amber-accent-3"
                  size="large"
                  variant="flat"
                  rounded="pill"
                  class="px-6 text-black font-weight-bold"
                  :loading="loading"
                >
                  Buscar
                </v-btn>
              </template>
            </v-text-field>
          </v-card>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Results Section -->
    <v-container class="py-8" max-width="1400">
      <v-row justify="center" v-if="loading" class="my-12">
        <v-progress-circular size="64" width="6" indeterminate color="amber-accent-3"></v-progress-circular>
      </v-row>

      <div v-else-if="pelicules.length === 0 && !loading" class="text-center py-12 text-grey">
        <v-icon icon="mdi-filmstrip-off" size="64" class="mb-4 opacity-50"></v-icon>
        <h3 class="text-h5">Comença a cercar per veure resultats</h3>
      </div>

      <v-row v-else>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="pelicula in pelicules"
          :key="pelicula.imdbID"
        >
          <!-- Repetition: Consistent Card Styling -->
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              class="mx-auto h-100 d-flex flex-column transition-swing"
              :elevation="isHovering ? 16 : 4"
              rounded="xl"
              color="surface-light"
            >
              <div class="position-relative">
                <v-img
                  :src="pelicula.Poster !== 'N/A' ? pelicula.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
                  height="400"
                  cover
                  class="rounded-t-xl"
                  gradient="to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%"
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <div class="position-absolute bottom-0 left-0 w-100 pa-4 text-white">
                  <div class="text-subtitle-2 font-weight-bold text-amber-accent-3 mb-1">
                    {{ pelicula.Year }}
                  </div>
                </div>
              </div>

              <v-card-title class="pt-4 text-h6 font-weight-bold text-truncate">
                {{ pelicula.Title }}
              </v-card-title>

              <v-card-actions class="mt-auto pa-4">
                <v-btn
                  block
                  color="deep-purple-accent-2"
                  variant="tonal"
                  rounded="lg"
                  @click="demanarMesInfo(pelicula.imdbID)"
                  class="font-weight-bold"
                >
                  <v-icon start>mdi-information-outline</v-icon>
                  Més detalls
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialogo de detalles -->
    <v-dialog v-model="dialog" max-width="800" transition="dialog-bottom-transition">
      <v-card rounded="xl" color="grey-darken-3" class="overflow-hidden">
        <v-row no-gutters>
          <v-col cols="12" md="5">
            <v-img
              :src="infoDetallada.Poster !== 'N/A' ? infoDetallada.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
              height="100%"
              cover
              class="rounded-s-xl hidden-sm-and-down"
            ></v-img>
             <v-img
              :src="infoDetallada.Poster !== 'N/A' ? infoDetallada.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'"
              height="300"
              cover
              class="hidden-md-and-up"
            ></v-img>
          </v-col>
          <v-col cols="12" md="7">
            <div class="pa-6">
              <h2 class="text-h4 font-weight-bold text-amber-accent-3 mb-2">{{ infoDetallada.Title }}</h2>
              <!-- Proximity: Grouping metadata -->
              <div class="d-flex align-center gap-2 mb-4">
                <v-chip color="grey-lighten-1" size="small" variant="outlined">{{ infoDetallada.Year }}</v-chip>
                <v-chip color="grey-lighten-1" size="small" variant="outlined">{{ infoDetallada.Rated }}</v-chip>
                <v-chip color="amber" size="small" variant="flat" class="text-black font-weight-bold">
                  <v-icon start icon="mdi-star" size="small"></v-icon>
                  {{ infoDetallada.imdbRating }}
                </v-chip>
              </div>

              <v-divider class="mb-4"></v-divider>

              <div class="text-body-1 mb-4 text-grey-lighten-1">
                {{ infoDetallada.Plot }}
              </div>

              <v-row dense class="text-body-2 mb-6">
                <v-col cols="12"><strong>Director:</strong> <span class="text-grey-lighten-2">{{ infoDetallada.Director }}</span></v-col>
                <v-col cols="12"><strong>Actors:</strong> <span class="text-grey-lighten-2">{{ infoDetallada.Actors }}</span></v-col>
                <v-col cols="12"><strong>Genre:</strong> <span class="text-grey-lighten-2">{{ infoDetallada.Genre }}</span></v-col>
              </v-row>

              <v-btn color="deep-purple-accent-2" variant="flat" block rounded="lg" @click="dialog = false">
                Tancar
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { searchMovies, getMovieDetail } from '../communicationManager';

const textCerca = ref("");
const pelicules = ref([]);
const infoDetallada = ref({});
const dialog = ref(false);
const loading = ref(false);

async function enviarPeticio() {
  if (!textCerca.value) return;
  loading.value = true;
  pelicules.value = []; // Clear previous results while loading

  try {
    const data = await searchMovies(textCerca.value);

    if (data.Response === "True") {
      pelicules.value = data.Search;
    } else {
      pelicules.value = [];
      // Optional: Show snackbar instead of alert for better UX
      // alert("No se encontraron películas"); 
    }
  } catch (error) {
    console.error("Error al buscar películas:", error);
  } finally {
    loading.value = false;
  }
}

async function demanarMesInfo(id) {
  try {
    const data = await getMovieDetail(id);
    infoDetallada.value = data;
    dialog.value = true;
  } catch (error) {
    console.error("Error al obtener detalles:", error);
  }
}
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
.gap-2 {
  gap: 8px;
}
</style>

