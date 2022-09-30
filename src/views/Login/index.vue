<template>
    <div>
        <button @click="a++">{{b}}</button>
        <button @click="loginFn">登录</button>
    </div>
</template>
<script lang="ts" setup name='login'>
import { getRouterList, login, getUserInfo } from '@/api/login'
import { useMenuStore } from '@/store/modules/menu'
const a = $ref(1);
const b = $computed(() => {
    return a + 5    // 注意 ref 包装过的值在value中
})
const router = useRouter();
const menuStore = useMenuStore();
const loginFn = () => {
    login().then(res => {
        //缓存token
        localStorage.setItem('token', `${res.data.tokenHead}${res.data.token}`);
        getUserInfo().then(result => {
            if (res.code === 200) {
                //缓存用户信息
                localStorage.setItem('userInfo', JSON.stringify(result.data.user));
                getRouterList({ id: result.data.user.id }).then(res => {
                    if (res.code == 200) {
                        menuStore.setMenu(res.data)
                        //跳转到首页
                        router.push('/home/index')
                    }
                })
            }
        })
    })
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