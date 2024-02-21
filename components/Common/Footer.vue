<template>
    <div class="toolbar tabbar tabbar-icons toolbar-bottom custom-bottom-nav">
        <div class="toolbar-inner custom-bottom-nav-inner">
            <NuxtLink to="/" class="tab-link">
                <i class="icon f7-icons">house</i>
                <span class="tabbar-label">হোম</span>
            </NuxtLink>
            <NuxtLink to="/crop_issues" class="tab-link">
                <i class="icon f7-icons">ant_fill</i>
                <span class="tabbar-label">সমস্যা</span>
            </NuxtLink>
            <NuxtLink to="/profile" class="tab-link">
                <i class="icon f7-icons">person</i>
                <span class="tabbar-label">নিজ</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

</script>