<script type="text/ecmascript-6">
    import $ from "jquery";
    var shutCutEvent = "dosearch";
    export default {
        data:function(){
            return {
                input:""
            }
        },


        render: function (c) {
            var self = this;
            var clearEl, cancelEl, inputEl, inputWrapEl;
            inputEl = c('input', {
                attrs: {
                    'placeholder': self.placeholder,
                    'type': 'search'
                },
                on: {
                    input: self.onInput,
                    change: self.onChange,
                    focus: self.onFocus,
                    blur: self.onBlur
                }
            });
            if (self.clearButtonComputed) {
                clearEl = c('a', {
                    staticClass: 'searchbar-clear',
                    attrs: {
                        'href': '#'
                    },
                    on: {
                        click: self.onClearClick
                    }
                });
            }
            if (self.cancelLink) {
                cancelEl = c('a', {
                    staticClass: 'searchbar-cancel',
                    attrs: {
                        'href': '#'
                    },
                    domProps: {
                        innerHTML: self.cancelLink
                    },
                    on: {
                        click: self.onCancelClick
                    }
                });

                self.cancelEl = cancelEl;
            }
            inputWrapEl = c('div', {staticClass: 'searchbar-input'}, [inputEl, clearEl])

            return c(self.form ? 'form' : 'div', {
                staticClass: 'searchbar',
                on: {
                    'submit': self.onSubmit,
                    'searchbar:search': self.onSearch,
                    'searchbar:enable': self.onEnable,
                    'searchbar:disable': self.onDisable,
                    'searchbar:clear': self.onClear
                }
            }, [self.$slots['before-input'], inputWrapEl, self.$slots['after-input'], cancelEl, self.$slots.default]);
        },
        beforeDestroy: function () {
            if (this.f7Searchbar && this.f7Searchbar.destroy) this.f7Searchbar.destroy();
        },
        props: {
            form: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: 'Search'
            },
            cancelLink:{
                type:String,
                default:"取消"
            } ,
            clear: Boolean,
            clearButton: {
                type: Boolean,
                default: false
            },

            // SB Params
            params: Object,
            searchList: [String, Object],
            searchIn: {
                type: String,
                default: '.item-title'
            },
            searchBy: String,
            found: [String, Object],
            notFound: [String, Object],
            overlay: [String, Object],
            ignore: {
                type: String,
                default: '.searchbar-ignore'
            },
            customSearch: {
                type: Boolean,
                default: true
            },
            removeDiacritics: {
                type: Boolean,
                default: false
            },
            hideDividers: {
                type: Boolean,
                default: true
            },
            hideGroups: {
                type: Boolean,
                default: true
            },
            init: {
                type: Boolean,
                default: true
            },

            //标识是否存在与navabar中
            inNavbar:{
                type:Boolean,
                defalut:false
            },

            value:{
                type:String,
                default:""
            },

        },

        watch:{
            /**
             * 设置内容
             */
            "value":function(v){
                var m = this;
                m.ip.val(v);
                m.onSubmit();
            }
        },
        computed: {
            clearButtonComputed: function () {
                var self = this;
                var cb = self.clearButton;
                if (self.$options.propsData.clear === false) {
                    cb = false;
                }
                return cb;
            }
        },
        methods: {
            search: function (query) {
                if (!this.f7Searchbar) return;
                return this.f7Searchbar.search(query)
            },
            enable: function () {
                if (!this.f7Searchbar) return;
                return this.f7Searchbar.enable()
            },
            disable: function () {
                if (!this.f7Searchbar) return;
                return this.f7Searchbar.disable()
            },
            empty: function () {
                if (!this.f7Searchbar) return;
                return this.f7Searchbar.clear()
            },
            onChange: function (event) {
                this.key = this.input.value;
                this.$emit('change', event);
            },
            onInput: function (event) {
                this.key = this.input.value;
                this.$emit('input', event.target.value);
            },
            onFocus: function (event) {
                this.$emit('focus', event);
            },
            onBlur: function (event) {
                this.$emit('blur', event);
            },
            onSubmit: function (event) {
                var m = this;
                m.$emit('submit', event);
                m.$emit(shutCutEvent,m.ip.val())
                m.ip.blur();
            },
            onSearch: function (event) {
                if (!event.detail) return;
                this.$emit('searchbar:search', event.detail.query, event.detail.foundItems);
            },
            onClear: function (event) {
                this.$emit('searchbar:clear', event);
            },
            onEnable: function (event) {
                this.$emit('searchbar:enable', event);
            },
            onDisable: function (event) {
                this.$emit('searchbar:disable', event);
            },
            onClearClick: function (event) {
                var m = this;
                this.$emit('click:clear', event);
                this.$emit(shutCutEvent,"")
            },
            onCancelClick: function (event) {
                var m = this;
                this.$emit('click:cancel', event);
                this.$emit(shutCutEvent,"")
            },
            onF7Init: function () {
                var self = this;
                if (!self.init) return;
                self.f7Searchbar = self.$f7.searchbar(self.$el, self.params || {
                        searchList: self.searchList,
                        searchIn: self.searchIn,
                        searchBy: self.searchBy,
                        found: self.found,
                        notFound: self.notFound,
                        overlay: self.overlay,
                        ignore: self.ignore,
                        customSearch: self.customSearch,
                        removeDiacritics: self.removeDiacritics,
                        hideDividers: self.hideDividers,
                        hideGroups: self.hideGroups
                    });
            },
            cancel(){
                var m = this;
                var cancelEl = $(".searchbar-cancel",m.$el);

                //触发一次取消按钮

            }

        },
        mounted:function(){
            var m = this;
            m.ip = m.$$("input",m.$el);

            if(m.inNavbar) {
                var p = m.$$(m.$el).parent();

                if(p.siblings().length == 0) {
                    //加到navbar-inner
                    p.parent().addClass("has-search-bar");
                }else{
                    //加到left,center,right上
                    p.addClass("has-search-bar");
                }

            }
        }
    }


</script>
