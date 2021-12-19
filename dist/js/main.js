window.onload = function () {
    //init dataPanel
    let dataPanel = [
        {
            label: '设备设施',
            type: "rect",
            deviceType:'location',
            image:''
        },
        {
            label: '计量表具',
            type: "ellipse",
            deviceType:'meters',
            image:''
        },
        {
            label: '水平线',
            type: "location-w",
            deviceType:'location-w',
        },
        {
            label: '垂直线',
            type: "location-h",
            deviceType:'location-h'
        }
    ];
    let convertData = function (data) {
        let anchorPoint = {
            '0.5,0': 0,
            '1,0.5': 1,
            '0.5,1': 2,
            '0,0.5': 3
        };
        let nodes = [];
        let edges = [];
        if (!Array.isArray(data)) return;
        data.forEach(function (d) {
            let model = {props: {}};
            if (d.c === 'ht.Node') {
                model.id = d.i + '';
                model.props = d.a;
                model.x = d.p.position.x;
                model.y = d.p.position.y;
                model.label = d.s.label;
                if (d.a.deviceType === 'meters') {
                    model.type = 'ellipse';
                } else {
                    model.type = 'rect';
                    if (d.a.deviceType.indexOf('-') > -1) {
                        model.label = '';
                        model.style = {
                            stroke: '#168DF8',
                            lineWidth: 2,
                            fill: '#168DF8'
                        };
                        let getNodeType = d.a.deviceType.split('-')[1];
                        if (getNodeType === 'w') {
                            model.size = [240, 10];
                        } else {
                            model.size = [10, 240];
                        }
                    }
                }
                nodes.push(model);
            }
            if (d.c === 'ht.Edge') {
                let sAnchor = anchorPoint[d.s['edge.source.anchor.x'] + ',' + d.s['edge.source.anchor.y']];
                let tAnchor = anchorPoint[d.s['edge.target.anchor.x'] + ',' + d.s['edge.target.anchor.y']];
                model.id = d.i + '';
                model.source = d.p.source.__i + '';
                model.target = d.p.target.__i + '';
                model.sourceAnchor = sAnchor;
                model.targetAnchor = tAnchor;
                edges.push(model);
            }
        });
        return {
            nodes,
            edges
        };
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
    }
    let searchNodeLocation = function(){
        $(document).on("click",'#searchBtn',function () {
            let val = $("#searchInput").val();
            const node = graph.find('node', (node) => {
                    if (node.get('model').props) {
                        return node.get('model').props.code === val;
                    }
                }
            );
            if(node){
                graph.focusItem(node, true, {
                    easing: 'easeCubic',
                    duration: 400,
                    callback:function () {
                        graph.emit('node:click',{
                            item:node
                        });
                    }
                });
            }
        });
    };
    searchNodeLocation();
    //let BIMData = convertData(bimJSON.d);
    let data = {
        nodes: [],
        edges: []
    };
    data.nodes.push.apply(data.nodes, bimFlowJSON.nodes);
    data.edges = bimFlowJSON.edges;
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
            cfg.createItem(el, function () {
                new Sortable(el, {
                    sort: false,
                    animation: 150,
                    onEnd: cfg.onEnd.bind(cfg)
                });
            });
        }
    };
    let detectionBoundary = function (evt, id, fn) {
        let x = evt.originalEvent.clientX;
        let y = evt.originalEvent.clientY;
        let $layoutBoxCenter = $(id);
        let div_x_1 = $layoutBoxCenter.offset().left + 40;
        let div_y_1 = $layoutBoxCenter.offset().top + 20;
        let div_x_2 = $layoutBoxCenter.offset().left + $layoutBoxCenter.outerWidth() + 40;
        let div_y_2 = $layoutBoxCenter.offset().top + $layoutBoxCenter.outerHeight() + 20;
        if (x < div_x_1 || x > div_x_2 || y < div_y_1 || y > div_y_2) {
            //不处理
        } else {
            fn();
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
    const grid = new G6.Grid();
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
        plugins: [snapLine,grid,toolbar],
        fitView: true,
        // fitViewPadding: 20,
        // fitCenter: true,
        enabledStack: true,
        modes: {
            default: ['drag-canvas', 'drag-node', 'zoom-canvas', 'hover', 'clickNode', 'clickNodeImage', 'drag-add-edge']
        },
        defaultNode: {
            anchorPoints: [
                [0.5, 0],
                [1, 0.5],
                [0.5, 1],
                [0, 0.5]
            ],
            style:{
                fill:'#168DF8',
                stroke: '#168DF8'
            },
            labelCfg: {
                style: {
                    fill: '#fff'
                }
            }
        },
        defaultEdge: {
            type: 'polyline',
            style: {
                endArrow: {
                    path: 'M 0,0 L 10,5 L 10,-5 Z',
                    fill: '#168DF8',
                    stroke: '#168DF8',
                    opacity: 0.8,
                },
                stroke: '#168DF8',
                lineWidth: 2,
            },
        },
        nodeStateStyles: {
            click: {
                stroke: '#004df8',
                lineWidth: 2,
                fill: '#004df8'
            }
        },
    });
    let count = 0;
    dataModel.comp = {
        rightPanelControl: rpc
    };
    window.graph = graph;
    leftPanelControl({
        data: dataPanel, id: 'leftPanelForm', createItem: function (el, init) {
            let pData = this.data;
            let createItem = function () {
                let temp = '';
                for (let i = 0; i < pData.length; i += 1) {
                    temp += `<div class="flow-item">
                                <div class="flow-item-handle ${pData[i].type}"></div>
                                <span>${pData[i].label}</span>
                            </div>`
                }
                el.innerHTML = temp;
            };
            createItem();
            init();
            tippy('[data-tippy-content]');
        }, onEnd: function (evt) {
            let that = this;
            detectionBoundary(evt, "#canvasPaint", function () {
                let oldIndex = evt.oldIndex;
                let uuidNode = Math.floor(Math.random() * 1000) + "node";
                let nodeType = that.data[oldIndex].type;
                let nodeLabel= that.data[oldIndex].label;
                let deviceType = that.data[oldIndex].deviceType;
                console.log(deviceType);
                const point = graph.getPointByClient(evt.originalEvent.clientX, evt.originalEvent.clientY);
                const model = {
                    id: uuidNode,
                    label: nodeLabel,
                    type: nodeType,
                    x: point.x,
                    y: point.y,
                    props: {
                        oid:count++,
                        name: nodeLabel,
                        deviceType: deviceType
                    }
                };
                if (nodeType.indexOf('-') > -1) {
                    model.label = '';
                    model.type = 'rect';
                    model.style = {
                        stroke: '#168DF8',
                        lineWidth: 2,
                        fill: '#168DF8'
                    };
                    let getNodeType = nodeType.split('-')[1];
                    if (getNodeType === 'w') {
                        model.size = [300, 10];
                    } else {
                        model.size = [10, 300];
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
            });
        }
    });
    graph.on('aftercreateedge', (e) => {
        console.log(e.edge);
    });
    graph.on('wheelzoom',(e)=>{

    });
    graph.setMinZoom(0.001);
    setTimeout(()=>{
        //graph.data(data);
        graph.render();
    },120);
    $('#saveProps').on('click',function () {
    });
    window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!$canvasPaint[0] || !$canvasPaint[0].scrollWidth || !$canvasPaint[0].scrollHeight) return;
        graph.changeSize($canvasPaint[0].scrollWidth, $canvasPaint[0].scrollHeight);
    };
    //B6_LB1_2D13#2
};
