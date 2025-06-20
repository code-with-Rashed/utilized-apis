<script setup>
import { Search } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ref, onMounted } from 'vue';

const searchedCountryName = ref('');
const showSearchedCountryInfo = ref('');
const errorMessage = ref(null);

// search country by name
const searchCountryByName = async () => {
  if (searchedCountryName.value) {
    await getCountryInformation(searchedCountryName.value);
  }
};

// first time get visitor country name
const getVisitorCountryName = async () => {
  const countryName = await getVisitorInfo();
  if (countryName) {
    searchedCountryName.value = countryName;
    await getCountryInformation(countryName);
  }
};

// get country information
const getCountryInformation = async (name) => {
  try {
    const data = await fetch('https://restcountries.com/v3.1/name/' + name);
    const response = await data.json();
    showSearchedCountryInfo.value = response;
  } catch (error) {
    errorMessage.value = error.message;
  }
};
// get visitor information by ip address
const getVisitorInfo = async () => {
  let nameOfCountry = '';
  try {
    const data = await fetch('http://ip-api.com/json');
    const response = await data.json();
    nameOfCountry = response.country;
  } catch (error) {
    nameOfCountry = null;
    errorMessage.value = error.message;
  }
  return nameOfCountry;
};
onMounted(() => {
  getVisitorCountryName();
});
</script>
<template>
  <div class="flex justify-center">
    <div class="relative w-full max-w-sm items-center">
      <Input
        id="search"
        type="text"
        placeholder="Search a country by name..."
        class="pl-10"
        v-model="searchedCountryName"
        @keyup.enter="searchCountryByName"
      />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>
    <Button class="ms-2 cursor-pointer" @click="searchCountryByName">Search</Button>
  </div>
  <div class="flex justify-center mt-2">
    <Card class="w-[600px]">
      <CardContent>
        <!-- show country information -->
        {{ showSearchedCountryInfo }}
      </CardContent>
    </Card>
  </div>
</template>
