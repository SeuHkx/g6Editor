const clickNodeImageBehavior = {
    getEvents() {
        return {
            "node:click": "onNodeClick",
            "canvas:click": "onCanvasClick"
        };
    },
    onNodeClick:function (evt) {
        const graph = this.graph;
        const nodeItem = evt.item;
        if(nodeItem.getModel().type.indexOf('boxImage') > -1){
            const clickNodes = graph.findAllByState('node', 'click');
            clickNodes.forEach((n) => {
                graph.setItemState(n, 'click', false);
            });
            graph.setItemState(nodeItem, 'click', true);
            dataModel.comp.rightPanelControl.show(function (el) {
                let loadFormEl = el.querySelector('#rightPanelForm');
                let nodeModel = nodeItem.getModel();
                let props = nodeItem.getModel().props;
                CreateForm.init({
                        container:loadFormEl,
                        init:function (el) {
                            let id = el.id;
                            $('#'+id).on('input','.layui-input',function () {
                                let $this = $(this);
                                let val = $this.val();
                                let name= $this.attr('name');
                                let model = {
                                    props:{}
                                };
                                if(name === 'name'){
                                    model.label = val;
                                    model.props['name'] = val;
                                }else{
                                    model.props[name] = val;
                                }
                                graph.updateItem(nodeItem,model,true);
                            });
                        }},
                    props,dataPower);
                if(typeof SimpleBar.instances.get(loadFormEl) !== 'undefined'){
                    SimpleBar.instances.get(loadFormEl).unMount();
                }
                new SimpleBar(loadFormEl);
            });
            dataModel.clickNode = {
                node:nodeItem
            }
        }
    },
    onCanvasClick:function (e) {
        const graph = this.graph;
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach((n) => {
            graph.setItemState(n, 'click', false);
        });
        dataModel.comp.rightPanelControl.hide(function (el) {
            let loadFormEl = el.querySelector('#rightPanelForm');
            if(typeof SimpleBar.instances.get(loadFormEl) !== 'undefined'){
                SimpleBar.instances.get(loadFormEl).unMount();
            }
            loadFormEl.innerHTML = '';
            dataModel.clickNode = {};
        });
    }
};
G6.registerBehavior('clickNodeImage', clickNodeImageBehavior);
