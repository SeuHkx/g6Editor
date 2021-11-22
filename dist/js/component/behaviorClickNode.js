const clickNodeBehavior = {
    getEvents() {
        return {
            "node:click": "onNodeClick",
            "canvas:click": "onCanvasClick"
        };
    },
    onNodeClick:function (e) {
        const nodeItem = e.item;
        //获取动画元素
        // nodeItem.get('group').get('children')[2].animate(
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
        if(nodeItem.getModel().type !== 'image' && nodeItem.getModel().type.indexOf('boxImage') < 0){
            const clickNodes = graph.findAllByState('node', 'click');
            clickNodes.forEach((n) => {
                graph.setItemState(n, 'click', false);
                n.update({
                    linkPoints: {
                        top: false,
                        right: false,
                        bottom: false,
                        left: false,
                    },
                });
            });
            graph.setItemState(nodeItem, 'click', true);
            dataModel.comp.rightPanelControl.show(function (el) {
                let loadFormEl = el.querySelector('#rightPanelForm');
                let props = nodeItem.getModel().props;
                let deviceType = props.deviceType;
                let initData;
                if(deviceType.indexOf('-') > -1){
                    let locationType = deviceType.split('-')[1];
                    if(locationType === 'w'){
                        initData = locationData.locationW;
                    }else{
                        initData = locationData.locationH;
                    }
                }else{
                    initData = deviceType === 'location' ?locationData.facility:dataPower;
                }
                CreateForm.init({
                        container:loadFormEl,
                        init:function (element) {
                            $(element).on('input','.input',function () {
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
                        },
                        createInit:function(d,item){
                            let label = item.querySelector('[formlabel]');
                            if(d.field){
                                let labelRequired = '<span style="color: red">*</span>' + d.displayName;
                                label.innerHTML = labelRequired;
                            }
                            if(d.name === 'code'){
                                let codeInputElement = item.querySelector('[formtype]').children[0];
                                let createButton = function (elem) {
                                    let codeValue = "";
                                    let powerMeterId = "";
                                    let unbindData = "";
                                    let $parent = $(elem).parent();
                                    let $temp = $("<div style='position: absolute;top: 2px;width: 28px;height:28px;line-height:28px;text-align:center;right:2px;cursor: default;background:#1a4894;color:#84D4F7;'>></div>");
                                    $parent.append($temp);
                                    $temp.on("click", function () {
                                        layer.open({
                                            title: "可选待配置设备列表",
                                            area: ["1025px", "650px"],
                                            content: "<div id='codeTemp'></div>",
                                            btn: ["确定", "取消"],
                                            yes: function (index, layero) {
                                                $(elem).val(codeValue);
                                                layer.close(index);
                                                for (let i = 0; i < unbindData.length; i++) {
                                                    if (unbindData[i].physicalCode == codeValue) {
                                                        powerMeterId = unbindData[i].id;
                                                    }
                                                }

                                                if (powerMeterId != null) {
                                                    getMeterInfoById(powerMeterId, function (rtData) {
                                                        let data_select = rtData.meter;
                                                        self._selectNode.a("id", data_select.id);
                                                        self._selectNode.a("floorAreaId", data_select.floorAreaId);
                                                        self._selectNode.a("floorId", data_select.floorId);
                                                        self._selectNode.a("buildingId", data_select.buildingId);
                                                        self._selectNode.a("geospatialType", data_select.geospatialType);

                                                        //更新表单
                                                        self._updateNode("location", rtData.location, "attr", "tree", undefined);
                                                        self._updateNode("name", data_select.name, "attr", "text", "shape");
                                                        self._updateNode("code", data_select.physicalCode, "attr", "multicombobox", undefined);
                                                        self._updateNode("extSystemId", data_select.extSystemId, "attr", "text", undefined);
                                                        self._updateNode("type", data_select.type, "attr", "combo", undefined);
                                                        self._updateNode("typeface", data_select.model, "attr", "text", undefined);
                                                        self._updateNode("maximumRange", data_select.maxRange, "attr", "text", undefined);
                                                        self._updateNode("manufacturers", data_select.manufacturer, "attr", "textArea", undefined);
                                                        self._updateNode("installationTime", data_select.installedDate, "attr", "date", undefined);
                                                        self._updateNode("location", data_select.location, "attr", "text", undefined);
                                                        self._updateNode("equipmentType", data_select.state, "attr", "combo", undefined);

                                                    });
                                                }
                                            },
                                            btn2: function (index, layero) {
                                                //return false 开启该代码可禁止点击该按钮关闭
                                            },
                                            scrollbar: false,
                                            success: function (layero, index) {
                                                let createCodeList = function (data) {
                                                    let listItem = "";
                                                    for (let i = 0; i < data.length; i += 1) {
                                                        listItem += "<div class='cube'>" + data[i].physicalCode + "</div>";
                                                    }
                                                    let list = `<div class="cube-wrap">
                                                    <form class="layui-form" style="display: flex;align-items: center" id="formDemo">
                                                        <input type="hidden" id="parkAreaId" value="">
                                                        <input type="hidden" id="buildingId" value="">
                                                        <input type="hidden" id="floorId" value="">
                                                        <input type="hidden" id="floorAreaId" value="">
                                                        <input type="hidden" id="geospatialType" value="">
                                                      <div style="display: flex;margin: 10px 0px;align-items: center;position: relative;margin-right: 10px">
                                                        <div>安装位置</div>
                                                        <div style="margin: 0px 10px">
                                                            <input type="text" id="setPosition" class="layui-input" style="width: 240px;border:1px solid #1790ff" readonly placeholder="点击选择安装位置"/>
                                                        </div>
                                                        <div class="module-tree zTreeBox simplebar" style="position: absolute;display: none;left: 65px;right: 0;bottom: -191px;height: 190px;width:240px;z-index: 1111111;background: #002767;">
                                                            <ul class="module-tree" id="openTreeBoxBuild"></ul>
                                                        </div>
                                                      </div>
                                                      <div style="display: flex;margin: 10px 0px;align-items: center">
                                                          <div>物理编码</div>
                                                          <div class="layui-form-item" style="margin: 0px">
                                                            <div class="layui-input-block" style="margin: 0px 10px">
                                                              <input type="text" id="code" lay-verify="code"  placeholder="请输入物理编码" class="layui-input" style="width: 130px;border:1px solid #1790ff;margin: 0x 10px">
                                                            </div>
                                                          </div>
                                                          <div>
                                                            <button type="button" class="layui-btn" id="searchCode">查询</button>
                                                          </div>
                                                          <div>
                                                            <button type="reset" id="reset" class="layui-btn" style="margin-left: 10px">重置</button>
                                                          </div>
                                                      </div>
                                                    </form>
                                                    <div class="cube-tips">可选物理编码：<span class="cube-tips-text" id="cube-tips"></span></div>
                                                    <div class="wrap-parent simplebar">${listItem}</div>
                                                </div>`;
                                                    return list;
                                                };

                                                let initData;
                                                let flag = true;

                                                getUnboundMeters(function getMeter(rtData) {
                                                    if(flag){
                                                        initData = rtData;
                                                        flag = false;
                                                    }
                                                    unbindData = rtData;
                                                    let listTemp = createCodeList(rtData);
                                                    $("#codeTemp").html(listTemp);
                                                    let domArr = document.querySelectorAll(".simplebar");
                                                    domArr.forEach((item) => {
                                                        new SimpleBar(item, {autoHide: false});
                                                    });
                                                    $("#codeTemp").on("click", ".cube", function () {
                                                        $(this).addClass("active").siblings(".active").removeClass("active").end();
                                                        let _value = $(this).html();
                                                        $("#cube-tips").html(_value);
                                                        codeValue = _value;
                                                    });

                                                    $('#setPosition').on('click', function (e) {
                                                        $('.zTreeBox').show();

                                                        e.preventDefault();
                                                        let domArr = document.querySelectorAll(".simplebar");
                                                        domArr.forEach((item) => {
                                                            new SimpleBar(item);
                                                        });
                                                        let $treeBox = $("#openTreeBoxBuild");
                                                        let selectNodeId;
                                                        let selectNodeType;
                                                        let parkName;
                                                        let buildingName;
                                                        let floorName;
                                                        let floorAreaName;
                                                        let currentLocation;//当前位置 格式为例如：当前位置：建筑楼B3-楼层3-IDC1
                                                        let buildingId;
                                                        let floorId;
                                                        let floorAreaId;
                                                        let parkAreaId;


                                                        //初始化 tree
                                                        let _data = window.B.init.TreeData;
                                                        let _setting = {
                                                            view: {
                                                                selectedMulti: false,//是否可以同时选中多个节点
                                                                dblClickExpand: false,//屏蔽掉双击事件

                                                            },
                                                            data: {
                                                                simpleData: {
                                                                    enable: true
                                                                }
                                                            },
                                                            check: {
                                                                enable: false,
                                                                nocheckInherit: true
                                                            },
                                                            edit: {
                                                                enable: false
                                                            },
                                                            callback: {
                                                                //展开节点时,回调点击事件方法请求数据生成节点
                                                                onExpand: function (event, treeId, treeNode) {
                                                                    onClickTree(treeNode);
                                                                },
                                                                onClick: function (event, treeId, treeNode) {
                                                                    onClickTree(treeNode);
                                                                    zTree.expandNode(treeNode);
                                                                }
                                                            }
                                                        };
                                                        // //实例化ztree树
                                                        let zTree = $.fn.zTree.init($treeBox, _setting, _data);

                                                        /**
                                                         * 树点击事件
                                                         * @param treeNode 节点数据
                                                         */
                                                        function onClickTree(treeNode) {
                                                            selectNodeId = treeNode.id;//当前选择节点所属地理类型id
                                                            selectNodeType = treeNode.nodeType;//地理类型geospatialType
                                                            if (selectNodeType === 11) {//园区分区
                                                                parkName = treeNode.name;
                                                                currentLocation = "";
                                                                currentLocation = parkName;
                                                                $("#setPosition").val(currentLocation);
                                                                parkAreaId = selectNodeId;
                                                                $("#parkAreaId").val(parkAreaId);
                                                                $("#geospatialType").val("11");
                                                            }
                                                            if (selectNodeType === 12) {//建筑
                                                                buildingName = treeNode.name;
                                                                currentLocation = "";
                                                                currentLocation = parkName + "-" + buildingName;
                                                                $("#setPosition").val(currentLocation);
                                                                buildingId = selectNodeId;
                                                                $("#parkAreaId").val(parkAreaId);
                                                                $("#buildingId").val(buildingId);
                                                                $("#geospatialType").val("12");
                                                            } else if (selectNodeType === 13) {//楼层
                                                                floorName = treeNode.name;
                                                                currentLocation = "";
                                                                currentLocation = parkName + "-" + buildingName + "-" + floorName;
                                                                $("#setPosition").val(currentLocation);
                                                                floorId = selectNodeId;
                                                                $("#parkAreaId").val(parkAreaId);
                                                                $("#buildingId").val(buildingId);
                                                                $("#floorId").val(floorId);
                                                                $("#geospatialType").val("13");
                                                            } else if (selectNodeType === 15) {//机房
                                                                currentLocation = "";
                                                                floorAreaName = treeNode.name;
                                                                currentLocation = parkName + "-" + buildingName + "-" + floorName + "-" + floorAreaName;
                                                                $("#setPosition").val(currentLocation);
                                                                floorAreaId = selectNodeId;
                                                                $("#parkAreaId").val(parkAreaId);
                                                                $("#buildingId").val(buildingId);
                                                                $("#floorId").val(floorId);
                                                                $("#floorAreaId").val(floorAreaId);
                                                                $("#geospatialType").val("15");
                                                                $('.zTreeBox').hide();
                                                            }

                                                        }
                                                    })
                                                    $('.zTreeBox .simplebar-content-wrapper').attr('id',
                                                        'zTreeBoxContent');
                                                    $('.zTreeBox .simplebar-content-wrapper').css("background","rgba(0, 39, 102, 1)");
                                                    $(document.body).click(function (e) {
                                                        if (e.target.id.length > 0) {
                                                            if (e.target.id == 'zTreeBoxContent' || e.target.id == 'setPosition' || e.target.className == 'simplebar-content-wrapper') {
                                                                $(".zTreeBox").show();
                                                            }
                                                        } else {
                                                            $(".zTreeBox").hide();
                                                        }
                                                    });



                                                    $('#searchCode').on('click', function () {
                                                        let parkAreaId = $("#parkAreaId").val();
                                                        let buildingId = $("#buildingId").val();
                                                        let floorId = $("#floorId").val();
                                                        let floorAreaId = $("#floorAreaId").val();
                                                        let geospatialType = $("#geospatialType").val();
                                                        let code = $("#code").val();
                                                        let setPosition = $("#setPosition").val();

                                                        //TODO AJAX后台查询
                                                        searchCode(parkAreaId,buildingId,floorId,floorAreaId,geospatialType,code,function (result){
                                                            getMeter(result)
                                                            $("#setPosition").val(setPosition);
                                                            $("#code").val(code);
                                                        });
                                                    });

                                                    $('#reset').on('click', function () {
                                                        let listTemp = createCodeList(initData);
                                                        $("#codeTemp").html(listTemp);
                                                        let domArr = document.querySelectorAll(".simplebar");
                                                        domArr.forEach((item) => {
                                                            new SimpleBar(item, {autoHide: false});
                                                        });
                                                        $("#codeTemp").on("click", ".cube", function () {
                                                            $(this).addClass("active").siblings(".active").removeClass("active").end();
                                                            let _value = $(this).html();
                                                            $("#cube-tips").html(_value);
                                                            codeValue = _value;
                                                        });

                                                        $('#setPosition').on('click', function (e) {
                                                            $('.zTreeBox').show();

                                                            e.preventDefault();
                                                            let domArr = document.querySelectorAll(".simplebar");
                                                            domArr.forEach((item) => {
                                                                new SimpleBar(item);
                                                            });
                                                            let $treeBox = $("#openTreeBoxBuild");
                                                            let selectNodeId;
                                                            let selectNodeType;
                                                            let parkName;
                                                            let buildingName;
                                                            let floorName;
                                                            let floorAreaName;
                                                            let currentLocation;//当前位置 格式为例如：当前位置：建筑楼B3-楼层3-IDC1
                                                            let buildingId;
                                                            let floorId;
                                                            let floorAreaId;
                                                            let parkAreaId;


                                                            //初始化 tree
                                                            let _data = window.B.init.TreeData;
                                                            let _setting = {
                                                                view: {
                                                                    selectedMulti: false,//是否可以同时选中多个节点
                                                                    dblClickExpand: false,//屏蔽掉双击事件

                                                                },
                                                                data: {
                                                                    simpleData: {
                                                                        enable: true
                                                                    }
                                                                },
                                                                check: {
                                                                    enable: false,
                                                                    nocheckInherit: true
                                                                },
                                                                edit: {
                                                                    enable: false
                                                                },
                                                                callback: {
                                                                    //展开节点时,回调点击事件方法请求数据生成节点
                                                                    onExpand: function (event, treeId, treeNode) {
                                                                        onClickTree(treeNode);
                                                                    },
                                                                    onClick: function (event, treeId, treeNode) {
                                                                        onClickTree(treeNode);
                                                                        zTree.expandNode(treeNode);
                                                                    }
                                                                }
                                                            };
                                                            // //实例化ztree树
                                                            let zTree = $.fn.zTree.init($treeBox, _setting, _data);

                                                            /**
                                                             * 树点击事件
                                                             * @param treeNode 节点数据
                                                             */
                                                            function onClickTree(treeNode) {
                                                                selectNodeId = treeNode.id;//当前选择节点所属地理类型id
                                                                selectNodeType = treeNode.nodeType;//地理类型geospatialType
                                                                if (selectNodeType === 11) {//园区分区
                                                                    parkName = treeNode.name;
                                                                    currentLocation = "";
                                                                    currentLocation = parkName;
                                                                    $("#setPosition").val(currentLocation);
                                                                    parkAreaId = selectNodeId;
                                                                    $("#parkAreaId").val(parkAreaId);
                                                                    $("#geospatialType").val("11");
                                                                }
                                                                if (selectNodeType === 12) {//建筑
                                                                    buildingName = treeNode.name;
                                                                    currentLocation = "";
                                                                    currentLocation = parkName + "-" + buildingName;
                                                                    $("#setPosition").val(currentLocation);
                                                                    buildingId = selectNodeId;
                                                                    $("#parkAreaId").val(parkAreaId);
                                                                    $("#buildingId").val(buildingId);
                                                                    $("#geospatialType").val("12");
                                                                } else if (selectNodeType === 13) {//楼层
                                                                    floorName = treeNode.name;
                                                                    currentLocation = "";
                                                                    currentLocation = parkName + "-" + buildingName + "-" + floorName;
                                                                    $("#setPosition").val(currentLocation);
                                                                    floorId = selectNodeId;
                                                                    $("#parkAreaId").val(parkAreaId);
                                                                    $("#buildingId").val(buildingId);
                                                                    $("#floorId").val(floorId);
                                                                    $("#geospatialType").val("13");
                                                                } else if (selectNodeType === 15) {//机房
                                                                    currentLocation = "";
                                                                    floorAreaName = treeNode.name;
                                                                    currentLocation = parkName + "-" + buildingName + "-" + floorName + "-" + floorAreaName;
                                                                    $("#setPosition").val(currentLocation);
                                                                    floorAreaId = selectNodeId;
                                                                    $("#parkAreaId").val(parkAreaId);
                                                                    $("#buildingId").val(buildingId);
                                                                    $("#floorId").val(floorId);
                                                                    $("#floorAreaId").val(floorAreaId);
                                                                    $("#geospatialType").val("15");
                                                                    $('.zTreeBox').hide();
                                                                }

                                                            }
                                                        })
                                                        $('.zTreeBox .simplebar-content-wrapper').attr('id',
                                                            'zTreeBoxContent');
                                                        $('.zTreeBox .simplebar-content-wrapper').css("background","rgba(0, 39, 102, 1)");
                                                        $(document.body).click(function (e) {
                                                            if (e.target.id.length > 0) {
                                                                if (e.target.id == 'zTreeBoxContent' || e.target.id == 'setPosition' || e.target.className == 'simplebar-content-wrapper') {
                                                                    $(".zTreeBox").show();
                                                                }
                                                            } else {
                                                                $(".zTreeBox").hide();
                                                            }
                                                        });
                                                    })

                                                });


                                            }
                                        });
                                    });
                                };
                                createButton(codeInputElement);
                            }
                            if(d.type === 'date'){
                                let dateInputElement = item.querySelector('[formtype]').children[0];
                                dateInputElement.flatpickr({
                                    onChange: function (dateObj, dateStr, instance) {
                                        let model = {
                                            props:{}
                                        };
                                        model.props[d.name] = dateStr;
                                        graph.updateItem(nodeItem,model,true);
                                    }
                                });
                            }
                            if(d.type === 'tree'){
                                console.log('tree')
                            }
                        },
                        tempWidget: {
                            init:function(){
                                layui.form.render('select');
                                layui.form.on('select(electron)', function(data){
                                    let model = {
                                        props:{}
                                    };
                                    model.props[data.elem.name] = data.value;
                                    graph.updateItem(nodeItem,model,true);
                                });
                            },
                            combo:function (data,name,value) {
                                let temp  = '';
                                data.values[0].forEach(function (d,i) {
                                    let selected = i === Number(value)? 'selected':'';
                                    temp+= '<option value="'+d+'" '+selected+'>'+ data.values[1][i]+'</option>';
                                });
                                return `<select name=${name} lay-filter="electron">${temp}</select>`;
                            }
                        }
                    },
                    props,initData);
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
    onCanvasClick:function () {
        const clickNodes = graph.findAllByState('node', 'click');
        clickNodes.forEach((n) => {
            graph.setItemState(n, 'click', false);
            n.update({
                linkPoints: {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                },
            });
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
G6.registerBehavior('clickNode', clickNodeBehavior);
