<template type="text/html" lang="jade">
    .filter-bar
        f7-grid.grid(no-gutter="")
            f7-col(v-for="(el,index1) in data")

                //普通的选择
                template(v-if="el.instance == 'select'")
                    f7-list()
                        f7-list-item(
                            smart-select="",
                            :title="el.displayLabel",
                            smart-select-open-in="picker",
                            smart-select-back-on-select="",
                            smart-select-picker-close-text="请选择",
                        )
                            select(:name="get_input_name()",v-model="el.value", @change="selectChanged(el)")
                                option(:value="0") 默认
                                option(:value="op.value",v-for="op in el.options") {{op.name}}

                //仅仅是个按钮
                template(v-if="el.instance == 'button'")
                    a.btn(@click="buttonClick(el)")
                        span {{el.label}}

                //checkButton
                template(v-if="el.instance == 'checkButton'")
                    a.btn.check-btn(@click="el.value==el.normalValue?(el.value=el.checkedValue):(el.value=el.normalValue);buttonClick(el)",:class="{checked:el.value==el.checkedValue}")
                        span {{el.label}}

                //过滤组
                template(v-if="el.instance == 'filter-gp'")
                    a.btn(@click="openPickerGp(el.data,index1)") 筛选
                        picker.filter-gp-picker(:ref="pickerPrefix + index1",title="请选择过滤条件")
                            form.inner
                                .gp(v-for="(gp,index) in el.data.list")
                                    h2 {{gp.parentClassify.name}}
                                    .choice-container
                                        em(
                                            :class="{checked:choice.checked}",
                                            @click="filterGpChoice(choice,gp)",
                                            v-for="(choice,i2) in gp.childrenClassify"
                                        )
                                            template(v-if="gp.parentClassify.type!=2") {{choice.name}}
                                            template(v-if="gp.parentClassify.type==2") {{choice.minValue}} - {{choice.maxValue}}
                                            span.number {{gp.countList[i2]}}

                                f7-button(color="red",fill="",@click="confirmFilterGp(el.data,index1)") 确定






</template>

<script type="text/ecmascript-6">
    import _ from "lodash";
    import Picker from "./picker.vue";

    var events = {
        "select":"select",
        "filter":"filter",
        "button":"button"
    }


    export default {
        data () {
            return {
                pickerPrefix:"pk-"
            }
        },

        watch: {

        },
        methods: {

            /**
             * 选择器改变选择
             */
            selectChanged:function(select_el){
                var m = this;
                select_el.displayLabel = (function(){
                    if (select_el.value == 0) {
                        return select_el.label;
                    }

                    var option = select_el.options.find(function (el) {
                        return el.value == select_el.value
                    });

                    if (option) {
                        return option.name;
                    }

                    return "请选择";
                })();
                m.$emit(events.select,select_el);
            },

            //确认选择
            confirmFilterGp:function(gpData,index){
                var m = this;
                gpData.list.forEach(gpItem=>{
                    gpItem.valuesOld = gpItem.values.concat();
                })

                if( m.current_picker_ins) {
                    m.current_picker_ins.close();
                }

                var value = []
                gpData.list.forEach(function(el){
                    value = value.concat(el.values);
                })
                gpData.value = value;
                m.$emit(events.filter,gpData);
            },
            //恢复
            filterGpRevert:function(){
                var m = this;
            },

            //做选择
            filterGpChoice(choice,gp){
                var m = this;
                if(choice.checked) {
                    choice.checked = false;
                    _.pull(gp.values,choice.id);


                }else{
                    if(gp.parentClassify.type == 1) {
                        gp.values.length = 0;
                        gp.childrenClassify.forEach(el=>el.checked=false)
                    }
                    choice.checked = true;
                    gp.values.push(choice.id);

                }
            },

            //打开
            openPickerGp:function(gpData,index){
                var m = this;
                var pk_ins = m.$refs[m.pickerPrefix + index][0];
                if(pk_ins) {
                    m.current_picker_ins = pk_ins;
                    //恢复数据
                    gpData.list.forEach(gpItem=>{
                        gpItem.childrenClassify.forEach(function(el){
                            if(gpItem.valuesOld.indexOf(el.id)==-1) {
                                el.checked = false;
                            }else{
                                el.checked = true;
                            }
                        })
                    })

                    pk_ins.open();
                }
            },



            buttonClick:function(el){
                var m = this;


                m.$emit(events.button,el)
            },




            get_input_name:function(){
                return "name_" + new Date()*1;
            }
        },
        creataed: function () {
            var m = this;
            m.ssrrcc = m.src;
        },
        mounted: function () {
            var m = this;
        },

        watch: {
            dataList: function (list) {
                var m = this;
                if (!list || !list.length) {
                    return;
                }
            }
        },
        computed: {
            data: function () {
                var m = this;
                return m.dataList;
            }
        },
        props: {
            dataList: {
                type: Array,
                default: []
            }
        },
        components:{
            Picker
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/vars";
    @import "../styles/tool";

    @bd:1px solid #E4E3E6;
    .trangle{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAfUlEQVQoU52RwRWDMAxDpQ26UUcBNuDkzGBf2hHCJmymvvCAB2kuwUc/fUu2ic5ipx7PAHfPJFczyy3HiBgBvM1s2hx2YAAw1ZC7zyQ/kpaU0nhGakFH7xCX4bcdLlCWRJLDVfwHVPFQi5tAaUbEV9KrZK6P8OysPc/rdvgB8M4+Dasw7VYAAAAASUVORK5CYII=);
    }
    html body .filter-bar{

        position: relative;
        &:before{
            position: absolute;
            content:"";
            width: 100%;
            height: 1px;
            background-color: #f5f5f5;
            top: 0px;
            left: 0;
            z-index: 5;
        }

        .grid{
            align-items: stretch;
        }

        .list-block{
            margin: 0;
            font-size: 1rem;

            .item-inner{
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAfUlEQVQoU52RwRWDMAxDpQ26UUcBNuDkzGBf2hHCJmymvvCAB2kuwUc/fUu2ic5ipx7PAHfPJFczyy3HiBgBvM1s2hx2YAAw1ZC7zyQ/kpaU0nhGakFH7xCX4bcdLlCWRJLDVfwHVPFQi5tAaUbEV9KrZK6P8OysPc/rdvgB8M4+Dasw7VYAAAAASUVORK5CYII=");
                background-size: auto;
            }

            .item-after{
                font-size: 0.8rem;
            }

            .item-content{
                .item-inner{
                    min-height:0;
                }
            }
        }

        .col-auto{
            position: relative;
            //border-bottom: @bd;
            //border-top:@bd;
            //border-color: #C8C7CC;
            &:after{
                height: 50%;
                top: 25%;
                width: 1px;
                position: absolute;
                background-color: @cl_bd_light;
                content: "";
                right: 0;
            }

            &:last-child{
                &:after{
                    display: none;
                }
            }


            .item-title{
                color: @cl_flat_black;
            }

            >.btn{
                .lineh(@top-bar-height);
                color: @cl_flat_black;
                font-size: 1rem;
                text-indent: 0.5em;
                width: 100%;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                background: none no-repeat 85% 50%;
                .trangle;
                background-color: #ffffff;
                text-align: center;

                span{ }

                &.check-btn{
                    background-image: none !important;
                }

                .picker-modal-overlay{
                    position: fixed;
                }

                &.checked{
                    background-color: #eee;
                }
            }

            .list-block{
                >ul{
                    &:after,&:before{
                        display: none;
                    }
                }
            }


        }
    }

</style>
