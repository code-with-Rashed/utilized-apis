<script setup>
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ref, onMounted } from 'vue';

const worldContinents = ['asia', 'africa', 'north america', 'south america', 'europe', 'oceania'];
const skeletonLoader = ref(true);
const showContinentsCountryInfo = ref('');
const errorMessage = ref(null);

// get selected continent country information
const getSelectedContinentCountryInformation = async (selectedContinent) => {
  await getContinentCountryInformation(worldContinents[selectedContinent]);
};
// get world continent wise country information
const getContinentCountryInformation = async (continentName) => {
  skeletonLoader.value = true;
  errorMessage.value = null;
  try {
    const data = await fetch('https://restcountries.com/v3.1/region/' + continentName);
    const response = await data.json();
    if (!response.length)
      throw new Error(
        `This world continent ( ${continentName} ) wise country is not found ! please try a valid world continent name.`,
      );
    showContinentsCountryInfo.value = response;
    skeletonLoader.value = false;
  } catch (error) {
    errorMessage.value = error.message;
    skeletonLoader.value = false;
  }
};
onMounted(() => {
  getContinentCountryInformation(worldContinents[0]);
});
</script>
<template>
  <div class="flex justify-center">
    <Tabs :default-value="worldContinents[0]" class="w-[500px]">
      <TabsList>
        <template v-for="(continentName, i) in worldContinents" :key="i">
          <TabsTrigger
            :value="continentName"
            class="uppercase cursor-pointer"
            @click="getSelectedContinentCountryInformation(i)"
          >
            {{ continentName }}
          </TabsTrigger>
        </template>
      </TabsList>
    </Tabs>
  </div>

  <div class="flex flex-wrap justify-center mt-2">
    <!-- show skeleton loader -->
    <template v-if="skeletonLoader">
      <template v-for="(loader, i) in worldContinents" :key="i">
        <Card class="w-[500px] m-2">
          <CardContent>
            <div class="flex flex-col space-y-3">
              <Skeleton class="h-[125px] w-100 rounded-xl" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-80" />
                <Skeleton class="h-4 w-70" />
              </div>
            </div>
          </CardContent>
        </Card>
      </template>
    </template>
    <template v-else>
      <!-- show error message -->
      <template v-if="errorMessage">
        <Card class="w-[400px] m-2">
          <CardContent>
            <p class="text-red-400 font-bold">{{ errorMessage }}</p>
          </CardContent>
        </Card>
      </template>
      <template v-else>
        <template v-for="(continentsCountry, i) in showContinentsCountryInfo" :key="i">
          <Card class="w-[400px] m-2">
            <CardContent>
              <div>
                <img
                  :src="continentsCountry.flags.svg"
                  :alt="continentsCountry.flags.alt"
                  :srcset="continentsCountry.flags.png"
                />
              </div>
              <div class="mt-2">
                <div>
                  <strong>Country Name : </strong><span>{{ continentsCountry.name.common }}</span>
                </div>
                <div>
                  <strong>Official Name : </strong
                  ><span>{{ continentsCountry.name.official }}</span>
                </div>
                <div>
                  <strong>Capital : </strong
                  ><span>{{
                    continentsCountry.capital
                      ? Object.values(continentsCountry.capital).join(', ')
                      : 'N/A'
                  }}</span>
                </div>
                <div>
                  <strong>Languages : </strong
                  ><span>{{
                    continentsCountry.languages
                      ? Object.values(continentsCountry.languages).join(', ')
                      : 'N/A'
                  }}</span>
                </div>
                <div>
                  <strong>Region & Subregion : </strong
                  ><span>{{ continentsCountry.region }} , {{ continentsCountry.subregion }}</span>
                </div>
                <div>
                  <strong>Area : </strong
                  ><span
                    >{{ continentsCountry.area.toLocaleString('en-US') }} KM<sup class="font-bold"
                      >2</sup
                    ></span
                  >
                </div>
                <div>
                  <strong>Population : </strong
                  ><span>{{ continentsCountry.population.toLocaleString('en-US') }}</span>
                </div>
                <div>
                  <strong>Map Links : </strong
                  ><span
                    ><a
                      :href="continentsCountry.maps.googleMaps"
                      target="_blank"
                      class="underline text-green-600"
                      >Google Maps</a
                    >
                    ,
                    <a
                      :href="continentsCountry.maps.openStreetMaps"
                      target="_blank"
                      class="underline text-green-600"
                      >Open Street Map</a
                    >
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
      </template>
    </template>
  </div>
</template>
