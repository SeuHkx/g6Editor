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
    dragRotation:false,
    pointRotate:{
        x:0,
        y:0,
        cacheX:0,
        cacheY:0,
        angle:0
    },
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
        if(target.cfg.className === 'rotate-point'){
            this.dragRotation = true;
            this.pointRotate.x = evt.x;
            this.pointRotate.y = evt.y;
        }
        if(target.cfg.className === 'control-point'){
            console.log(target);
            let direction = target.get('name');
            let model = item.getModel();
            if(!model.recordPoint){
                model.recordPoint = {
                    pointTC:0,
                    pointRC:0,
                    pointBC:0,
                    pointLC:0
                };
            }
            this.point.x = evt.x;
            this.point.y = evt.y;
            this.cachePoint.x = evt.x;
            this.cachePoint.y = evt.y;
            this.dragState = true;
            this.direction.name = direction;
        }
    },
    handleMouseMove(evt){
        const { target } = evt;
        if(this.dragRotation){
            let point = {
                x:0,
                y:0
            };
            point.x = evt.x;
            point.y = evt.y;
            this.updateNodeSize(this.currentItem,point);
        }
        if(this.dragState){
            let point = {
                x:0,
                y:0
            };
            let diffY = evt.y - this.point.y;
            let diffX = evt.x - this.point.x;
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
            if(this.direction.name === 'left-center'){
                if(diffX > 0){
                    point.x = -(evt.x - this.cachePoint.x);
                    this.direction.position = 'right';
                }else if(diffX < 0){
                    point.x = this.cachePoint.x - evt.x;
                    this.direction.position = 'left';
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
            if(this.direction.name === 'right-center'){
                if(diffX > 0){
                    point.x = (evt.x - this.cachePoint.x);
                    this.direction.position = 'right';
                }else if(diffX < 0){
                    point.x = -(this.cachePoint.x - evt.x);
                    this.direction.position = 'left';
                }
            }
            this.cachePoint.y = evt.y;
            this.cachePoint.x = evt.x;
            this.updateNodeSize(this.currentItem,point);
        }
    },
    handleMouseUp(){
        if(this.currentItem && !this.currentItem.destroyed){
            let model = this.currentItem.getModel();
            delete model.direction;
            delete model.dragRotation;
        }
        this.dragState = false;
        this.dragRotation = false;
        this.currentItem = null;
    },
    updateNodeSize(item,point){
        let model = item.getModel();
        if(this.dragState){
            model.style.width ?model.style.width += point.x:model.style.width = model.size[0] + point.x;
            model.style.height?model.style.height+= point.y:model.style.height= model.size[1] + point.y;
            model.direction = this.direction;
            model.point = point;
        }
        if(this.dragRotation){
            model.dragRotation = this.dragRotation;
            let R2D = 180 / Math.PI;
            let radian = Math.atan2((point.y-model.y), (point.x-model.x)) + Math.PI / 2;
            let angleMove  = radian*R2D;
            let angle = angleMove - this.pointRotate.angle;
            this.pointRotate.angle = angleMove;
            model.style.angle = angle;
            console.log(angle);
        }
        this.graph.updateItem(item,model,true);
    }
};
G6.registerBehavior("dragControlPoint", dragControlPoint);
