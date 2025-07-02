<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CloudDownload, SquarePen } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { ref, onMounted } from 'vue';

const skeletonLoader = ref(true);
const errorMessage = ref(null);
const showPicsumPhotos = ref('');
const page = ref(1);
const limit = ref(10);

// get photo list from picsum photo api
const getPicsumPhotos = async (page, limit) => {
  skeletonLoader.value = true;
  errorMessage.value = null;
  try {
    const data = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`);
    const response = await data.json();
    if (!response.length) throw new Error('Image not found !');
    showPicsumPhotos.value = response;
    skeletonLoader.value = false;
    console.log(showPicsumPhotos.value);
  } catch (error) {
    errorMessage.value = error.message;
    skeletonLoader.value = false;
  }
};
onMounted(() => {
  getPicsumPhotos(page.value, limit.value);
});
</script>
<template>
  <div class="flex flex-wrap justify-center mt-2">
    <!-- show skeleton loader -->
    <template v-if="skeletonLoader">
      <template v-for="(loader, i) in 10" :key="i">
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
        <template v-for="(picsumPhoto, i) in showPicsumPhotos" :key="i">
          <Card class="w-[400px] m-2">
            <CardContent>
              <div>
                <img :src="picsumPhoto.download_url" alt="photo" class="rounded" />
              </div>
              <div class="flex justify-between mt-1">
                <div>
                  <Badge
                    >Author :
                    <a :href="picsumPhoto.url" target="_blank" class="underline">{{
                      picsumPhoto.author
                    }}</a></Badge
                  >
                </div>
                <div>
                  <Button as="a" title="Edit this image" class="cursor-pointer"
                    ><SquarePen
                  /></Button>
                  <Button as="a" title="Download this image" class="cursor-pointer ms-1"
                    ><CloudDownload class="fond-bold"
                  /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
      </template>
    </template>
  </div>
</template>
