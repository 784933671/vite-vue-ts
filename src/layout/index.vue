<template>
    <button @click="a++">{{b}}</button>
    <Suspense>
        <template #default>
            <router-view v-slot="{ Component, route }">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                        <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
                    </keep-alive>
                </transition>
            </router-view>
        </template>
        <template #fallback> Loading... </template>
    </Suspense>
</template>
<script lang="ts" setup name='layout'>
const a = $ref(1);
const b = $computed(() => {
    return a + 5    // 注意 ref 包装过的值在value中
})
onBeforeMount(() => {
    console.log('2.组件挂载页面之前执行----layout')
})
</script>
<style lang='scss' scoped>
.fade-transform-leave-active,
.fade-transform-enter-active {
    transition: all 0.5s;
}

.fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>