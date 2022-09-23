<template>
    <div>
        <el-icons icon-class="logo" class-name="logo-icon"></el-icons>
    </div>
</template>
<script lang="ts" setup name='layout'>
import { getRouterList } from '@/api'
getRouterList().then(res => {

})
onBeforeMount(() => {
    console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
    console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style lang='scss' scoped>

</style>