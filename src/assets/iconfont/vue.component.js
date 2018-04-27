import Vue from "vue";
import "./iconfont";

Vue.component("ico",{
    template:` <svg class="icon" aria-hidden="true"> <use v-bind:xlink:href="'#'+icon"></use> </svg>`,
    props:{
        icon:{
            type:String,
            default:""
        }
    }
})