<template>
    <div>
        <svg-icon name="logo" />
        <!-- <img src="@/assets/images/app-download.png" /> -->
        <button @click="jump">跳转</button>
    </div>
</template>
<script lang="ts" setup name='login'>
import { getRouterList } from '@/api'
const router = useRouter();
getRouterList().then(res => {
    if (res.code == 200) {
        console.log(res.data)
    }
})
const jump = async () => {
    router.push("/login")
}
onBeforeMount(() => {
    console.log('2.组件挂载页面之前执行----onBeforeMount')
})
onMounted(() => {
    console.log('3.-组件挂载到页面之后执行-------onMounted')
})
</script>
<style lang='scss' scoped>

</style>