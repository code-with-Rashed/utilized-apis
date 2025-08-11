<script setup>
import { RouterView } from 'vue-router';
import AppSidebar from '@/components/AppSidebar.vue';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Sun, Moon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { ref } from 'vue';

// change theme between dark & normal mode
const themeButton = ref(false);
const body = document.body;
const selectedTheme = localStorage.getItem('selectedTheme');
selectedTheme ? body.classList.add(selectedTheme) : '';
const changeTheme = () => {
  const dark = body.classList.contains('dark');
  dark ? body.classList.remove('dark') : body.classList.add('dark');
  dark ? localStorage.removeItem('selectedTheme') : localStorage.setItem('selectedTheme', 'dark');
  themeButton.value = !themeButton.value;
};
</script>

<template>
  <title>{{ $route.meta.title }}</title>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink>
                <RouterLink :to="{ name: $route.name }">{{ $route.meta.title }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <!-- dark mode -->
        <div class="absolute top-4 right-4">
          <template v-if="themeButton">
            <Button class="shadow-md cursor-pointer" size="icon" @click="changeTheme">
              <Sun />
            </Button>
          </template>
          <template v-else>
            <Button
              variant="secondary"
              class="shadow-md cursor-pointer"
              size="icon"
              @click="changeTheme"
            >
              <Moon />
            </Button>
          </template>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
