export async function searchMovies(query) {
  const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=19f8a30e`);
  const data = await response.json();
  return data;
}

export async function getMovieDetail(id) {
  const response = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=19f8a30e`);
  const data = await response.json();
  return data;
}
