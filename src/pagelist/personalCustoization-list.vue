<template type="text/html" lang="jade">
    f7-page(:class="name",  @page:beforeanimation="pageAnimated")
        f7-navbar(sliding="")
            f7-nav-left
                f7-link(icon="i-fanhui",back="")
            f7-nav-center 私人订制
        .cataBar
            .btnDropdown
            .dropdownPanel
            .btnScroller
                a.btn(
                    v-for="(it,index) in cata.list",
                    :class="{active:cata.index == index}",
                    @click="cata.index = index"
                )   {{it.label}}
                
        .customFilterBar
            .btnCont
                a.btn(
                    v-for="(it,index) in filter.list",
                    :class="{active:it.active}",
                    @click="openPicker(it)"
                )
                    span(v-show="it.useCurrentTitle") {{it.currentTitle || it.label}}
                    span(v-show="!it.useCurrentTitle") {{it.label}}
                    i.icon.i-drop-down

        .scroller
            .list-warpper()
                .custom-list-item(v-for="(it,index) in dataList")
                        .img
                            img(:src="vars.oss_url_base + it.cover|ossResize(120)")

                        .right.shortcut-class
                            .main-info
                                h5.title(v-html="it.name")

                            .add-info
                                .row.between
                                    span 价格 :￥{{it.price}}
                                    span 已售:{{it.saledNum}}
                                .row.sqLabelRow
                                    f7-button.label.thin.hide.green {{it.travelType}}
                                    f7-button.label.thin.hide.green {{it.starting}}




        picker.personalCustoizationCustomFilterBarPicker(ref="picker", :title="currentFilter.label", @close="pickerCancel")
            .subjectCont
                .subject(v-for="subj in currentFilter.subjects")
                    .label {{subj.label}}
                    .choiceCont
                        .choice(
                            v-for="ch in subj.choiceList",
                            @click="doChoice(subj,ch)",
                            :class="{ed:subj.result.indexOf(ch.id)!=-1}"
                        ) {{ch.label}}
            f7-button.confirm.big(color="red",fill, @click="pickerConfirm")  确认



</template>

<script type="text/ecmascript-6">

    let parseVarInString = function(string){
        var counter=0;
        return string.replace(/\$\{\w+\}/g,(text,i)=>{
            return "id_" + i;
        })
    }

    let parseVar = function(jsonObject){
        return JSON.parse(
            parseVarInString(
                JSON.stringify(
                    jsonObject
                )
            )
        )
    }


    var subjectList = parseVar({
        router:{
            label:"游玩线路",
            result:[],
            id:"${id}",

            //11多选
            //1单选
            type:11,
            choiceList:[
                {id:"${id}",        label:"西岳华山一地"},
                {id:"${id}",        label:"延安+兵马俑.."},
                {id:"${id}",        label:"华清池+兵马俑"},
                {id:"${id}",        label:"华清池+兵马俑+华山+西安市内"},
                {id:"${id}",        label:"西岳华山一地"},
            ]
        },
        sorting:{
            label:"排序",
            result:[0],
            id:"${id}",
            type:1,
            choiceList:[
                {id:"${id}",        label:"推荐排序"},
                {id:"${id}",        label:"30天销售量最高"},
                {id:"${id}",        label:"满意度最高"},
                {id:"${id}",        label:"价格由高到低"},
                {id:"${id}",        label:"价格由低到高"},
            ]
        },

        numberOfDay:{
            label:"行程天数",
            result:[],
            id:"${id}",
            type:11,
            choiceList:[
                {id:"${id}",        label:"1天"},
                {id:"${id}",        label:"2天"},
                {id:"${id}",        label:"3天"},
                {id:"${id}",        label:"4天"},
                {id:"${id}",        label:"5天"},
                {id:"${id}",        label:"6天"},
            ]
        },

        relativeTourist:{
            label:"相关景点",
            result:[],
            id:"${id}",
            type:11,
            choiceList:[
                {id:"${id}",        label:"华山"},
                {id:"${id}",        label:"北峰"},
                {id:"${id}",        label:"东峰"},
                {id:"${id}",        label:"南峰"},
                {id:"${id}",        label:"西峰"},
                {id:"${id}",        label:"兵马俑"},
            ]
        }
    });


    let getSubjectsByNames = function(subjectNames){
        return subjectNames.split(",").map(el=>{
            var subj = subjectList[el];
            subj.lastResult = [];
            return Object.assign({},subj)
        })
    }


    var filterItems = [
        {label:"排序",    activated:false,  currentTitle:"",  useCurrentTitle:true,    subjects:getSubjectsByNames("sorting")},
        {label:"游玩线路", activated:false,  currentTitle:"",    subjects:getSubjectsByNames("router")  },
        {label:"行程天数", activated:false,  currentTitle:"",    subjects:getSubjectsByNames("numberOfDay")},
        {label:"全部筛选", activated:false,  currentTitle:"",    subjects:getSubjectsByNames("relativeTourist,numberOfDay")},
    ];

    var dicId2Choid = new Map();

    export default {
        computed:{
            pk(){return this.$refs.picker}
        },
        data:function(){
            return {
                name:"personalCustoization-list",
                cata:{
                    index:0,
                    list:[
                        {label:"产品推荐"},
                        {label:"跟团"},
                        {label:"自由行"},
                        {label:"自驾"},
                        {label:"酒店"},
                        {label:"门票"},
                        {label:"自驾"},
                        {label:"当地玩乐"},
                    ]
                },
                filter:{
                    list:filterItems
                },

                currentFilter:{},

                dataList:[]
            }
        },
        mounted(){

        },
        methods:{
            openPicker(filterBarItem){
                var m = this;
                //m.pk.title = filterBarItem.label;
                m.currentFilter = filterBarItem;
                m.currentFilter.subjects.forEach(el=>{
                    el.lastResult = Object.assign([],el.result);
                })
                m.pk.show();
            },

            doChoice(subj,choice){
                var m = this;

                var index = subj.result.indexOf(choice.id);

                if(index == -1) {

                    //单选/多选
                    if(subj.type==1){
                        subj.result = [choice.id]
                    }else{
                        subj.result.push(choice.id)
                    }
                }else{
                    subj.result.splice(index,1);
                }

                dicId2Choid.set(subj.id + choice.id,choice);


            },

            pickerConfirm(){
                var m = this;
                m.currentFilter.subjects.forEach(el=>{
                    el.lastResult  = Object.assign([],el.result);
                })
                m.pk.hide();

                m.currentFilter.currentTitle = m.currentFilter.subjects.map(subj=>{
                    return subj.result.map(choiceId=>{
                        var choice = dicId2Choid.get(subj.id + choiceId)
                        return choice.label;
                    }).join(",")
                }).join(",")
            },

            pickerCancel(){
                var m = this;
                m.currentFilter.subjects.forEach(el=>{
                    el.result  = Object.assign([],el.lastResult);
                });
            },


            pageAnimated(){
                var m = this;
                m.req("customization/list")
                    .then(resp=>{
                        m.dataList = resp.list;
                    })
                ;
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../styles/vars";
    @import "../styles/tool";
    @name:personalCustoization-list;
    .toolClass();
    .@{name}{

        .cataBar,.customFilterBar{
            .lineh(39);
            background-color: #fff;
            border-top: 1px solid #f0f0f0;
        }

        .cataBar{
            width: 100%;
            overflow: hidden;
            .btnScroller{
                white-space: nowrap;
                margin : 0 @page-edge/2;
                overflow-x: auto;
                &:after{
                    content:"";
                    height: 18px;
                    display: block;
                }
                .btn{
                    padding:0 @page-edge;
                    display: inline-block;
                    vertical-align: top;
                    box-sizing: border-box;
                    &.active{
                        //border-bottom: 3px solid @cl_flat_green;
                        color: @cl_flat_green;
                        position: relative;
                        &:after{
                            content:"";
                            position: absolute;
                            width: 100%;
                            height: 3px;
                            background-color: @cl_flat_green;
                            left: 0;
                            bottom: 0;
                        }
                    }
                }
            }
        }
        .customFilterBar{
            padding:0 @page-edge;
            .btnCont{
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.8rem;
                .btn{
                    color: @cl_flat_green;
                    .icon{
                        font-size: 0.7rem;
                    }
                }
            }
            border-bottom:1px solid #f0f0f0;
        }



        .page-content{
            display: flex;
            flex-direction: column;

        }


        .list-warpper{
            flex: 1;
            background-color: #fff;

            padding:@page-edge;

            .custom-list-item{
                display: flex;
                margin-bottom:@page-edge;
                align-items: stretch;

                .title{
                    position: static;
                    transform: none;
                    text-align: left;
                    color: #3D3D3D;
                    font-size: 0.9rem;
                    text-shadow: none;
                    border: none;
                    padding-left: 0;
                    margin-bottom: 0.25em;
                }

                .label.button.thin{
                    display: inline-block;
                    padding: 0 0.25em;
                    margin-right: @page-edge/2;
                    .lineh(1.3em);
                    /*transform:scale(0.9);*/
                }

                >.img{
                    height: 7.2em;
                    width: 8em;
                    margin-right:@page-edge/2;
                    img{
                        display: block;
                        &:extend(.expandin);
                        border-radius:0;
                    }
                }

                .right{
                    flex: 1;
                    //background-color: #f0f0f0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
            }

            .star-list{
                color: #E9E9E9;
            }

            .hide{
                display: none;
            }

            //商户
            &.JINGDIAN,
            &.MEISHI,
            &.JIUDIAN,
            &.TECHAN,
            .merchantElement
            {
                .label.hide{
                    display: inline;
                }
                .mark-merchant.hide{
                    display: block;
                }

                .mark-qita{
                    display: none;
                }
            }

            &.JINGDIAN{
                .row-with-sell{
                    display: flex;
                }
                .row-without-sell{
                    display: none;
                }
            }

            &.QIYU{
                .mark-qiyu.hide{
                    display: block;
                }
                .mark-qita{
                    display: none;
                }
            }

            &.HUODONG{
                .label.hide{
                    display: inline;
                }
                .mark-huodong.hide{
                    display: block;
                }
                .mark-qita{
                    display: none;
                }
            }

            &.JIAOTONG,&.SHIPIN{
                .mark-qita{
                    display: none;
                }
            }

            &.ZIXUN{
                .shoucang-icon{
                    display: none;
                }
            }

            &.DAOYOU{
                .mark-daoyou.hide{
                    display: block;
                }

                .mark-qita{
                    display: none;
                }

                .img{
                    width: 7.2em;
                    img{
                        border-radius: 50%;
                    }
                }

                .main-info{
                    h5{
                        color: @cl-orange;
                    }
                }

                .pricerow{
                    margin-bottom: 0.75em;
                }
            }
        }


        .sqLabelRow{
            margin-top: 0.25rem;
        }

        .scroller{
            flex: 1;
            overflow-y: auto;
        }

    }


    .personalCustoizationCustomFilterBarPicker{
        .subject{
            >.label{
                color: @cl_flat_green;
                font-size: 0.9rem;
                border-bottom:1px solid @cl_bd_light;
                margin-bottom: 0.25rem;
                padding-bottom: 0.25rem;
            }
            .choiceCont{
                font-size: 0;
                margin-bottom: 1rem;
                .choice{
                    vertical-align: top;
                    font-size: 0.8rem;
                    width: 33%;
                    text-align: center;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    height: 4em;
                    background-color: @cl_bd_light;
                    box-sizing: border-box;
                    border: 3px solid #fff;

                    &.ed{
                        color: #ffffff;
                        background-color: @cl_flat_green;

                    }
                }
            }
        }
    }
</style>
