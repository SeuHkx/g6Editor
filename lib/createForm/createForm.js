;(function () {
    let CreateForm = function () {
        if (!(this instanceof CreateForm)) {
            return new CreateForm();
        }
        this.version = '1.0.0';
    };
    CreateForm.fn = CreateForm.prototype;
    let createForm = CreateForm.fn.init = function (config,props,data) {
        if (!(this instanceof createForm)) {
            return new createForm(config,props,data);
        }
        this.config = {
            container:null,
            init:function(){},
            createInit:function(){},
            tempWrapHTML:'<form class="layui-form"></form>',
            tempHTML:`<div class="layui-form-item">
                        <label class="layui-form-label" formlabel="displayName"></label>
                        <div class="layui-input-block" formtype="widget"></div>
                      </div>`,
            tempWidget:{},
            tempValueRules:{
                label :'formlabel',
                widget:'formtype',
                dataFiled:{
                    name:'name',
                    displayName:'displayName',
                    type:'type'
                }
            },
            tempDataConvertType:{
                text:'input',
                tree:'input',
                date:'input',
                textArea:'textArea',
                combo:'select'
            }
        };
        CreateForm.utils.extends(this.config,config);
        this.init(props,data);
    };
    let createFormMethods = {
        init:function (props,data) {
            if(!Array.isArray(data))return;
            let htmlDOM = this.getTempHTMLToDOM();
            this.generateDataTemp(props,data,htmlDOM);
        },
        generateDataTemp:function(props,data,htmlDOM){
            let fragment = document.createDocumentFragment();
            data.forEach((d) =>{
                let n = this.createTemp(props,d,htmlDOM);
                if(typeof this.config.createInit === 'function')this.config.createInit(d,n);
                fragment.appendChild(n);
            });
            let element = this.getTempWrapHTMLToDOM(fragment);
            this.clearContainerDOM();
            this.config.container.appendChild(element);
            this.config.init.call(this,element);
            if(typeof this.config.tempWidget.init !== 'undefined')this.config.tempWidget.init();
        },
        clearContainerDOM:function(){
            this.config.container.innerHTML = '';
        },
        getTempWrapHTMLToDOM:function(fragment){
            let id  = CreateForm.utils.uuid();
            let dom = CreateForm.utils.parseDOM(this.config.tempWrapHTML)[0];
            dom.id = id;
            dom.appendChild(fragment);
            return dom;
        },
        getTempHTMLToDOM:function(){
            let htmlDOM  = {};
            let nodes = CreateForm.utils.parseDOM(this.config.tempHTML);
            nodes.forEach((n)=>{
                htmlDOM.parentNode = n;
                htmlDOM.label = n.querySelector('['+this.config.tempValueRules.label+']');
                htmlDOM.widget= n.querySelector('['+this.config.tempValueRules.widget+']');
            });
            return htmlDOM;
        },
        createTemp:function (props,data,htmlDOM) {
            let htmlStr = '';
            let dataFiledType = data[this.config.tempValueRules.dataFiled.type];
            let htmlType = this.config.tempDataConvertType[dataFiledType];
            //let value =
            if(!props)props={};
            let value = props[data[this.config.tempValueRules.dataFiled.name]]?props[data[this.config.tempValueRules.dataFiled.name]]:'';
            let name  = data[this.config.tempValueRules.dataFiled.name];
            if(htmlType === 'input'){
                htmlStr = '<'+htmlType+' type="text" class="layui-input input" name="'+name+'" value="'+value+'" />';
            }
            if(htmlType === 'textArea'){
                htmlStr = '<textarea class="layui-textarea input" name='+name+' value='+ value +'>'+value+'</textarea>';
            }
            if(!CreateForm.utils.isEmpty(this.config.tempWidget)){
                if(this.config.tempWidget[dataFiledType]){
                    htmlStr = this.config.tempWidget[dataFiledType](data,name,value);
                }
            }
            htmlDOM.label.innerHTML  = data[this.config.tempValueRules.dataFiled.displayName];
            htmlDOM.widget.innerHTML = htmlStr;
            return CreateForm.utils.parseDOM(htmlDOM.parentNode.outerHTML)[0];
        }
    };
    CreateForm.utils = {
        isObject:function () {
            let arg = [].slice.call(arguments)[0];
            return Object.prototype.toString.call(arg) === '[object Object]';
        },
        extends:function (source, target) {
            for (let k in target) {
                if (CreateForm.utils.isObject(target[k])) {
                    CreateForm.utils.extends(source[k], target[k]);
                } else {
                    source[k] = target[k];
                }
            }
        },
        copy:function (s,t) {
            for (let i in t) {
                s[i] = t[i];
            }
            return s;
        },
        parseDOM:function (str) {
            let objE = document.createElement("div");
            objE.innerHTML = str;
            return objE.childNodes;
        },
        uuid:function () {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        },
        isEmpty:function (o) {
            for(let k in o){
                return false
            }
            return true;
        }
    };
    CreateForm.utils.copy(createForm.prototype, createFormMethods);
    window.CreateForm = CreateForm();
})();

