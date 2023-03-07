<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import type { Character } from '../composables/fetch-character-list';
  const apiKey = import.meta.env.VITE_MARVEL_API_KEY;
  const marvelCharactersUrl = `https://gateway.marvel.com:443/v1/public/characters?apikey=${apiKey}`;
  const router = useRouter();

  interface SearchState {
    characters: Character[];
    searchTerm: string;
    isSearchFocused: boolean;
  };
  const state: SearchState = reactive({
    characters: [],
    searchTerm: '',
    isSearchFocused: false,
  });

  async function fetchAllCharacters(): Promise<void> {
    const response = await fetch(marvelCharactersUrl);
    const json = await response.json();
    state.characters = json.data.results;
  }
  
  async function fetchFilteredCharacters(searchTerm: string): Promise<void> {
    const response = await fetch(`${marvelCharactersUrl}&nameStartsWith=${searchTerm}`);
    const json = await response.json();
    state.characters = json.data.results;
  }

  function handleSearchInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value;
    state.searchTerm = searchTerm;
    if (searchTerm === '') {
      fetchAllCharacters();
    } else {
      fetchFilteredCharacters(searchTerm);
    }
  }

  function handleSearchInputFocus() {
    state.isSearchFocused = true;
  }

  // TODO: handle blur so that clicking inside the list doesn't close it
  function handleSearchInputBlur() {
    state.isSearchFocused = false;
  }

  function handleListItemClick(character: Character) {
    router.push(`/details/${character.id}`);

    console.log(character);
  }
  
  onMounted(async () => {
    await fetchAllCharacters();
  });

</script>

<template>
  <div class="container">
    <div>
      <input
        class="search-input"
        type="text"
        :value="state.searchTerm"
        placeholder="Search for a character"
        @focus="handleSearchInputFocus"
        @change="handleSearchInputChange"
        @input="handleSearchInputChange"/>
        <div v-if="state.isSearchFocused" class="search-results-container">
          <div
            v-for="character in state.characters"
            class="list-item"
            @click="handleListItemClick(character)"
            >
            <img class="item-thumbnail" :src="`${character.thumbnail.path}.${character.thumbnail.extension}`" />
            <span>{{ character.name }}</span>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .search-input {    
    padding: .5rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 25rem;
  }
  .search-results-container {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow-y: scroll;
    background-color: black;
  }
  .item-thumbnail {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
}
.list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  height: 2.813rem;
  color: azure;
  background-color: black;
}

.list-item:hover {
  background-color: #333;
  cursor: pointer;
}
</style>