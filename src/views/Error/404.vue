<template>
    <div class="error-404">
        <svg-icon class="icon" name="404" />
    </div>
</template>
<script lang="ts" setup name='404'>
const data = reactive({

})
onBeforeMount(() => {
    console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
    console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style lang='scss' scoped>
.error-404 {
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
        width: 350px;
        height: 350px;
    }
}
</style>