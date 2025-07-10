<script setup>
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CloudDownload, SquarePen, ImageDown } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ref, onMounted, reactive, watch } from 'vue';

const skeletonLoader = ref(true);
const errorMessage = ref(null);
const showPicsumPhotos = ref('');
const page = ref(1);
const totalPage = 1000;
const limit = ref(10);
const downloadLoader = ref(false);
const openModal = ref(false);
const previewImage = ref(null);
const editingImageInfo = reactive({
  imageId: null,
  imageWidth: null,
  imageHeight: null,
  imageBlur: [0],
  imageGray: [0],
  imageName: '',
  imageType: '',
});

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
  const imageIndex = event.target.dataset.imageIndex;
  const imageInfo = showPicsumPhotos.value[imageIndex];
  const data = await fetch(imageInfo.download_url);
  const response = await data.blob();
  downloadImage(URL.createObjectURL(response), imageInfo.id);
  downloadLoader.value = false;
  toggleDownloadButttonStyle(event);
};
// start preparation before editing the selected image
const preparerBeforeEditImage = (event) => {
  openModal.value = !openModal.value;
  const imageIndex = event.target.dataset.imageIndex;
  const imageInfo = showPicsumPhotos.value[imageIndex];
  previewImage.value = imageInfo.download_url;
  editingImageInfo.imageId = imageInfo.id;
  editingImageInfo.imageWidth = imageInfo.width;
  editingImageInfo.imageHeight = imageInfo.height;
};
// start preparation download the edited image
const prepareEditedImageDownload = async (event) => {
  downloadLoader.value = true;
  toggleDownloadButttonStyle(event);
  let url = 'https://picsum.photos/';
  url += `id/${editingImageInfo.imageId}`;
  url += `/${editingImageInfo.imageWidth}`;
  url += `/${editingImageInfo.imageHeight}`;
  if (editingImageInfo.imageBlur[0] > 0 && editingImageInfo.imageGray[0] > 0) {
    url += `?blur=${editingImageInfo.imageBlur[0]}&grayscale=${editingImageInfo.imageGray[0]}`;
  } else if (editingImageInfo.imageBlur[0] > 0) {
    url += `?blur=${editingImageInfo.imageBlur[0]}`;
  } else if (editingImageInfo.imageGray[0] > 0) {
    url += `?grayscale=${editingImageInfo.imageGray[0]}`;
  }
  const data = await fetch(url);
  const response = await data.blob();
  downloadImage(
    URL.createObjectURL(response),
    editingImageInfo.imageName,
    editingImageInfo.imageType,
  );
  downloadLoader.value = false;
  toggleDownloadButttonStyle(event);
};
// clear edited image information
const clearEditedImageInfo = () => {
  editingImageInfo.imageId = null;
  editingImageInfo.imageWidth = null;
  editingImageInfo.imageHeight = null;
  editingImageInfo.imageBlur = [0];
  editingImageInfo.imageGray = [0];
  editingImageInfo.imageName = '';
  editingImageInfo.imageType = '';
};
// clear the edited image information when close the editing modal / panel
watch(openModal, (modalStatus) => {
  if (!modalStatus) clearEditedImageInfo();
});

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
                <img
                  :src="picsumPhoto.download_url"
                  alt="photo"
                  class="rounded aspect-3/2 object-cover"
                />
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
                  <Button
                    @click="preparerBeforeEditImage"
                    title="Edit this image"
                    class="cursor-pointer"
                    :data-image-index="i"
                  >
                    <SquarePen />
                  </Button>
                  <Button
                    title="Download this image"
                    class="cursor-pointer ms-1"
                    @click="preparerDownloadImage"
                    :data-image-index="i"
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
        <!-- this dialog open for image editing & downloading proccess -->
        <Dialog v-model:open="openModal">
          <DialogContent
            class="sm:max-w-[500px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
          >
            <DialogHeader class="p-6 pb-0">
              <DialogTitle>Edit image & download</DialogTitle>
              <DialogDescription>
                You can change this image width , hight & variant than download your required file
                format.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4 overflow-y-auto px-6">
              <div class="flex flex-col justify-between h-[55dvh]">
                <div>
                  <img :src="previewImage" alt="image" class="rounded" />
                  <div class="flex justify-between mt-3 mb-6">
                    <div>
                      <Label for="width">Image Width ( px )</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="Image width"
                        class="my-2"
                        v-model="editingImageInfo.imageWidth"
                      />
                    </div>
                    <div class="ms-2">
                      <Label for="height"
                        >Image height ( px ) {{ editingImageInfo.imageHeight }}</Label
                      >
                      <Input
                        id="height"
                        type="number"
                        placeholder="Image height"
                        class="my-2"
                        v-model="editingImageInfo.imageHeight"
                      />
                    </div>
                  </div>
                  <div class="mb-5">
                    <Label class="mb-3"
                      >Blur this image ( {{ editingImageInfo.imageBlur[0] }}% )</Label
                    >
                    <Slider
                      :default-value="[1]"
                      :max="10"
                      :step="1"
                      v-model="editingImageInfo.imageBlur"
                      title="Blur this image"
                      class="cursor-pointer"
                    />
                  </div>
                  <div class="mb-6">
                    <Label class="mb-3"
                      >Gray this image ( {{ editingImageInfo.imageGray[0] }}% )</Label
                    >
                    <Slider
                      :default-value="[1]"
                      :max="100"
                      :step="1"
                      v-model="editingImageInfo.imageGray"
                      title="Gray this image"
                      class="cursor-pointer"
                    />
                  </div>
                  <div class="mb-5">
                    <Label class="mb-3">Type a file name</Label>
                    <Input v-model="editingImageInfo.imageName" placeholder="image name..." />
                  </div>
                  <div>
                    <Label class="mb-3">Select a image download Type</Label>
                    <Select v-model="editingImageInfo.imageType">
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select image download type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>File Type</SelectLabel>
                          <SelectItem value="jpg"> JPG </SelectItem>
                          <SelectItem value="jpeg"> JPEG </SelectItem>
                          <SelectItem value="png"> PNG </SelectItem>
                          <SelectItem value="webp"> WEBP </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter class="p-6 pt-0">
              <DialogClose>
                <Button
                  class="cursor-pointer bg-red-500 hover:bg-red-600"
                  type="button"
                  title="Cancel this image"
                  >Cancel</Button
                >
              </DialogClose>
              <Button
                type="button"
                class="cursor-pointer"
                title="Download this image"
                @click="prepareEditedImageDownload"
              >
                <ImageDown class="animate-bounce hidden" />
                <CloudDownload class="fond-bold" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </template>
    </template>
  </div>
</template>
