const isPlainObject = (obj) => {
    if (typeof obj !== "object" || obj === null) return false;

    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    // 拿obj最初的__proto__跟obj次顶层的__proto__做对比
    return Object.getPrototypeOf(obj) === proto;
};
// G6自定义行为 - 拖拉增加连线
const dragAddEdgeBehavior = {
    edge: null,
    dragArrowEdge:false,
    dragEnterTarget:null,
    anchorIndex: {
        top: 0,
        right: 1,
        bottom: 2,
        left: 3
    },
    getAnchorIndexByName(name) {
        if (!name.startsWith("link-point")) {
            return;
        }
        const pos = name.split("-")[2];
        return this.anchorIndex[pos];
    },

    isNotSelf(e) {
        const { edge } = this;
        const { item } = e;
        return item.getModel().id !== edge.getSource().getModel().id;
    },

    canFindTargetAnchorPoint(e) {
        return this.isEnabledAnchorPoint(e) && this.isNotSelf(e);
    },

    isEnabledAnchorPoint(e) {
        const { target } = e;
        return !!target.get("isAnchorPoint");
    },
    shouldAddRealEdge() {
        const { edge } = this;
        if(edge){
            const target = edge.getTarget();
            return !isPlainObject(target);
        }
    },
    getEvents() {
        return {
            "node:mousedown": "handleNodeMouseDown",
            "edge:dragstart":"handleEdgeDragStart",
            "edge:drag":"handleEdgeDragMove",
            "node:dragenter" :"onDragEnter",
            "node:dragleave" :"onDragLeave",
            dragend: "handleDragEnd",
            mousemove: "handleMouseMove",
            mouseup: "handleMouseUp"
        };
    },
    handleEdgeDragStart(evt){
        this.edge = evt.item;
        this.dragArrowEdge = true;
        this.graph.updateItem(this.edge,{
            target:{
                x: evt.x,
                y: evt.y
            },
            targetAnchor:null,
            targetNode:null
        });
    },
    onDragEnter(evt){
        const nodeItem = evt.item; // 获取鼠标进入的节点元素对象
        if(nodeItem.getModel().type !== "image" && nodeItem.getModel().type.indexOf('boxImage') < 0){
            nodeItem.update({
                linkPoints: {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                }
            });
            this.dragEnterTarget = evt;
        }
    },
    onDragLeave(){
        this.dragEnterTarget = null;
    },
    handleEdgeDragMove(evt){
        const { graph, edge } = this;
        if (!edge) {
            return;
        }
        if(this.dragEnterTarget && this.canFindTargetAnchorPoint(this.dragEnterTarget)){
            const { item, target } = this.dragEnterTarget;
            const targetId = item.getModel().id;
            const targetAnchor = this.getAnchorIndexByName(target.get("name"));
            graph.updateItem(edge, {
                target: targetId,
                targetAnchor
            });
            console.log('add',targetAnchor,targetId,edge);
        }else{
            graph.updateItem(edge,{
                target:{
                    x: evt.x,
                    y: evt.y
                }
            });
        }
    },
    handleDragEnd(evt){
        this.dragArrowEdge = false;
        this.edge = null;
    },
    handleNodeMouseDown(evt) {
        const { target , item} = evt;
        if (!target.get("isAnchorPoint") || item.getModel().type.indexOf('boxImage') > -1) {
            return;
        }
        const sourceNode = evt.item;
        const sourceNodeId = sourceNode.getModel().id;
        const model = {
            id: Math.random() * 100,
            type: "polyline",
            source: sourceNodeId,
            sourceAnchor: this.getAnchorIndexByName(target.get("name")),
            target: {
                x: evt.x,
                y: evt.y
            }
        };
        this.edge = this.graph.addItem("edge", model,true);
    },
    handleMouseMove(evt) {
        const { graph, edge } = this;
        if (!edge) {
            return;
        }
        if (this.canFindTargetAnchorPoint(evt)) {
            const { item, target } = evt;
            const targetId = item.getModel().id;
            const targetAnchor = this.getAnchorIndexByName(target.get("name"));
            graph.updateItem(edge, {
                target: targetId,
                targetAnchor
            });
        } else {
            if(!this.dragArrowEdge){
                graph.updateItem(edge,{
                    target:{
                        x: evt.x,
                        y: evt.y
                    }
                });
            }
        }
    },
    handleMouseUp() {
        const { graph, edge } = this;
        if(!this.dragArrowEdge){
            if (!edge) {
                return;
            }
            if (!this.shouldAddRealEdge()) {
                graph.removeItem(edge);
            }
            this.edge = null;
            console.log('up')
        }
    }
};
G6.registerBehavior("drag-add-edge", dragAddEdgeBehavior);
