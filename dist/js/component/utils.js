let utils = {
    averageHorizontal(nodes){

    },
    alignHorizontalCenter(nodes){
        //中心对齐
        let points = [];
        if(nodes.length>1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let bbox = node.getBBox();
                points[index] = bbox.centerY;
            });
            let middle = this._middle(points);
            nodes.forEach(function (node) {
                let bbox = node.getBBox();
                let model = node.getModel();
                let diffY = middle - bbox.centerY;
                let point= {
                    y:model.y + diffY
                };
                node.updatePosition(point);
            });
        }
    },
    alignVerticalCenter(nodes){
        //中心对齐
        let points = [];
        if(nodes.length>1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let bbox = node.getBBox();
                points[index] = bbox.centerX;
            });
            let middle = this._middle(points);
            nodes.forEach(function (node) {
                let bbox = node.getBBox();
                let model = node.getModel();
                let diffX = middle - bbox.centerX;
                let point= {
                    x:model.x + diffX
                };
                node.updatePosition(point);
            });
        }
    },
    alignLeft(nodes){
        //左对齐
        let points = [];
        if(nodes.length > 1&& Array.isArray(nodes)){
            nodes.forEach(function (node,index) {
                let bbox = node.getBBox();
                points[index] = {
                    x: bbox.minX
                };
            });
            points.sort(this._compare("x",true));
            let min = points[0];
            nodes.forEach(function (node) {
                let bbox = node.getBBox();
                if(bbox.minX !== min.x){
                    let model = node.getModel();
                    let width = model.style.hasOwnProperty('width') ? model.style.width : model.size[0];
                    let diffX = min.x - bbox.centerX;
                    let point = {
                        x:model.x + diffX + width/2,
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
                let bbox = node.getBBox();
                points[index] = {
                    x: bbox.maxX
                };
            });
            points.sort(this._compare("x",false));
            let max = points[0];
            nodes.forEach(function (node) {
                let bbox = node.getBBox();
                if(bbox.maxX !== max.x){
                    let model = node.getModel();
                    let width = model.style.hasOwnProperty('width') ? model.style.width : model.size[0];
                    let diffX = max.x - bbox.centerX;
                    let point = {
                        x:model.x + diffX - width/2,
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
                let bbox = node.getBBox();
                points[index] = {
                    y: bbox.minY
                };
            });
            points.sort(this._compare("y",true));
            let min = points[0];
            nodes.forEach(function (node) {
                let bbox = node.getBBox();
                if(bbox.minY !== min.y){
                    let model  = node.getModel();
                    let height = model.style.hasOwnProperty('height') ? model.style.height : model.size[1];
                    let diffY= min.y - bbox.centerY;
                    let point = {
                        x:model.x,
                        y:model.y + diffY + height/2
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
                let bbox = node.getBBox();
                points[index] = {
                    y: bbox.maxY
                };
            });
            points.sort(this._compare("y"));
            let max = points[0];
            nodes.forEach(function (node) {
                let bbox = node.getBBox();
                if(bbox.maxY !== max.y){
                    let model  = node.getModel();
                    let height = model.style.hasOwnProperty('height') ? model.style.height : model.size[1];
                    let diffY= max.y - bbox.centerY;
                    let point = {
                        x:model.x,
                        y:model.y + diffY - height/2
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
    },
    _middle(args){
        args.sort(); //排序
        if(args.length%2===0){ //判断数字个数是奇数还是偶数
            return ((args[args.length/2]+args[args.length/2-1])/2);//偶数个取中间两个数的平均数
        }else{
            return args[parseInt(args.length/2)];//奇数个取最中间那个数
        }
    }
};
