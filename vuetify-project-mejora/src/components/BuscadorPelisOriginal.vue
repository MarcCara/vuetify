<template>
  <div class="original-wrapper">
    <v-toolbar title="Cercador de pel·licules" color="primary"></v-toolbar>

      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="searchString"
              label="Titol a cercar"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-btn block height="56" @click="handleSearch">
              CERCA PE·LICULA
            </v-btn>
          </v-col>
        </v-row>

        <div v-if="moviesList.length > 0" class="mt-4">
          <h2 class="text-h6 mb-2">Resultats</h2>
          <v-row>
            <v-col
              v-for="movie in moviesList"
              :key="movie.imdbID"
              cols="12"
              md="4"
            >
              <v-card>
                <v-img
                  :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'"
                  height="400px"
                  cover
                ></v-img>
                <v-card-title>{{ movie.Title }}</v-card-title>
                <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    variant="text"
                    @click="showInfo(movie.imdbID)"
                  >
                    MÉS INFO
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
        
        <v-alert
            v-else-if="hasSearched"
            type="info"
            title="No s'han trobat resultats"
            text="Prova amb un altre titol."
            class="mt-4"
        ></v-alert>

        <!-- Movie Details Dialog -->
        <v-dialog v-model="dialogVisible" width="auto">
          <v-card v-if="selectedMovie" max-width="600">
            <v-img
              :src="selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : 'https://via.placeholder.com/300x450'"
              height="300px"
              cover
            ></v-img>
            <v-card-title class="text-h5">
              {{ selectedMovie.Title }} ({{ selectedMovie.Year }})
            </v-card-title>
            <v-card-text>
              <p><strong>Director:</strong> {{ selectedMovie.Director }}</p>
              <p><strong>Actors:</strong> {{ selectedMovie.Actors }}</p>
              <p><strong>Plot:</strong> {{ selectedMovie.Plot }}</p>
              <p><strong>IMDB Rating:</strong> {{ selectedMovie.imdbRating }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="dialogVisible = false">Tancar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { searchMovies, getMovieDetail } from '@/communicationManager';

const searchString = ref('');
const moviesList = ref([]);
const hasSearched = ref(false);
const dialogVisible = ref(false);
const selectedMovie = ref(null);

const handleSearch = async () => {
  if (!searchString.value) return;
  
  hasSearched.value = true;
  moviesList.value = []; // Clear previous results
  
  try {
    const data = await searchMovies(searchString.value);
    if (data.Search) {
      moviesList.value = data.Search;
    }
  } catch (error) {
    console.error("Error searching movies:", error);
  }
};

const showInfo = async (id) => {
  try {
    const data = await getMovieDetail(id);
    selectedMovie.value = data;
    dialogVisible.value = true;
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};
</script>
