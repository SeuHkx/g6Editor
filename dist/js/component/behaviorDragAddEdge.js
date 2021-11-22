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

        const target = edge.getTarget();

        return !isPlainObject(target);
    },
    getEvents() {
        return {
            "node:mousedown": "handleNodeMouseDown",
            mousemove: "handleMouseMove",
            mouseup: "handleMouseUp"
        };
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
            graph.updateItem(edge, {
                target: {
                    x: evt.x,
                    y: evt.y
                }
            });
        }
    },
    handleMouseUp() {
        const { graph, edge } = this;
        if (!edge) {
            return;
        }
        if (!this.shouldAddRealEdge()) {
            graph.removeItem(edge);
        }
        this.edge = null;
    }
};
G6.registerBehavior("drag-add-edge", dragAddEdgeBehavior);
