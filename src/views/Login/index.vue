<template>
    <div>
        <el-icons name="logo"></el-icons>
        <button @click="a++">{{b}}</button>
    </div>
</template>
<script lang="ts" setup name='layout'>
import { getRouterList } from '@/api'
getRouterList().then(res => {

})
const a = $ref(1);
const b = $computed(() => {
    return a + 5    // 注意 ref 包装过的值在value中
})
console.log(a, b, "~~~~~~~~~~~~~~~~~~~~111111~~~~~~~~~~~`")
onBeforeMount(() => {
    console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
    console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style lang='scss' scoped>

</style>