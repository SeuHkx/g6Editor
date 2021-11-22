const hoverSelectBehavior = {
    getEvents() {
        return {
            "node:mouseenter": "onNodeMouseenter",
            "node:mouseleave": "onNodeMouseleave"
        };
    },
    onNodeMouseenter(evt) {
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
        }
    },
    onNodeMouseleave(evt) {
        const nodeItem = evt.item; // 获取鼠标离开的节点元素对象
        if(nodeItem.getModel().type !== "image" && nodeItem.getModel().type.indexOf('boxImage') < 0){
            nodeItem.update({
                linkPoints: {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false
                }
            });
        }
    }
};
G6.registerBehavior("hover", hoverSelectBehavior);
