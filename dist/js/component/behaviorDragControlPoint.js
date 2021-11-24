const dragControlPoint = {
    getEvents() {
        return {
            "node:mousedown": "handleNodeMouseDown",
            mousemove: "handleMouseMove",
            mouseup: "handleMouseUp"
        };
    },
    currentItem:null,
    direction:{
        name:'',
        position:''
    },
    dragState:false,
    point:{
        x:0,
        y:0
    },
    cachePoint:{
        x:0,
        y:0
    },
    handleNodeMouseDown(evt){
        const { target , item} = evt;
        this.currentItem = item;
        if(target.cfg.className === 'control-point'){
            let direction = target.get('name');
            let model = item.getModel();
            if(!model.recordPoint){
                model.recordPoint = {};
            }
            this.point.x = evt.x;
            this.point.y = evt.y;
            this.cachePoint.x = evt.x;
            this.cachePoint.y = evt.y;
            this.dragState = true;
            this.direction.name = direction;
            if(direction === 'bottom-center'){
                model.recordPoint.pointBC = 0;
            }
        }
    },
    handleMouseMove(evt){
        const { target } = evt;
        // if(target.cfg.className === 'control-point'){
        //
        // }
        if(this.dragState){
            let point = {
                x:0,
                y:0
            };
            let diffY = evt.y - this.point.y;
            if(this.direction.name === 'top-center'){
                if(diffY > 0){
                    point.y = - (evt.y - this.cachePoint.y);
                    this.direction.position = 'down';
                    //console.log('top down');
                }else if(diffY < 0){
                    point.y = this.cachePoint.y - evt.y;
                    this.direction.position = 'up';
                    // console.log('top up');
                }
            }
            if(this.direction.name === 'bottom-center'){
                if(diffY < 0){
                    point.y = (evt.y - this.cachePoint.y);
                    this.direction.position = 'up';
                }else if(diffY > 0){
                    point.y = -(this.cachePoint.y - evt.y);
                    this.direction.position = 'down';
                }
            }
            this.cachePoint.y = evt.y;
            this.cachePoint.x = evt.x;
            this.updateNodeSize(this.currentItem,point);
        }
    },
    handleMouseUp(){
        this.dragState = false;
        this.currentItem = null;
    },
    updateNodeSize(item,point){
        let model = item.getModel();
        //todo
        model.style.width ?model.style.width += point.x:model.style.width = model.size[0] + point.x;
        model.style.height?model.style.height+= point.y:model.style.height= model.size[1] + point.y;
        // model.size[0] = model.style.width;
        // model.size[1] = model.style.height;
        model.direction = this.direction;
        model.point = point;
        this.graph.updateItem(item,model,true);
    }
};
G6.registerBehavior("dragControlPoint", dragControlPoint);
