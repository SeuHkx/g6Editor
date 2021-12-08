const clickNodeImageBehavior = {
    getEvents() {
        return {
            "node:click": "onNodeClick",
            "node:dragstart":"handleNodeDragStart",
            "canvas:click": "onCanvasClick",
            "keydown":"onKeyDown",
            "keyup":"onKeyUp",
            "node:drag": "handleDragMove",
            dragend: "handleDragend"
        };
    },
    getDefaultCfg() {
        return {
            trigger: 'shift'
        }
    },
    keyState:null,
    selectNodes:[],
    selectNode :null,
    dragStart:false,
    dragPoint:{
        x:0,
        y:0
    },
    handleNodeDragStart(evt){
        console.log('drag start',this.keyState);
        let nodeItem = evt.item;
        if(this.keyState === null){
            if(!nodeItem.hasState('click')){
                this.onNodeClick(evt);
            }else{
                this.dragStart = true;
                this.selectNode= nodeItem;
                this.dragPoint.x = evt.x;
                this.dragPoint.y = evt.y;
            }
        }
    },
    handleDragMove(evt){
        if(this.dragStart && this.keyState === null  && this.selectNodes.length > 1){
            let diffX = evt.x - this.dragPoint.x;
            let diffY = evt.y - this.dragPoint.y;
            this.dragPoint.x = evt.x;
            this.dragPoint.y = evt.y;
            console.log(this.selectNodes.length);
            this.selectNodes.forEach(node=>{
                if(node !== this.selectNode){
                    let model= node.getModel();
                    let point = {
                        x: model.x,
                        y: model.y,
                    };
                    point.x += diffX;
                    point.y += diffY;
                    node.updatePosition(point,true);
                }
            });
        }
    },
    handleDragend(){
        if(this.keyState === null){
            this.selectNode= null;
            this.dragStart = false;
        }
    },
    onNodeClick(evt) {
        const graph = this.graph;
        const nodeItem = evt.item?evt.item:evt;
        console.log('click start',nodeItem);
        if(this.trigger === 'shift' && this.keyState && this.keyState === 16){
            if(nodeItem.hasState('click')){
                graph.setItemState(nodeItem, 'click', false);
                this.arrRemove(nodeItem,this.selectNodes);
            }else {
                graph.setItemState(nodeItem, 'click', true);
                if(this.selectNode){
                    this.selectNodes.push(this.selectNode);
                    this.selectNode = null;
                }
                this.selectNodes.push(nodeItem);
            }
            console.log(this);
        }else{
            this.selectNode = nodeItem;
            this.keyCopyNode= nodeItem;
            this.selectNodes= [];
            this.setItemState(nodeItem);
            if(this.shouldBegin(nodeItem)){
                return true;
            }
        }
    },
    setItemState(nodeItem){
        const graph = this.graph;
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach((n) => {
            graph.setItemState(n, 'click', false);
        });
        graph.setItemState(nodeItem, 'click', true);
    },
    removeItemState(){
        const graph = this.graph;
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach((n) => {
            graph.setItemState(n, 'click', false);
        });
    },
    onCanvasClick() {
        this.removeItemState();
        this.restoreNodeState();
        if(this.shouldEnd()){
            return true;
        }
    },
    restoreNodeState(){
        this.selectNode = null;
        this.selectNodes= [];
    },
    arrRemove(o, arr) {
        if (!arr || arr.length === 0) {
            return ""
        }
        let flag = arr.indexOf(o);
        if (flag > -1) {
            arr.splice(flag, 1);
            return arr;
        } else {
            console.log("未查找到该元素")
        }
    },
    keyCopyNode:null,
    keyCopy(e){
        if (e.ctrlKey || e.metaKey) {
            if (e.keyCode === 67) {}//ctrl+c 复制
            if (e.keyCode === 86) { //ctrl+v 粘贴
                if(this.keyCopyNode){
                    let model = this.keyCopyNode.getModel();
                    let uuid  = Math.floor(Math.random() * 1000) + "node";
                    let _model = this.deepCopy(model);
                    _model.id = uuid;
                    _model.x += 10;
                    _model.y += 10;
                    this.graph.addItem('node',_model,true);
                    this.keyCopyNode = this.graph.findById(uuid);
                    this.onNodeClick(this.keyCopyNode);
                }
            }
        }
    },
    onKeyDown(e){
        this.keyState = e.keyCode;
        this.keyCopy(e);
    },
    onKeyUp(){
        this.keyState = null;
    },
    deepCopy(obj) {
        if (obj instanceof Object) {
            let newObj = {};
            if (Array.isArray(obj)) {
                let arr = [];
                obj.forEach(item => {
                    arr.push(this.deepCopy(item));
                });
                return arr;
            } else {
                for (let key in obj) {
                    let value = obj[key];
                    if (typeof value == 'function') {
                        newObj[key] = value.bind(newObj);
                    } else if (typeof value == 'object') {
                        if (Array.isArray(value)) {
                            newObj[key] = [];
                            value.forEach(item => {
                                newObj[key].push(this.deepCopy(item));
                            })
                        } else {
                            newObj[key] = this.deepCopy(value);
                        }
                    } else {
                        newObj[key] = value;
                    }
                }
            }
            return newObj;
        } else {
            return obj;
        }
    }
};
G6.registerBehavior('clickNodeImage', clickNodeImageBehavior);
