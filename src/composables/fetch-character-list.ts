import { ref, reactive, toRefs } from 'vue';

const apiKey = import.meta.env.VITE_MARVEL_API_KEY;
export const marvelBaseUrl = `https://gateway.marvel.com:443/v1/public`;
export const marvelCharactersUrl = `https://gateway.marvel.com:443/v1/public/characters?apikey=${apiKey}`;
export interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
  series: {
    available: number;
  };
  stories: {
    available: number;
  };
  events: {
    available: number;
  };
}
// TODO: get this working and add other services (character details, filtered character list, etc.)
export async function useFetchCharacterList() {
  const state = reactive({
    data: null,
    error: null,
    loading: false,
  })
  // const data = ref(null);
  // const error = ref(null);
  // const loading = ref(false);
  try {
    state.loading = true;
    const response = await fetch(marvelCharactersUrl);
    const json = await response.json();
    state.data = json.data.results;
    state.loading = false;
    // TODO: figure out proper typing for err
  } catch (err: any) {
    state.error = err.message;
    state.loading = false;
  }
  return { ...toRefs(state) };
}