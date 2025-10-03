<script setup>
import { Search } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ref, onMounted } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Map } from 'lucide-vue-next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const skeletonLoader = ref(true);
const searchedCountryName = ref('');
const showSearchedCountryInfo = ref('');
const errorMessage = ref(null);
const popupSkeletonLoader = ref(false);
const openModal = ref(false);

// open map for show country
const openMap = async (latlng, countryName) => {
  openModal.value = !openModal.value;
  popupSkeletonLoader.value = true;
  const latitude = latlng[0];
  const longitude = latlng[1];

  setTimeout(() => {
    const map = L.map('map').setView([latitude, longitude], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const marker = L.marker([latitude, longitude]);
    marker.addTo(map);
    marker.bindPopup(`<strong>${countryName}</strong>`).openPopup();
    popupSkeletonLoader.value = false;
  }, 2000);
};

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
  let nameOfCountry = 'Bangladesh'; // default country name is Bangladesh .
  try {
    const data = await fetch('http://ip-api.com/json');
    const response = await data.json();
    nameOfCountry = response.country;
  } catch (error) {
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
                  <strong
                    >View Map :
                    <Map
                      class="inline-block cursor-pointer"
                      @click="
                        openMap(showSearchedCountryInfo.latlng, showSearchedCountryInfo.name.common)
                      "
                  /></strong>
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
            <template>
              <!-- this dialog open for view country map -->
              <Dialog v-model:open="openModal">
                <DialogContent
                  class="sm:max-w-[80%] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
                >
                  <DialogHeader class="p-6 pb-0">
                    <DialogTitle>View {{ showSearchedCountryInfo.name.common }} Map</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <template v-if="popupSkeletonLoader">
                    <Skeleton class="h-[80vh] w-[94%] rounded-xl m-auto" />
                  </template>
                  <div id="map" style="height: 85vh; width: 100%"></div>
                </DialogContent>
              </Dialog>
            </template>
          </template>
        </template>
      </CardContent>
    </Card>
  </div>
  <!-- <div id="map" style="height: 500px; width: 100%;"></div> -->
</template>
