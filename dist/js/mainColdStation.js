window.onload = function () {
    //转换数据
    let data = {
        nodes: []
    };
    // let convertDataColdStation = function(data){
    //     let deviceTypeMap = {
    //         112:{
    //             type:'boxImage',
    //             size:[125,125],
    //             imgSize:[125,80],
    //             img: "public/images/panel/暖通设备svg/冷水机.svg"
    //         },
    //         132:{
    //             type:'boxImage-pump',
    //             size:[65,65],
    //             img: [
    //                 "public/images/panel/冷冻泵(左).svg",
    //                 "public/images/panel/冷冻泵(扇叶).svg"
    //             ]
    //         },
    //         134:{
    //             type:"boxImage-pump",
    //             size:[65,65],
    //             img: [
    //                 "public/images/panel/冷却泵(左).svg",
    //                 "public/images/panel/冷却泵(扇叶).svg"
    //             ]
    //         },
    //         114:{
    //             type:"boxImage-tower",
    //             size:[110,110],
    //             img: [
    //                 "public/images/panel/冷却塔.svg",
    //                 "public/images/panel/冷却塔(蒸汽).svg"
    //             ]
    //         },
    //         140:{
    //             type:"boxImage",
    //             size:[65,65],
    //             imgSize:[35,20],
    //             img: "public/images/panel/暖通设备svg/电动阀.svg"
    //         },
    //         144:{
    //             type:"boxImage-plate",
    //             size:[100,120],
    //             img: [
    //                 "public/images/panel/板换.svg",
    //                 "public/images/panel/板换(蒸汽).svg"
    //             ]
    //         },
    //         145:{
    //             type:"boxImage",
    //             size:[100,55],
    //             img: "public/images/panel/暖通设备svg/分水器.svg"
    //         },
    //         146:{
    //             type:"boxImage",
    //             size:[100,55],
    //             img: "public/images/panel/暖通设备svg/集水器.svg"
    //         },
    //         231:{
    //             type:"boxImage",
    //             size:[100,100],
    //             imgSize:[75,60],
    //             img: "public/images/panel/暖通设备svg/水池.svg"
    //         },
    //         230:{
    //             type:"boxImage",
    //             size:[100,100],
    //             imgSize:[100,60],
    //             img: "public/images/panel/暖通设备svg/蓄冷罐.svg"
    //         },
    //         "011":{
    //             type:"boxImage",
    //             size:[75,75],
    //             imgSize:[60,20],
    //             img: "public/images/panel/暖通设备svg/压力传感器.svg"
    //         },
    //         "010":{
    //             type:"boxImage",
    //             size:[75,75],
    //             imgSize:[60,20],
    //             img: "public/images/panel/暖通设备svg/温度传感器.svg"
    //         },
    //         183:{
    //             type:"boxImage",
    //             size:[75,75],
    //             imgSize:[60,28],
    //             img: "public/images/panel/暖通设备svg/流量计.svg"
    //         },
    //         142:{
    //             type:"boxImage",
    //             size:[50,50],
    //             imgSize:[40,40],
    //             img: "public/images/panel/暖通设备svg/冷冻供水管-L型1.svg"
    //         },
    //         141:{
    //             type:"boxImage",
    //             size:[50,50],
    //             imgSize:[40,40],
    //             img: "public/images/panel/暖通设备svg/冷冻供水管-T型4.svg"
    //         },
    //         143:{
    //             type:"boxImage",
    //             size:[50,50],
    //             imgSize:[40,34],
    //             img: "public/images/panel/暖通设备svg/冷冻供水管-水平型.svg"
    //         },
    //         10000:{
    //             type:"rect",
    //             size:[40,15]
    //         }
    //     };
    //     let nodes = [];
    //     if (!Array.isArray(data)) return;
    //     data.forEach(function (d) {
    //         let model = {props: {}};
    //         model.id = d.i + '';
    //         model.x = d.p.position.x;
    //         model.y = d.p.position.y;
    //         if(d.a.deviceType !== '142' && d.a.deviceType !== '141' && d.a.deviceType !== '143'){
    //             for(let k in deviceTypeMap[d.a.deviceType]){
    //                 model[k] = deviceTypeMap[d.a.deviceType][k];
    //             }
    //             if(d.a.deviceType === '10000'){
    //                 model.style = {
    //                     stroke: '#168DF8',
    //                     lineWidth: 1,
    //                     fill: '#168DF8',
    //                     color:'#fff'
    //                 };
    //                 model.labelCfg = {
    //                     style: {
    //                         fill: '#fff'
    //                     }
    //                 }
    //             }
    //             model.props = d.a;
    //             nodes.push(model);
    //         }
    //
    //     });
    //     return nodes;
    // };
    // let dataColdStation = convertDataColdStation(bimRefrigeratingStationBIM.d);
    data.nodes.push.apply(data.nodes, bimRefrigeratingStationBIM.nodes);
    //定义面板数据
    let paletteData = {
        device: {
            name: "冷源设备",
            expanded: true,
            items: [
                {
                    name: "冷冻机",
                    image: "public/images/panel/暖通设备svg/冷水机.svg",
                    deviceType: "112",
                    nodeType:"boxImage",
                    size:[125,125],
                    imgSize:[125,80],
                    img: "public/images/panel/暖通设备svg/冷水机.svg"
                },
                {
                    name: "冷冻泵",
                    image: "public/images/panel/暖通设备svg/冷冻泵(左).svg",
                    deviceType: "132",
                    nodeType:"boxImage-pump",
                    size:[65,65],
                    img: [
                        "public/images/panel/冷冻泵(左).svg",
                        "public/images/panel/冷冻泵(扇叶).svg"
                    ]
                },
                {
                    name: "冷却泵",
                    image: "public/images/panel/暖通设备svg/冷却泵(左).svg",
                    deviceType: "134",
                    nodeType:"boxImage-pump",
                    size:[65,65],
                    img: [
                        "public/images/panel/冷却泵(左).svg",
                        "public/images/panel/冷却泵(扇叶).svg"
                    ]
                },
                {
                    name: "冷却塔",
                    image: "public/images/panel/暖通设备svg/冷却塔.svg",
                    deviceType: "114",
                    nodeType:"boxImage-tower",
                    size:[110,110],
                    img: [
                        "public/images/panel/冷却塔.svg",
                        "public/images/panel/冷却塔(蒸汽).svg"
                    ]
                },
                {
                    name: "电动阀门",
                    image: "public/images/panel/暖通设备svg/电动阀.svg",
                    deviceType: "227",
                    type: "0",//0表示电动，1表示手动
                    nodeType:"boxImage",
                    size:[65,65],
                    imgSize:[35,20],
                    img: "public/images/panel/暖通设备svg/电动阀.svg"
                },
                {
                    name: "手动阀门",
                    image: "public/images/panel/暖通设备svg/手动阀.svg",
                    deviceType: "227",
                    type: "1",//0表示电动，1表示手动
                    nodeType:"boxImage",
                    size:[65,65],
                    imgSize:[30,25],
                    img: "public/images/panel/暖通设备svg/手动阀.svg"
                },
                {
                    name: "板换",
                    image: "public/images/panel/暖通设备svg/板换.svg",
                    deviceType: "144",
                    nodeType:"boxImage-plate",
                    size:[100,120],
                    img: [
                        "public/images/panel/板换.svg",
                        "public/images/panel/板换(蒸汽).svg"
                    ]
                },

                {
                    name: "分水器",
                    image: "public/images/panel/暖通设备svg/分水器.svg",
                    deviceType: "145",
                    nodeType:"boxImage",
                    size:[100,55],
                    img: "public/images/panel/暖通设备svg/分水器.svg"
                },
                {
                    name: "集水器",
                    image: "public/images/panel/暖通设备svg/集水器.svg",
                    deviceType: "146",
                    nodeType:"boxImage",
                    size:[100,55],
                    img: "public/images/panel/暖通设备svg/集水器.svg"
                },
                {
                    name: "水池",
                    image: "public/images/panel/暖通设备svg/水池.svg",
                    deviceType: "231",
                    nodeType:"boxImage",
                    size:[100,100],
                    imgSize:[75,60],
                    img: "public/images/panel/暖通设备svg/水池.svg"
                },
                {
                    name: "蓄冷罐",
                    image: "public/images/panel/暖通设备svg/蓄冷罐.svg",
                    deviceType: "230",
                    nodeType:"boxImage",
                    size:[100,100],
                    imgSize:[100,60],
                    img: "public/images/panel/暖通设备svg/蓄冷罐.svg"
                },

            ]
        },
        sensor: {
            name: "传感器",
            expanded: true,
            items: [
                {
                    name: "压力传感器",
                    image: "public/images/panel/暖通设备svg/压力传感器.svg",
                    deviceType: "220",
                    nodeType:"boxImage",
                    size:[75,75],
                    imgSize:[60,20],
                    img: "public/images/panel/暖通设备svg/压力传感器.svg"
                },
                {
                    name: "温度传感器",
                    image: "public/images/panel/暖通设备svg/温度传感器.svg",
                    deviceType: "221",
                    nodeType:"boxImage",
                    size:[75,75],
                    imgSize:[60,20],
                    img: "public/images/panel/暖通设备svg/温度传感器.svg"
                },
                {
                    name: "流量计",
                    image: "public/images/panel/暖通设备svg/流量计.svg",
                    deviceType: "183",
                    nodeType:"boxImage",
                    size:[75,75],
                    imgSize:[60,28],
                    img: "public/images/panel/暖通设备svg/流量计.svg"
                },
            ]
        },
        waterPipeSystem: {
            name: "水管系统",
            expanded: true,
            items: [
                {
                    name: "冷冻水供水-L型管",
                    image: "public/images/panel/暖通设备svg/冷冻供水管-L型1.svg",
                    deviceType: "142",
                    useType: "0",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷冻供水管-L型1.svg"
                },
                {
                    name: "冷冻水供水-T型管",
                    image: "public/images/panel/暖通设备svg/冷冻供水管-T型4.svg",
                    deviceType: "141",
                    useType: "0",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷冻供水管-T型4.svg"
                },
                {
                    name: "冷冻水供水-直管",
                    image: "public/images/panel/暖通设备svg/冷冻供水管-水平型.svg",
                    deviceType: "143",
                    useType: "0",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,34],
                    img: "public/images/panel/暖通设备svg/冷冻供水管-水平型.svg"
                },
                {
                    name: "冷冻回水管-L型管",
                    image: "public/images/panel/暖通设备svg/冷冻回水管-L型1.svg",
                    deviceType: "142",
                    useType: "1",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷冻回水管-L型1.svg"
                },
                {
                    name: "冷冻回水管-T型管",
                    image: "public/images/panel/暖通设备svg/冷冻回水管-T型4.svg",
                    deviceType: "141",
                    useType: "1",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷冻回水管-T型4.svg"
                },
                {
                    name: "冷冻回水管-直管",
                    image: "public/images/panel/暖通设备svg/冷冻回水管-水平型.svg",
                    deviceType: "143",
                    useType: "1",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,34],
                    img: "public/images/panel/暖通设备svg/冷冻回水管-水平型.svg"
                },
                {
                    name: "冷却出水管-L型管",
                    image: "public/images/panel/暖通设备svg/冷却出水管-L型1.svg",
                    deviceType: "142",
                    useType: "2",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷却出水管-L型1.svg"
                },
                {
                    name: "冷却出水管-T型管",
                    image: "public/images/panel/暖通设备svg/冷却出水管-T型4.svg",
                    deviceType: "141",
                    useType: "2",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷却出水管-T型4.svg"
                },
                {
                    name: "冷却出水管-直管",
                    image: "public/images/panel/暖通设备svg/冷却出水管-水平型.svg",
                    deviceType: "143",
                    useType: "2",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,34],
                    img: "public/images/panel/暖通设备svg/冷却出水管-水平型.svg"
                },
                {
                    name: "冷却回水管-L型管",
                    image: "public/images/panel/暖通设备svg/冷却回水管-L型1.svg",
                    deviceType: "142",
                    useType: "3",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷却回水管-L型1.svg"
                },
                {
                    name: "冷却回水管-T型管",
                    image: "public/images/panel/暖通设备svg/冷却回水管-T型4.svg",
                    deviceType: "141",
                    useType: "3",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,40],
                    img: "public/images/panel/暖通设备svg/冷却回水管-T型4.svg"
                },
                {
                    name: "冷却回水管-直管",
                    image: "public/images/panel/暖通设备svg/冷却回水管-水平型.svg",
                    deviceType: "143",
                    useType: "3",
                    nodeType:"boxImage",
                    size:[50,50],
                    imgSize:[40,34],
                    img: "public/images/panel/暖通设备svg/冷却回水管-水平型.svg"
                }
            ]
        }
        ,
        other: {
            name: "其他组件",
            expanded: true,
            items: [{
                name: "标签",
                image:'public/images/panel/暖通设备svg/Tag.svg',
                deviceType: "10000",
                other: "tag",
                nodeType:"rect",
                size:[80,25]
            }]
        }
    };
    let mergeArr = function() {
        return Array.prototype.concat.apply([], arguments)
    };
    let parseJSONFormat = function(str) {
        // 设置缩进为2个空格
        str = JSON.stringify(str, null, 2);
        str = str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    };
    let rightPanelControl = function (id) {
        let el = document.querySelector(id);
        let panelShow = function (show) {
            el.style.display = "block";
            if (typeof show === "function") {
                show(el);
            }
        };
        let panelHide = function (hide) {
            el.style.display = "none";
            if (typeof hide === "function") {
                hide(el);
            }
        };
        return {
            show: panelShow,
            hide: panelHide
        }
    };
    let rpc = rightPanelControl("#rightPanel");
    let leftPanelControl = function (cfg) {
        if (typeof cfg.createItem === 'function') {
            let el = document.getElementById(cfg.id);
            cfg.createItem(el);
        }
    };
    let zoomToolsBar = function () {
        let randomNumBoth = function (Min, Max) {
            let range = Max - Min;
            let rand = Math.random();
            return Min + rand * range;
        };
        return function () {
            let setZoom = function (flag, graph) {
                let zoomDefault = graph.getZoom();
                let numberMin = zoomDefault < 0.1 ? 0.01:0.1;
                let numberMax = zoomDefault < 0.2 ? 0.02:0.2;
                if (flag === 'max') {
                    zoomDefault += randomNumBoth(numberMin, numberMax);
                    graph.zoomTo(zoomDefault);
                } else {
                    zoomDefault -= randomNumBoth(numberMin, numberMax);
                    graph.zoomTo(zoomDefault);
                }
            };
            return {
                setZoom
            }
        }
    };
    const ztb = zoomToolsBar();
    const $canvasPaint = $("#canvasPaint");
    const snapLine = new G6.SnapLine();
    const toolbar = new G6.ToolBar({
        container: "toolsBar",
        className: "toolsbar-wrap",
        getContent: () => {
            return document.querySelectorAll('#toolsbarTemp')[0].innerHTML
        },
        handleClick: (code, graph) => {
            if (code === 'undo') {
                toolbar.undo()
            }
            if (code === 'redo') {
                toolbar.redo();
            }
            if (code === 'save') {
                let graphData = graph.save();
                let doc = window.open().document;
                doc.open();
                doc.write("<pre>" + parseJSONFormat(graphData) + "</pre>");
                doc.close();
            }
            if (code === 'remove') {
                if (typeof dataModel.clickNode !== "undefined") {
                    graph.removeItem(dataModel.clickNode.node, true);
                    rpc.hide();
                    dataModel.clickNode = {};
                }
            }
            if (code === 'zoomOut') {
                ztb().setZoom('max', graph);
            }
            if (code === 'zoomIn') {
                ztb().setZoom('min', graph);
            }
        }
    });
    const graph = new G6.Graph({
        container: 'canvasPaint',
        width: $canvasPaint.width(),
        height: $canvasPaint.height(),
        plugins: [snapLine, toolbar],
        fitView: true,
        // fitViewPadding: 20,
        // fitCenter: true,
        enabledStack: true,
        modes: {
            default: ['drag-canvas', 'drag-node', 'zoom-canvas', 'clickNodeImage','dragControlPoint']
        },
        defaultNode: {
            anchorPoints: [
                [0.5, 0],
                [1, 0.5],
                [0.5, 1],
                [0, 0.5]
            ]
        },
        nodeStateStyles: {
            click: {
                stroke: '#168DF8',
                lineWidth: 2,
                fill: '#168DF8'
            }
        },
    });
    dataModel.comp = {
        rightPanelControl: rpc
    };
    leftPanelControl({
        data: paletteData, id: 'leftPanelForm', createItem: function (el, init) {
            let pData = this.data;
            let temp = '';
            let createItem = function () {
                for(let k in pData){
                    let tempTitle = `<div class="leftPanel-form-title">${pData[k].name}</div>`;
                    let tempItem  = '';
                    let lineClass = k === 'waterPipeSystem' ? ' linePipe':'';
                    for(let i = 0; i < pData[k].items.length; i+= 1){
                        tempItem += `<div class="leftPanel-form-item" draggable="true">
                                        <div class="item-imgBox${lineClass}">
                                            <img class="itemImg-${pData[k].items[i].deviceType}" src="${pData[k].items[i].image}"/>
                                        </div>
                                        <span>${pData[k].items[i].name}</span>
                                    </div>`;
                    }
                    let tempItemWrap  = `<div class="leftPanel-form-wrap">${tempItem}</div>`;
                    temp += tempTitle + tempItemWrap;
                }
                el.innerHTML = temp;
                let clickEventExe = function(){
                    let stateElement = {};
                    $('.leftPanel-form-title').each(function (index,el) {
                        stateElement[$(el).index()] = true;
                    });
                    $(el).on('click','.leftPanel-form-title',function () {
                        if(stateElement[$(this).index()]){
                            $(this).addClass('active').next().hide();
                            stateElement[$(this).index()] = false;
                        }else{
                            $(this).removeClass('active').next().show();
                            stateElement[$(this).index()] = true;
                        }
                    });
                };
                let dragEventExe = function(){
                    let $item = $('.leftPanel-form-item');
                    let $wrap = $('.leftPanel-form-wrap');
                    let titleDataIndexMap = {};
                    let keyData = [];
                    let currentIndex = null;
                    let currentNode  = null;
                    for(let k in pData){
                        keyData.push(k);
                    }
                    $wrap.each(function (index,el) {
                       titleDataIndexMap[$(el).index()] = keyData[index];
                    });
                    $item.on('dragstart',function (e) {
                        currentIndex = $(e.target).parent().index();
                        currentNode  = $(e.target);
                    });
                    document.querySelector('#canvasPaint').addEventListener('drop', (e) => {
                        e.preventDefault();
                        let itemData = pData[titleDataIndexMap[currentIndex]].items[currentNode.index()];
                        let uuidNode  = Math.floor(Math.random() * 1000) + "node";
                        let nodeType  = itemData.nodeType;
                        let nodeLabel = itemData.name;
                        let deviceType= itemData.deviceType;
                        let size = itemData.size;
                        let img  = itemData.img;
                        let imgSize = itemData.imgSize?itemData.imgSize:'';
                        const point = graph.getPointByClient(e.clientX, e.clientY);
                        const model = {
                            id: uuidNode,
                            type: nodeType,
                            x: point.x,
                            y: point.y,
                            size,
                            img,
                            props: {
                                name: nodeLabel,
                                deviceType: deviceType
                            }
                        };
                        if(imgSize !== '')model['imgSize'] = imgSize;
                        if(nodeType === 'rect'){
                            model.label = nodeLabel;
                            model.style = {
                                stroke: '#168DF8',
                                lineWidth: 2,
                                fill: '#168DF8',
                                color:'#fff'
                            };
                            model.labelCfg = {
                                style: {
                                    fill: '#fff'
                                }
                            }
                        }
                        graph.addItem('node', model, true);
                        const nodeItem = graph.findById(uuidNode);
                        dataModel.clickNode = {
                            node: nodeItem
                        };
                        graph.emit('node:click',{
                            item:nodeItem
                        });
                    })
                };
                clickEventExe();
                dragEventExe();
                new SimpleBar(el);
            };
            createItem();
            tippy('[data-tippy-content]');
        }
    });
    graph.setMinZoom(0.001);
    setTimeout(()=>{
        graph.data(data);
        graph.render();
    },120);
    window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!$canvasPaint[0] || !$canvasPaint[0].scrollWidth || !$canvasPaint[0].scrollHeight) return;
        graph.changeSize($canvasPaint[0].scrollWidth, $canvasPaint[0].scrollHeight);
    };
    $(document).on("click",'#testBtn1',function () {
        const Util = G6.Util;
        let nodeItem = dataModel.clickNode.node;
        nodeItem.get('group').get('children')[2].animate(
            (ratio) => {
                const toMatrix = Util.transform([1, 0, 0, 0, 1, 0, 0, 0, 1], [['r', ratio * Math.PI * 2]]);
                return {
                    matrix: toMatrix,
                };
            },
            {
                repeat: true,
                duration: 2000,
                easing: 'easeLinear',
            }
        );
    });
    $(document).on("click","#testBtn2",function () {
        let nodeItem = dataModel.clickNode.node;
        let img = nodeItem.get('group').get('children')[2];
        img.pauseAnimate();
    });
};
