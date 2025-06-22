<script setup>
import { Search } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ref, onMounted } from 'vue';

const skeletonLoader = ref(true);
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
  skeletonLoader.value = true;
  errorMessage.value = null;
  try {
    const data = await fetch('https://restcountries.com/v3.1/name/' + name);
    const response = await data.json();
    if (!response[0])
      throw new Error(
        `This name ( ${name} ) related country is not found ! please try a valid country name.`,
      );
    showSearchedCountryInfo.value = response[0];
    skeletonLoader.value = false;
  } catch (error) {
    errorMessage.value = error.message;
    skeletonLoader.value = false;
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
    <Card class="w-[500px]">
      <CardContent>
        <!-- show skeleton loader -->
        <template v-if="skeletonLoader">
          <div class="flex flex-col space-y-3">
            <Skeleton class="h-[125px] w-100 rounded-xl" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-80" />
              <Skeleton class="h-4 w-70" />
            </div>
          </div>
        </template>
        <template v-else>
          <!-- show error message -->
          <template v-if="errorMessage">
            <p class="text-red-400 font-bold">{{ errorMessage }}</p>
          </template>
          <template v-else>
            <!-- show country information -->
            <template v-if="showSearchedCountryInfo">
              <div>
                <img
                  :src="showSearchedCountryInfo.flags.svg"
                  :alt="showSearchedCountryInfo.flags.alt"
                  :srcset="showSearchedCountryInfo.flags.png"
                  class="w-full h-full"
                />
              </div>
              <div class="mt-2">
                <div>
                  <strong>Country Name : </strong
                  ><span>{{ showSearchedCountryInfo.name.common }}</span>
                </div>
                <div>
                  <strong>Official Name : </strong
                  ><span>{{ showSearchedCountryInfo.name.official }}</span>
                </div>
                <div>
                  <strong>Capital : </strong><span>{{ showSearchedCountryInfo.capital[0] }}</span>
                </div>
                <div>
                  <strong>Languages : </strong
                  ><span>{{
                    showSearchedCountryInfo.languages
                      ? Object.values(showSearchedCountryInfo.languages).join(', ')
                      : 'N/A'
                  }}</span>
                </div>
                <div>
                  <strong>Region & Subregion : </strong
                  ><span
                    >{{ showSearchedCountryInfo.region }} ,
                    {{ showSearchedCountryInfo.subregion }}</span
                  >
                </div>
                <div>
                  <strong>Area : </strong
                  ><span
                    >{{ showSearchedCountryInfo.area.toLocaleString('en-US') }} KM<sup
                      class="font-bold"
                      >2</sup
                    ></span
                  >
                </div>
                <div>
                  <strong>Population : </strong
                  ><span>{{ showSearchedCountryInfo.population.toLocaleString('en-US') }}</span>
                </div>
                <div>
                  <strong>Map Links : </strong
                  ><span
                    ><a
                      :href="showSearchedCountryInfo.maps.googleMaps"
                      target="_blank"
                      class="underline text-green-600"
                      >Google Maps</a
                    >
                    ,
                    <a
                      :href="showSearchedCountryInfo.maps.openStreetMaps"
                      target="_blank"
                      class="underline text-green-600"
                      >Open Street Map</a
                    >
                  </span>
                </div>
              </div>
            </template>
          </template>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
