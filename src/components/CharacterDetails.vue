<script setup lang="ts">
 import { useRouter } from 'vue-router';
 import { onMounted, reactive } from 'vue';
 import { marvelBaseUrl } from '../composables/fetch-character-list';
 import type { Character } from '../composables/fetch-character-list';
 const router = useRouter();
 const apiKey = import.meta.env.VITE_MARVEL_API_KEY;

 interface CharacterDetailsState {
   characterDetails: Character;
   isLoaded: boolean;
 };

 const state: CharacterDetailsState = reactive({
   characterDetails: {} as Character,
   isLoaded: false,
 });

 onMounted(() => {
   const characterId = Number(router.currentRoute.value.params.id);
   if (typeof characterId === 'number') {
     console.log(characterId);
      fetchCharacterDetails(characterId);
   }
 });

 async function fetchCharacterDetails(id: number): Promise<void> {
  // TODO: error handling
    const response = await fetch(`${marvelBaseUrl}/characters/${id}?apikey=${apiKey}`);
    const json = await response.json();
    const { results } = json.data;
    state.characterDetails = results[0];
    state.isLoaded = true;
  }

  function goBack() {
    router.back();
  }

</script>

<template>
  <button @click="goBack" style="margin-top: 2rem;">Back</button>
  <div class="content">
    <div v-if="state.isLoaded" class="details">
      <img :src="`${state.characterDetails.thumbnail.path}.${state.characterDetails.thumbnail.extension}`" height="80" />
      <h2>{{state.characterDetails.name}}</h2>
      <p class="description">{{state.characterDetails.description}}</p>
      <p>Comics: {{state.characterDetails.comics.available}}</p>
      <p>Series: {{state.characterDetails.series.available}}</p>
      <p>Stories: {{state.characterDetails.stories.available}}</p>
      <p>Events: {{state.characterDetails.events.available}}</p>
    </div>
  </div>

</template>

<style scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 10px 40px;
  margin-top: 3rem;
  max-width: 60%;
}

.details img {
  height: 10rem;
  border-radius: 15px;
}

.description {
  text-align: left;
  max-width: 400px;
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
}</style>