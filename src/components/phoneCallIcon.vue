<template type="text/html" lang="jade">
    a.icon-only.link.phone-call-icon(@click="phoneCall(phone)",:class="{blank:!(phone||'').trim()}")
        i.icon.i-dianhua
</template>

<style>
    .phone-call-icon{}
    .phone-call-icon.blank{ opacity: 0.5; }
    .phone-call-icon.blank .icon{ color: #333; }
</style>


<script type="text/ecmascript-6">
    export default {
        name: 'phone-call-icon',
        props: {
            phone:{
                type:[String,Number],
                default:""
            }
        }
    }
</script>


