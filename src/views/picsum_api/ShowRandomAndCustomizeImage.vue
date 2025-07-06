<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CloudDownload, SquarePen, ImageDown } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ref, onMounted } from 'vue';

const skeletonLoader = ref(true);
const errorMessage = ref(null);
const showPicsumPhotos = ref('');
const page = ref(1);
const totalPage = 1000;
const limit = ref(10);
const downloadLoader = ref(false);

const changePage = async (currentPage) => {
  page.value = currentPage;
  await getPicsumPhotos(page.value, limit.value);
};
const nextPage = async () => {
  page.value++;
  await getPicsumPhotos(page.value, limit.value);
};
const previousPage = async () => {
  page.value--;
  await getPicsumPhotos(page.value, limit.value);
};

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
  } catch (error) {
    errorMessage.value = error.message;
    skeletonLoader.value = false;
  }
};

// change download button style and behaviour after click the download button
const toggleDownloadButttonStyle = (targetedDownloadButton) => {
  if (downloadLoader.value) {
    targetedDownloadButton.target.disabled = true;
    Array.from(targetedDownloadButton.target.children).forEach((element) => {
      element.classList.toggle('hidden');
    });
  } else {
    Array.from(targetedDownloadButton.target.children).forEach((element) => {
      element.classList.toggle('hidden');
    });
    targetedDownloadButton.target.disabled = false;
  }
};
// download the image automatically
const downloadImage = (imageUrl, imageName = 'name', imageType = 'png') => {
  const link = document.createElement('a');
  link.setAttribute('href', imageUrl);
  link.setAttribute('download', `${imageName}.${imageType}`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
// start preparation for download the selected image
const preparerDownloadImage = async (event) => {
  downloadLoader.value = true;
  toggleDownloadButttonStyle(event);
  const imageId = event.target.dataset.imageId;
  const url = showPicsumPhotos.value[imageId].download_url;
  const data = await fetch(url);
  const response = await data.blob();
  downloadImage(URL.createObjectURL(response), imageId);
  downloadLoader.value = false;
  toggleDownloadButttonStyle(event);
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
        <template v-for="picsumPhoto in showPicsumPhotos" :key="picsumPhoto.id">
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
                    }}</a>
                  </Badge>
                </div>
                <div>
                  <Button as="a" title="Edit this image" class="cursor-pointer">
                    <SquarePen />
                  </Button>
                  <Button
                    title="Download this image"
                    class="cursor-pointer ms-1"
                    @click="preparerDownloadImage"
                    :data-image-id="picsumPhoto.id"
                  >
                    <ImageDown class="animate-bounce hidden" />
                    <CloudDownload class="fond-bold" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
        <Pagination
          v-slot="{ page }"
          :items-per-page="limit"
          :default-page="page"
          :total="totalPage"
          class="mt-4"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious @click="previousPage" class="cursor-pointer" />
            <template v-for="(item, index) in items" :key="index">
              <PaginationItem
                class="cursor-pointer"
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === page"
                @click="changePage(item.value)"
              >
                {{ item.value }}
              </PaginationItem>
            </template>
            <PaginationEllipsis :index="4" />
            <PaginationNext @click="nextPage" class="cursor-pointer" />
          </PaginationContent>
        </Pagination>
      </template>
    </template>
  </div>
</template>
