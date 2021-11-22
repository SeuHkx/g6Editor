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
            let imgSize = cfg.imgSize?cfg.imgSize:cfg.size;
            let shape = group.addShape('rect', {//外边框
                attrs: {
                    x: -cfg.size[0] / 2,
                    y: -cfg.size[1] / 2,
                    width:  cfg.size[0],
                    height: cfg.size[1],
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
        },
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
                    if(child.cfg.className === 'control-point'){
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
                //冷却塔外壳
                attrs: {
                    x: -cfg.size[0] / 4 - (cfg.size[0] / 50) * 3,
                    y: -cfg.size[1] / 4 + cfg.size[0] / 100,
                    height: cfg.size[0] / 2,
                    width : cfg.size[1] / 2 + cfg.size[1] / 10,
                    img: cfg.img[0],
                },
                name: 'image-content',
                draggable: true,
            });
            this.addControlPoints(group,style);
            return shape;
        },
        afterDraw(cfg, group) {
            const image = group.addShape('image', {
                //冷却塔蒸汽
                attrs: {
                    x: -cfg.size[0] / 2,
                    y: -cfg.size[1] + cfg.size[1]/50*9,
                    height: cfg.size[0],
                    width: cfg.size[1],
                    img: cfg.img[1],
                },
                name: 'image-content-part',
                visible:false,
                draggable: true,
            });
            // image.animate(
            //     (ratio) => {
            //         const toMatrix = Util.transform([1, 0, 0, 0, 1, 0, 0, 0, 1], [['s', 1, ratio * 1]]);
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
        },
        addControlPoints(group,style){
            group.addShape('rect',{
               attrs:{
                   fill:"#fff",
                   stroke: '#168DF8',
                   lineWidth: 0.5,
                   width:6,
                   height:6,
                   x:0,
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
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:-style.width /2 - 3,
                    y:-style.height/2 - 3
                },
                visible:false,
                className:'control-point',
                name:"top-left"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:style.width /2  - 3,
                    y:-style.height/2 - 3
                },
                visible:false,
                className:'control-point',
                name:"top-right"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:style.width /2 - 3,
                    y:style.height/2 - 3
                },
                visible:false,
                className:'control-point',
                name:"bottom-right"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:-style.width /2 - 3,
                    y:style.height/2 - 3
                },
                visible:false,
                className:'control-point',
                name:"bottom-left"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:0,
                    y:style.height/2 - 3
                },
                visible:false,
                className:'control-point',
                name:"bottom-center"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:-style.width /2 - 3,
                    y:0
                },
                visible:false,
                className:'control-point',
                name:"left-center"
            });
            group.addShape('rect',{
                attrs:{
                    fill:"#fff",
                    stroke: '#168DF8',
                    lineWidth: 0.5,
                    width:6,
                    height:6,
                    x:style.width /2 - 3,
                    y:0
                },
                visible:false,
                className:'control-point',
                name:"right-center"
            });
            console.log('points')
        },
        update:function (cfg, item) {
            const model = item.getModel();
            const group = item.getContainer();
            const nodes = group.get('children');
            const {width,height} = model.style;
            //控制点不一样的时候 方向不一样
            //向下拖拽 y为原来的坐标点 x不更新 比如 y:-55
            //向上拖拽 y为原来的坐标点绝对值|55| + 动态变化的高度 y:-height+55
            nodes.forEach(function (node) {
                if(node.cfg.name === 'image-box'){
                    node.attr({
                        // width,
                        height,
                        y:-55
                    });
                }
                if(node.cfg.name === 'image-content'){
                    node.attr({
                        x: -width / 4 - (width / 50) * 3,
                        y: -height/ 4 +  width / 100,
                        height: width / 2,
                        width : height / 2 + height / 10,
                    });
                }
                if(node.cfg.name === 'image-content-part'){
                    node.attr({
                        x: -width / 2,
                        y: -height + height/50*9,
                        height,
                        width,
                    })
                }
                if(node.cfg.className === 'control-point'){
                    switch (node.cfg.name) {
                        case 'top-center':
                            node.attr({
                                y:-height/2 - 3,
                            });
                            break;
                        case 'top-left':
                            node.attr({
                                x:-width /2 - 3,
                                y:-height/2 - 3
                            });
                            break;
                        case 'top-right':
                            node.attr({
                                x:width /2  - 3,
                                y:-height/2 - 3
                            });
                            break;
                        case 'bottom-center':
                            node.attr({
                                x:0,
                                y:height/2 - 3
                            });
                            break;
                        case 'bottom-left':
                            node.attr({
                                x:-width /2 - 3,
                                y: height/2 - 3
                            });
                            break;
                        case 'bottom-right':
                            node.attr({
                                x:width /2 - 3,
                                y:height/2 - 3
                            });
                            break;
                        case 'left-center':
                            node.attr({
                                x:-width /2 - 3,
                                y:0
                            });
                            break;
                        case 'right-center':
                            node.attr({
                                x:width /2 - 3,
                                y:0
                            });
                            break;

                    }
                }
            });
            console.log('update',width,height,nodes);
        }
    },
    'rect'
);
