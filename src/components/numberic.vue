<template type="text/html" lang="jade">
    span.numberic()
        a(@click="doo(-step)",:class="{disable:val==min}") -
        input(type="number",v-model="val",:style="{width:(val+'').length + 'em'}",readonly)
        a(@click="doo(+step)",:class="{disable:val==max}") +
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'hello',
        data () {
            return {
                val:0
            }
        },
        methods:{
            doo:function(step){
                var m = this;
                var val = m.val;
                val += step;
                if(val<m.min) {
                    m.val = m.min;
                    return;
                }

                if(val>m.max) {
                    m.val = m.max;
                    return;
                }

                m.$emit("change",val)

                m.val=val;
            }
        },

        watch:{
            val:function(v){
                var m = this;
                m.$emit("input",v);
            }
        },
        props:{
            value:{
                type:Number,
                default:0
            },
            step:{
                type:Number,
                default:1
            },

            min:{
                type:Number,
                default:0
            },

            max:{
                type:Number,
                default:1000
            }
        },
        mounted:function(){
            var m = this;
            m.val = m.value;
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/tool.less";
    .numberic{
        display: flex;
        align-items: center;
        text-align: center;
        >input[type=number]{
            text-align: center;
            .padding_h(0.5em) !important;
            min-width:3em;
        }
        >a{
            display: inline-block;
            vertical-align: top;
            ._size_lh(1em);
            border: 1px solid #ddd;

            cursor: default;
            &:hover {
                color: red;
            }
            &.disable{
                opacity: 0.5;
                cursor:disabled;
            }
        }
    }
</style>
