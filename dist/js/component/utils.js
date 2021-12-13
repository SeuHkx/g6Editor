//todo 拉伸的时候 坐标点变了 需要重新计算坐标点
let utils = {
    alignCenter(nodes){
        //中心对齐
        let points = [];
        if(nodes.length>1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                points[index] = node.getModel().x;
            });
            let min = Math.min.apply(null,points);
            nodes.forEach(function (node) {
                let model= node.getModel();
                if(model.x !== min){
                    let point = {
                        x:min,
                        y:model.y
                    };
                    node.updatePosition(point,true);
                }
            });
        }
    },
    alignLeft(nodes){
        //左对齐
        let points = [];
        if(nodes.length > 1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let model = node.getModel();
                let w = model.style.hasOwnProperty('width') ? model.style.width : model.size[0];
                let insideX = 0;
                if(model.hasOwnProperty('centerPoint'))insideX = model.centerPoint.insideX - 3;
                points[index] = {
                    x: model.x + insideX -  w/2,
                    w: w
                };
            });
            points.sort(this._compare("x",true));
            let min = points[0];
            console.log(points);
            nodes.forEach(function (node) {
                let model= node.getModel();
                let w = model.style.hasOwnProperty('width') ? model.style.width : model.size[0];
                let pointX = model.hasOwnProperty('centerPoint')?model.x + model.centerPoint.insideX:model.x;
                if((pointX -  w/2) !== min.x){
                    let point = {
                        x:min.x + w/2,
                        y:model.y
                    };
                    node.updatePosition(point);
                }
            });
        }
    },
    alignRight(nodes){
        //右对齐
        let points = [];
        if(nodes.length>1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let model = node.getModel();
                points[index] = {
                    x: model.x,
                    w: model.style.hasOwnProperty('width') ? model.style.width : model.size[0]
                };
            });
            points.sort(this._compare("x",false));
            let min = points[0];
            nodes.forEach(function (node) {
                let model= node.getModel();
                let w = model.style.hasOwnProperty('width') ? model.style.width : model.size[0];
                if(model.x !== min.x){
                    let dx = 0;
                    if(min.w < w){
                        dx = min.x - w/2 + min.w/2;
                    }else{
                        dx = min.x + (min.w/2 - w/2);
                    }
                    let point = {
                        x:dx,
                        y:model.y
                    };
                    node.updatePosition(point,true);
                }
            });
        }
    },
    alignTop(nodes){
        //顶对齐
        let points = [];
        if(nodes.length>1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let model = node.getModel();
                points[index] = {
                    y: model.y,
                    h: model.style.hasOwnProperty('height') ? model.style.height : model.size[1]
                };
            });
            points.sort(this._compare("y",true));
            let min = points[0];
            console.log(points,min);
            nodes.forEach(function (node) {
                let model= node.getModel();
                let h = model.style.hasOwnProperty('height') ? model.style.height : model.size[1];
                if(model.y !== min.y){
                    let dy = 0;
                    if(min.h < h){
                        dy = min.y + h/2 - min.h/2;
                    }else{
                        dy = min.y - (min.h/2 - h/2);
                    }
                    let point = {
                        x:model.x,
                        y:dy
                    };
                    node.updatePosition(point,true);
                }
            });
        }
    },
    alignBottom(nodes){
        //底对齐
        let points = [];
        if(nodes.length>1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let model = node.getModel();
                points[index] = {
                    y: model.y,
                    h: model.style.hasOwnProperty('height') ? model.style.height : model.size[1]
                };
            });
            points.sort(this._compare("y"));
            let min = points[0];
            console.log(points,min);
            nodes.forEach(function (node) {
                let model= node.getModel();
                let h = model.style.hasOwnProperty('height') ? model.style.height : model.size[1];
                if(model.y !== min.y){
                    let dy = 0;
                    if(min.h < h){
                        dy = min.y + (min.h/2 - h/2);
                    }else{
                        dy = min.y - (min.h/2 - h/2);
                    }
                    let point = {
                        x:model.x,
                        y:dy
                    };
                    node.updatePosition(point,true);
                }
            });
        }
    },
    toFront(nodes){
        nodes.forEach(function (node) {
            node.toFront();
        });
    },
    toBack(nodes){
        nodes.forEach(function (node) {
            node.toBack();
        });
    },
    _compare(p,t){
        return function(m,n){
            let a = m[p];
            let b = n[p];
            if(t){
                return a - b;
            }else{
                return b - a;
            }
        }
    }
};
