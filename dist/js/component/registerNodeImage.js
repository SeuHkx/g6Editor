/**
 *3*3矩阵变换,用于二维渲染
 const newmatrix = transform(matrix,[
 ['t' 100,50],// translate偏移效果
 ['r', Math. Pi /4],// rotate旋转效果
 ['s',2,0.5],// scale升腾效果
 */
const Util = G6.Util;
//单个图片的时候为boxImage
G6.registerNode(
    'boxImage',
    {
        setState(name, value, item) {
            const group = item.getContainer();
            const shape = group.get('children')[0];
            if (name === 'click') {
                if (value) {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 1);
                } else {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 0);
                }
            }
        },
        draw(cfg, group){
            //todo 未更新imgsize
            let imgSize = cfg.imgSize?cfg.imgSize:cfg.size;
            let style = this.getShapeStyle(cfg,group);
            cfg.size[0] = style.width;
            cfg.size[1] = style.height;
            let shape = group.addShape('rect', {
                attrs: {
                    x: -style.width / 2,
                    y: -style.height/ 2,
                    width : style.width,
                    height: style.height,
                    fill: 'transparent',
                    stroke: '#168DF8',
                    radius: 0,
                    opacity: 0,
                },
                name: 'image-box',
                draggable: true,
            });
            group.addShape('image', {//
                attrs: {
                    x: -imgSize[0] / 2,
                    y: -imgSize[1] / 2,
                    height: imgSize[1],
                    width:  imgSize[0],
                    img: cfg.img,
                },
                name: 'image-content',
                draggable: true,
            });
            return shape;
        },
    },
    'rect'
);
//冷却泵
G6.registerNode(
    'boxImage-pump',
    {
        setState(name, value, item) {
            const group = item.getContainer();
            const shape = group.get('children')[0]; // 顺序根据 draw 时确定此处[0]代表name:'image-box'
            if (name === 'click') {
                if (value) {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 1);
                } else {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 0);
                }
            }
        },
        draw: (cfg, group) => {
            let shape = group.addShape('rect', {
                //外边框
                attrs: {
                    x: -cfg.size[0] / 2,
                    y: -cfg.size[1] / 2,
                    width: cfg.size[0],
                    height: cfg.size[1],
                    fill: 'transparent',
                    stroke: '#168DF8',
                    radius: 0,
                    opacity: 0,
                },
                name: 'image-box',
                draggable: true,
            });
            group.addShape('image', {
                //冷冻机外壳
                attrs: {
                    x: -cfg.size[0] / 4 - (cfg.size[0] / 50) * 3,
                    y: -cfg.size[1] / 4 + cfg.size[0] / 100,
                    height: cfg.size[0] / 2,
                    width: cfg.size[1] / 2 + cfg.size[1] / 10,
                    img: cfg.img[0],
                },
                name: 'image-content',
                draggable: true,
            });
            return shape;
        },
        afterDraw(cfg, group) {
            const image = group.addShape('image', {
                //冷冻机扇叶
                attrs: {
                    x: -cfg.size[0] / 8,
                    y: -cfg.size[1] / 8,
                    height: cfg.size[0] / 4,
                    width : cfg.size[1] / 4,
                    img: cfg.img[1],
                },
                name: 'image-content-part',
                draggable: true,
            });
            // image.animate(
            //     (ratio) => {
            //         const toMatrix = Util.transform([1, 0, 0, 0, 1, 0, 0, 0, 1], [['r', ratio * Math.PI * 2]]);
            //         return {
            //             matrix: toMatrix,
            //         };
            //     },
            //     {
            //         repeat: true,
            //         duration: 2000,
            //         easing: 'easeLinear',
            //     }
            // );
            //image.pauseAnimate();//暂停
            // img.resumeAnimate();//启用
            // img.isAnimatePaused();
        }
    },
    'rect'
);
//板换
G6.registerNode(
    'boxImage-plate',
    {
        setState(name, value, item) {
            const group = item.getContainer();
            const shape = group.get('children')[0]; // 顺序根据 draw 时确定此处[0]代表name:'image-box'
            if (name === 'click') {
                if (value) {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 1);
                } else {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 0);
                }
            }
        },
        draw: (cfg, group) => {
            let r = 2;
            cfg.linkPoints = {
                top: true,
                bottom: true,
                left: true,
                right: true,
            };
            let shape = group.addShape('rect', {
                //外边框
                attrs: {
                    x: -cfg.size[0] / 2,
                    y: -cfg.size[1] / 2,
                    width: cfg.size[0],
                    height: cfg.size[1],
                    fill: 'transparent',
                    stroke: '#168DF8',
                    radius: r,
                    opacity: 0,
                },
                name: 'image-box',
                draggable: true,
            });
            group.addShape('image', {
                //板换外壳
                attrs: {
                    x: -cfg.size[0] / 4 - (cfg.size[0] / 50) * 3,
                    y: -cfg.size[1] / 4 +  cfg.size[0] / 100,
                    height: cfg.size[1] / 2,
                    width : cfg.size[0] / 2 + cfg.size[0] / 10,
                    img: cfg.img[0],
                },
                name: 'image-content',
                draggable: true,
            });
            return shape;
        },
        afterDraw(cfg, group) {
            const image = group.addShape('image', {
                //板换蒸汽
                attrs: {
                    x: -cfg.size[0] / 2,
                    y: -cfg.size[1] / 2 + cfg.size[1]/20 + 10,
                    height: cfg.size[0],
                    width: cfg.size[1],
                    img: cfg.img[1],
                },
                name: 'image-content-part',
                draggable: true,
            });
            // image.animate(
            //     (ratio) => {
            //         const toMatrix = Util.transform([1, 0, 0, 0, 1, 0, 0, 0, 1], [['s', ratio*1,1]]);
            //         return {
            //             matrix: toMatrix,
            //         };
            //     },
            //     {
            //         repeat: true,
            //         duration: 2000,
            //         easing: 'easeLinear',
            //     }
            // );
            // img.pauseAnimate();暂停
            // img.resumeAnimate();启用
            // img.isAnimatePaused();
        }
    },
    'rect'
);
//冷却塔
G6.registerNode(
    'boxImage-tower',
    {
        setState(name, value, item) {
            const group = item.getContainer();
            const shape = group.get('children')[0]; // 顺序根据 draw 时确定此处[0]代表name:'image-box'
            const children = group.getChildren();
            if (name === 'click') {
                if (value) {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 1);
                } else {
                    shape.attr('stroke', '#168DF8');
                    shape.attr('opacity', 0);
                }
                children.forEach(child =>{
                    if(child.cfg.className === 'control-point' || child.cfg.className === 'rotate-point'){
                        if(value){
                            child.show();
                        }else{
                            child.hide();
                        }
                    }
                });
            }
        },
        draw(cfg, group){
            let style = this.getShapeStyle(cfg,group);
            cfg.size[0] = style.width;
            cfg.size[1] = style.height;
            let shape = this.addEditBox(group,style);
            this.addEditBoxImg(cfg,group,style);
            this.addRotatePoint(group,style);
            this.addControlPoints(group,style);
            this.addTextShape(group,cfg,style);
            this.setShapeRotate(group,style);
            return shape;
        },
        //todo
        setShapeRotate(group,style,model){
            let nodes  = group.get('children');
            if(style.angle){
                nodes.forEach(function (node) {
                    let x = model&&model.hasOwnProperty('recordPoint')?(model.recordPoint.pointLC + model.recordPoint.pointRC)/2:0;
                    let y = model&&model.hasOwnProperty('recordPoint')?(model.recordPoint.pointTC + model.recordPoint.pointBC)/2:0;
                    let center = [x,y];
                    let matrix = node.getMatrix();
                    let radian = (Math.PI / 180)*style.angle;
                    // 图形或分组的初始矩阵时 null，为了避免变换一个 null 矩阵，需要将其初始化为单位矩阵
                    if (!matrix){
                        matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
                    }
                    // 3*3 矩阵变换，用于二维渲染
                    const newMatrix = Util.transform(matrix, [
                        ['t', -center[0], -center[1]], // translate
                        ['r', radian],// rotate
                        ['t', center[0], center[1]]// translate
                    ]);
                    node.resetMatrix();
                    node.setMatrix(newMatrix);
                });
            }
        },
        afterDraw(cfg, group) {
            // const image = group.addShape('image', {
            //     //冷却塔蒸汽
            //     attrs: {
            //         x: -cfg.size[0] / 2,
            //         y: -cfg.size[1] + cfg.size[1]/50*9,
            //         height: cfg.size[0],
            //         width: cfg.size[1],
            //         img: cfg.img[1],
            //     },
            //     name: 'image-content-part',
            //     visible:false,
            //     draggable: true,
            // });
        },
        addEditBox(group,style){
            return group.addShape('rect', {
                //外边框
                attrs: {
                    x: -style.width / 2,
                    y: -style.height/ 2,
                    width: style.width,
                    height: style.height,
                    fill: 'transparent',
                    stroke: '#168DF8',
                    radius: 0,
                    opacity: 0,
                    fillOpacity:0
                },
                name: 'image-box',
                draggable: true,
            });
        },
        addEditBoxImg(cfg,group,style){
            group.addShape('image', {
                attrs: {
                    x: -(style.width - 10)/ 2 ,
                    y: -(style.height- 20)/ 2 ,
                    height: style.height - 20,
                    width : style.width - 10 ,
                    img: cfg.img[0]
                },
                name: 'image-content',
                draggable: true,
            });
        },
        addRotatePoint(group,style){
            group.addShape('image',{
               attrs:{
                   stroke: '#168DF8',
                   width:20,
                   height:20,
                   x:-10,
                   y:(-style.height/2 - 10 ) - 30,
                   // x:-10,
                   // y:-10,
                   img:'public/images/旋转.svg',
                   cursor:'crosshair'
               },
                visible:false,
                className:'rotate-point',
                name:'top-center'
            });
        },
        addControlPoints(group,style){
            group.addShape('rect',{
               attrs:{
                   fill:"#fff",
                   stroke: '#168DF8',
                   lineWidth: 1,
                   width:6,
                   height:6,
                   x:-3,
                   y:-style.height/2 - 3,
                   cursor:'ns-resize'
               },
                visible:false,
                className:'control-point',
                name:"top-center"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:-style.width /2 - 3,
                    y:-style.height/2 - 3,
                    cursor:'nwse-resize '
                },
                visible:false,
                className:'control-point',
                name:"top-left"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:style.width /2  - 3,
                    y:-style.height/2 - 3,
                    cursor:'nesw-resize'
                },
                visible:false,
                className:'control-point',
                name:"top-right"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:style.width /2 - 3,
                    y:style.height/2 - 3,
                    cursor:'nwse-resize'
                },
                visible:false,
                className:'control-point',
                name:"bottom-right"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:-style.width /2 - 3,
                    y:style.height/2 - 3,
                    cursor:'nesw-resize'
                },
                visible:false,
                className:'control-point',
                name:"bottom-left"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:-3,
                    y:style.height/2 - 3,
                    cursor:'ns-resize'
                },
                visible:false,
                className:'control-point',
                name:"bottom-center"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:-style.width /2 - 3,
                    y:-3,
                    cursor:'ew-resize'
                },
                visible:false,
                className:'control-point',
                name:"left-center"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 1,
                    width:6,
                    height:6,
                    x:style.width /2 - 3,
                    y:-3,
                    cursor:'ew-resize'
                },
                visible:false,
                className:'control-point',
                name:"right-center"
            });
        },
        addTextShape(group,cfg,style){
            let text = cfg.hasOwnProperty('label')?cfg.label:'';
            let visible = style.hasOwnProperty('labelShow')?style.labelShow:false;
            group.addShape('text', {
                attrs: {
                    text: text,
                    stroke: '#fff',
                    fontWeight: 200,
                    x: 0,
                    y: 0,
                    textAlign: 'center',
                    textBaseline: 'middle',
                },
                visible:visible,
                name:'text-shape',
                draggable: true
            });
        },
        update:function (cfg, item) {
            const model = item.getModel();
            const group = item.getContainer();
            const nodes = group.get('children');
            const {width,height} = model.style;
            const controlPointsUpdateDirection = this.controlPointsUpdateDirection();
            //控制点不一样的时候 方向不一样
            //拖拽bottom-center y为原来的坐标点或者更新过后的坐标点 x不更新 比如 y:-55
            //拖拽top-center y为原来的坐标点绝对值|55| + 动态变化的高度 y:-height+55
            if(model.direction){
                nodes.forEach(function (node) {
                    if(node.cfg.name === 'image-box'){
                        //当拖动的控制点为top-center时候
                        if(model.direction.name === 'top-center'){
                            //获取当前节点的y轴的绝对值静态坐标
                            let absY = Math.abs(node.cfg.attrs.y);
                            if(model.direction.position === 'up' || model.direction.position === 'down'){
                                //当第一次拖动的时候，model.recordPoint.pointBC为0
                                //不是第一次的时候，model.recordPoint.pointBC为拖动底部控制点移动的相对的距离
                                node.attr({
                                    height,
                                    y:-height + absY + model.recordPoint.pointBC
                                });
                            }
                        }
                        if(model.direction.name === 'left-center'){
                            let absX = Math.abs(node.cfg.attrs.x);
                            if(model.direction.position === 'left' || model.direction.position === 'right'){
                                node.attr({
                                    width,
                                    x:-width + absX + model.recordPoint.pointRC
                                });
                            }
                        }
                        //根据坐标的原则 底部和右侧的拖动 不需要改变坐标点
                        if(model.direction.name === 'bottom-center'){
                            if(model.direction.position === 'up' || model.direction.position === 'down'){
                                node.attr({
                                    height
                                });
                            }
                        }
                        if(model.direction.name === 'right-center'){
                            if(model.direction.position === 'right' || model.direction.position === 'left'){
                                node.attr({
                                    width
                                });
                            }
                        }
                        // node.attr({
                        //     width,
                        //     height,
                        //     x:-width/2,
                        //     y:-height/2
                        // });
                    }
                    if(node.cfg.name === 'image-content'){
                        //获取图元的大小内间距
                        let diffHeight = model.size[1] - node.cfg.attrs.height;
                        let diffWidth  = model.size[0] - node.cfg.attrs.width;
                        if(model.direction.name === 'bottom-center'){
                            node.attr({
                                height:height - diffHeight
                            });
                        }
                        if(model.direction.name === 'right-center'){
                            node.attr({
                                width:width - diffWidth,
                            });
                        }
                        if(model.direction.name === 'top-center'){
                            let absY = node.cfg.attrs.y;
                            node.attr({
                                height:height - diffHeight,
                                y:absY + model.recordPoint.pointTC + 3 //多减了一个点的像素 所以要加3
                            });
                        }
                        if(model.direction.name === 'left-center'){
                            let absX = node.cfg.attrs.x;
                            node.attr({
                                width:width - diffWidth,
                                x:absX + model.recordPoint.pointLC + 3 //多减了一个点的像素 所以要加3
                            });
                        }
                        // node.attr({
                        //     x: -width / 4 - (width / 50) * 3,
                        //     y: -height/ 4 +  width / 100,
                        //     height: width / 2,
                        //     width : height / 2 + height / 10,
                        // });
                    }
                    if(node.cfg.name === 'image-content-part'){
                        node.attr({
                            x: -width / 2,
                            y: -height + height/50*9,
                            height,
                            width,
                        })
                    }
                    if(node.cfg.className === 'control-point'||node.cfg.className === 'rotate-point'){
                        switch (node.cfg.name) {
                            case 'top-center':
                                if(model.direction.name === 'top-center'){
                                    controlPointsUpdateDirection.topCenter(node,model);
                                }
                                if(model.direction.name === 'left-center'|| model.direction.name === 'right-center'){
                                    controlPointsUpdateDirection.leftCenter(node,model,true);
                                }
                                // if(model.direction.name === 'right-center'){
                                //     controlPointsUpdateDirection.rightCenter(node,model);
                                //     console.log('2')
                                // }
                                // node.attr({
                                //     y:-height/2 - 3,
                                // });
                                break;
                            case 'top-left':
                                if(model.direction.name === 'top-center'){
                                    controlPointsUpdateDirection.topCenter(node,model);
                                }
                                if(model.direction.name === 'left-center'){
                                    controlPointsUpdateDirection.leftCenter(node,model);
                                }
                                // if(model.direction.name === 'bottom-center'){
                                //     controlPointsUpdateDirection.bottomCenter(node,model);
                                // }
                                // node.attr({
                                //     x:-width /2 - 3,
                                //     y:-height/2 - 3
                                // });
                                break;
                            case 'top-right':
                                if(model.direction.name === 'top-center'){
                                    controlPointsUpdateDirection.topCenter(node,model);
                                }
                                if(model.direction.name === 'right-center'){
                                    controlPointsUpdateDirection.rightCenter(node,model);
                                }
                                // if(model.direction.name === 'bottom-center'){
                                //     controlPointsUpdateDirection.bottomCenter(node,model);
                                // }
                                // node.attr({
                                //     x:width /2  - 3,
                                //     y:-height/2 - 3
                                // });
                                break;
                            case 'bottom-center':
                                if(model.direction.name === 'bottom-center'){
                                    controlPointsUpdateDirection.bottomCenter(node,model);
                                }
                                if(model.direction.name === 'left-center'||model.direction.name === 'right-center'){
                                    controlPointsUpdateDirection.leftCenter(node,model,true);
                                }
                                // node.attr({
                                //     x:0,
                                //     y:height/2 - 3
                                // });
                                break;
                            case 'bottom-left':
                                if(model.direction.name === 'bottom-center'){
                                    controlPointsUpdateDirection.bottomCenter(node,model);
                                }
                                if(model.direction.name === 'left-center'){
                                    controlPointsUpdateDirection.leftCenter(node,model);
                                }
                                // node.attr({
                                //     x:-width /2 - 3,
                                //     y: height/2 - 3
                                // });
                                break;
                            case 'bottom-right':
                                if(model.direction.name === 'bottom-center'){
                                    controlPointsUpdateDirection.bottomCenter(node,model);
                                }
                                if(model.direction.name === 'right-center'){
                                    controlPointsUpdateDirection.rightCenter(node,model);
                                }
                                // node.attr({
                                //     x:width /2 - 3,
                                //     y:height/2 - 3
                                // });
                                break;
                            case 'left-center':
                                if(model.direction.name === 'top-center'||model.direction.name === 'bottom-center'){
                                    controlPointsUpdateDirection.topCenter(node,model,true);
                                }
                                if(model.direction.name === 'left-center'){
                                    controlPointsUpdateDirection.leftCenter(node,model);
                                }
                                // node.attr({
                                //     x:-width /2 - 3,
                                //     y:0
                                // });
                                break;
                            case 'right-center':
                                if(model.direction.name === 'top-center'|| model.direction.name === 'bottom-center'){
                                    controlPointsUpdateDirection.topCenter(node,model,true);
                                }
                                if(model.direction.name === 'right-center'){
                                    controlPointsUpdateDirection.rightCenter(node,model);
                                }
                                // node.attr({
                                //     x:width /2 - 3,
                                //     y:0
                                // });
                                break;
                        }
                    }
                    if(node.cfg.name === 'text-shape'){

                    }
                });
            }
            if(model.dragRotation){
                this.setShapeRotate(group,model.style,model);
            }
            //有控制label需求重新复写
            if(cfg.hasOwnProperty('label')){
                let textShape = nodes[nodes.length - 1];
                let oldTextShapeValue = textShape.attr('text');
                let newTextShapeValue = cfg.label;
                if(oldTextShapeValue !== newTextShapeValue){
                    cfg.labelCfg = {
                        style:{
                            stroke:'#fff',
                            fill:'#000'
                        }
                    };
                    textShape.attr('text',cfg.label);
                }
            }
        },
        controlPointsUpdateDirection(){
            //更新对应顶部控制的中心点坐标
            let topCenter = function (node,model,center) {
                //获取节点大小的一半
                let nodeHalfHeight = node.cfg.className === 'rotate-point'?node.attr('height')/2 + 30:node.attr('height')/2;
                let height = model.style.height;
                //获取静态绝对坐标点 例如只有Y 就获取Y
                let absY = Math.abs(model.size[1]/2);
                let pointY = 0;
                //通过参数判断 是否是两侧中心点的坐标
                if(center){
                    //关于model.recordPoint 初始化为0
                    //-3 是控制点大小的一半
                    //有两种情况
                    //1.当首次拖动顶部的控制点的时候，model.recordPoint.pointBC为0 不参与中心点的计算
                    //2.当不是第一次拖动顶部的控制点的时候，model.recordPoint.pointBC不为0，参与中心点的实时计算，值对应的是拖动底部的控制点移动的距离
                    pointY = -height/2 + absY + model.recordPoint.pointBC - nodeHalfHeight;
                }else{
                    //关于model.recordPoint.pointTC 为控制点移动的距离 参与图形大小 y轴动态改变的计算
                    pointY = -height + absY + model.recordPoint.pointBC - nodeHalfHeight;
                    model.recordPoint.pointTC = absY + pointY;
                }
                if(model.direction.position === 'up' || model.direction.position === 'down'){
                    node.attr({
                        y:pointY
                    });
                }
            };
            let leftCenter = function(node,model,center){
                let nodeHalfWidth = node.attr('width')/2;
                let width = model.style.width;
                //获取静态绝对坐标点 例如只有Y 就获取Y
                let absX = Math.abs(model.size[0]/2);
                let pointX = 0;
                //通过参数判断 是否是两侧中心点的坐标
                if(center){
                    //关于model.recordPoint 初始化为0
                    //-3 是控制点大小的一半
                    //有两种情况
                    //1.当首次拖动顶部的控制点的时候，model.recordPoint.pointBC为0 不参与中心点的计算
                    //2.当不是第一次拖动顶部的控制点的时候，model.recordPoint.pointBC不为0，参与中心点的实时计算，值对应的是拖动底部的控制点移动的距离
                    pointX = -width/2 + absX + model.recordPoint.pointRC - nodeHalfWidth;
                }else{
                    //关于model.recordPoint.pointTC 为控制点移动的距离 参与图形大小 y轴动态改变的计算
                    pointX = -width + absX + model.recordPoint.pointRC - nodeHalfWidth;
                    model.recordPoint.pointLC = absX + pointX;
                }
                if(model.direction.position === 'left' || model.direction.position === 'right'){
                    node.attr({
                        x:pointX
                    });
                }
            };
            //更新对应底部控制的中心点坐标
            let bottomCenter = function (node,model) {
                let nodeHalfHeight = node.attr('height')/2;
                //获取静态绝对坐标点 例如只有Y 就获取Y -3是减去控制点大小的一半
                let absStaticPointY = Math.abs(model.size[1]/2) - nodeHalfHeight;
                //获取动态的y轴坐标点
                let pointY = node.attr('y');
                //通过自身叠加的移动的距离
                pointY += model.point.y;
                //model.recordPoint.pointBC为缓存 点移动的相对中心点的距离
                model.recordPoint.pointBC = pointY - absStaticPointY;
                if(model.direction.position === 'up' || model.direction.position === 'down'){
                    node.attr({
                        y:pointY
                    });
                }
            };
            let rightCenter = function (node,model) {
                let nodeHalfWidth = node.attr('width')/2;
                //获取静态绝对坐标点 例如只有Y 就获取Y -3是减去控制点大小的一半
                let absStaticPointX = Math.abs(model.size[0]/2) - nodeHalfWidth;
                //获取动态的y轴坐标点
                let pointX = node.attr('x');
                //通过自身叠加的移动的距离
                pointX += model.point.x;
                //model.recordPoint.pointBC为缓存 点移动的相对中心点的距离
                model.recordPoint.pointRC = pointX - absStaticPointX;
                if(model.direction.position === 'right' || model.direction.position === 'left'){
                    node.attr({
                        x:pointX
                    });
                }
            };
            return {
                topCenter:topCenter,
                bottomCenter:bottomCenter,
                rightCenter:rightCenter,
                leftCenter:leftCenter
            }
        }
    },
    'rect'
);
