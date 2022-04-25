let Util = {
    MapId: {},
    uniqueId(type) {
        type = type || 'kv';
        if (!this.MapId[type]) {
            this.MapId[type] = 1;
        } else {
            this.MapId[type] += 1;
        }
        return type + this.MapId[type];
    },
    isObject() {
        let arg = [].slice.call(arguments)[0];
        return Object.prototype.toString.call(arg) === '[object Object]';
    },
    isString() {
        let arg = [].slice.call(arguments)[0];
        return Object.prototype.toString.call(arg) === '[object String]';
    },
    deepMix(source, target) {
        for (let k in target) {
            if (this.isObject(target[k])) {
                this.deepMix(source[k], target[k]);
            } else {
                source[k] = target[k];
            }
        }
        return source;
    },
    compare(p, t) {
        return function (m, n) {
            let a = m[p];
            let b = n[p];
            if (t) {
                return a - b;
            } else {
                return b - a;
            }
        }
    }
};

class Matrix {
    constructor(arr) {
        this._arr = arr;
    }

    get arr() {
        return this._arr;
    }

    get m() {
        return this._arr.length;
    }

    get n() {
        return this._arr[0].length;
    }

    col(index) {
        const arr = [];
        this._arr.forEach(row => {
            arr.push(row[index]);
        });
        return arr;
    }

    row(index) {
        return this._arr[index];
    }

    multiply(mat) {
        const arr = new Array(this.m);
        for (let i = 0; i < this.m; i++) {
            arr[i] = new Array(mat.n);
            for (let j = 0; j < mat.n; j++) {
                arr[i][j] = 0;
                for (let k = 0; k < this.n; k++) {
                    arr[i][j] += this.arr[i][k] * mat.arr[k][j];
                }
            }
        }
        return new Matrix(arr);
    }
}

class EventEmitter {
    constructor() {
        if (!this.events) {
            this.events = {};
        }
    }

    on(evt, listener) {
        if (!this.events[evt]) {
            this.events[evt] = [];
        }
        this.events[evt].push(listener);
    }

    emit(evt, ...arg) {
        if (this.events[evt]) {
            this.events[evt].forEach((listener) => listener.apply(this, arg));
        }
    }

    off(evt, listener) {
        if (this.events[evt]) {
            this.events[evt] = this.events[evt].filter(l => l != listener);
        }
    }

    setOnceDoc() {
        this.setOnceDocumentListener("once");
    }

    getOnceDoc() {
        return this.getOnceDocumentListener("once");
    }

    setOnceDocumentListener(evt) {
        if (!this.onceDocumentMap) {
            this.onceDocumentMap = {};
        }
        this.onceDocumentMap[evt] = true;
    }

    getOnceDocumentListener(evt) {
        if (!this.onceDocumentMap) {
            this.onceDocumentMap = {
                [evt]: false
            };
        }
        return this.onceDocumentMap[evt];
    }
}

class PluginEvent {
    constructor(graph, cfg) {
        const defaultCfg = {
            name: cfg.name,
            item: cfg.item
        };
        this.graph = graph;
        this._cfg = defaultCfg;
        this._name = this._cfg.name.charAt(0).toUpperCase() + this._cfg.name.slice(1);
        this[this._name] = {};
        if (typeof this[this._cfg.name] === "function") {
            this[this._cfg.name]();
        } else {
            throw Error('invalid is not function name:' + this._cfg.name);
        }
        if (!this.graph.getOnceDoc()) {
            this._initDocumentEvent();
            this.graph.setOnceDoc();
        }
    }

    _initDocumentEvent() {
        let container = this.graph.get("container");
        this._createAuxiliaryLines();
        document.addEventListener("mousemove", e => {
            let event = e || window.e;
            let _anchor = this.graph.get("_anchor");
            let zoomStageScale = this.graph.get("zoomStageScale");
            let cX = event.clientX / zoomStageScale;
            let cY = event.clientY / zoomStageScale;
            if (_anchor && _anchor.start) {
                _anchor.move = true;
                let item = _anchor.item;
                let BBox = item.get("BBox");
                let w = _anchor.width = item.get("width");
                let h = _anchor.height = item.get("height");
                let x = _anchor.x = item.get("x");
                let y = _anchor.y = item.get("y");

                if (_anchor.className === "bottom-right") {
                    let dw = cX - _anchor.dx + w;
                    let dy = cY - _anchor.dy + h;
                    _anchor.width = dw < 0 ? 1 : dw;
                    _anchor.height = dy < 0 ? 1 : dy;
                    BBox.style.width = _anchor.width + "px";
                    BBox.style.height = _anchor.height + "px";
                }
                if (_anchor.className === "bottom-center") {
                    let dy = cY - _anchor.dy + h;
                    _anchor.height = dy < 0 ? 1 : dy;
                    _anchor.width = w;
                    BBox.style.height = _anchor.height + "px";
                }
                if (_anchor.className === "center-right") {
                    let dw = cX - _anchor.dx + w;
                    _anchor.width = dw < 0 ? 1 : dw;
                    _anchor.height = h;
                    BBox.style.width = _anchor.width + "px";
                }
                if (_anchor.className === "center-left") {
                    let dw = _anchor.dx - cX + w;
                    let dx = x - (_anchor.dx - cX);
                    _anchor.width = dw < 0 ? 1 : dw;
                    _anchor.height = h;
                    _anchor.x = dx;
                    BBox.style.width = _anchor.width + "px";
                    BBox.style.left = _anchor.x + "px";
                    BBox.style.top = y + "px";
                }
                if (_anchor.className === "bottom-left") {

                }
            }
            this._getMiceRealPoint(event.clientX, event.clientY);
            return false
        }, false);
        document.addEventListener("mouseup", () => {
            if (this.graph.get("_anchor")) {
                let _anchor = this.graph.get("_anchor");
                let {
                    width,
                    height,
                    item,
                    x,
                    y
                } = _anchor;
                if (_anchor.move) {
                    item.update({
                        width,
                        height,
                        x,
                        y
                    });
                }
                this.graph.set("_anchor", undefined);
                this.graph.emit("anchorDragEnd");
            }
            this._dragStageUpRestoreState();
        }, false);
        document.addEventListener("paste", (e) => {
            let dataTransferItemList = e.clipboardData.items;
            const items = [].slice.call(dataTransferItemList).filter(function (item) {
                return item.type.indexOf('image') !== -1;
            });
            if (items.length === 0) {
                return;
            }
            const dataTransferItem = items[0];
            const blob = dataTransferItem.getAsFile();
            const fileReader = new FileReader();
            //base64
            fileReader.addEventListener('load', (e) => {
                let base64 = e.target.result;
                let image = new Image();
                image.draggable = false;
                image.src = base64;

                image.addEventListener("load", () => {
                    let width = image.width;
                    let height = image.height;
                    let zoomStageScale = this.graph.get("zoomStageScale");
                    let item = this.graph.addItem({
                        size: "auto",
                        x: this._miceRealPoint ? this._miceRealPoint.x / zoomStageScale - width / 2 : 0,
                        y: this._miceRealPoint ? this._miceRealPoint.y / zoomStageScale - height /2 : 0
                    });

                    let itemBBox = item.get("BBox");
                    itemBBox.style.width = width + "px";
                    itemBBox.style.height = height + "px";
                    image.style.width = "100%";
                    image.style.height = "100%";

                    let itemComponent = item.get("BBoxComponent");
                    itemComponent.appendChild(image);
                    item.update({
                        width,
                        height
                    });
                })
            });
            fileReader.readAsDataURL(blob);
            //localhost url
            //imgDom.src = URL.createObjectURL(blob);
        }, false);
        document.addEventListener("keydown", (e) => {
            //todo 复制节点操作
            if (e.ctrlKey || e.metaKey) {
                if (e.keyCode === 67) {
                    console.log("ctrl c")
                }
                if (e.keyCode === 86) {
                    console.log("ctrl v");
                }
            }
            if (e.keyCode === 32) {
                let dragStage = this.graph.get("DragStage");
                dragStage.keyCode = e.keyCode;
                if (!dragStage.state) {
                    this._dragStageSetGrab(dragStage);
                }
            }
            if(e.keyCode === 16){
                this._multiSelectSet(e.keyCode);
            }
        }, false);
        document.addEventListener("keyup", () => {
            this._dragStageKeyUpRestore();
            this._multiSelectRestore();
        }, false);
        container.addEventListener("click", (e) => {
            let {target} = e;
            if(target === container){
                let items = this.graph.get("items");
                items.forEach((item)=>{
                    item.setItemStyleHide();
                    this._multiData();
                });
            }
        }, false)
    }
    _multiData(){
        this.graph.set("multi",[]);
    }
    _multiSelectSet(code){
        let multiSelect = this.graph.get("MultiSelect");
        multiSelect.keyCode = code;
        multiSelect.state   = true;
    }
    _multiSelectRestore(){
        let multiSelect = this.graph.get("MultiSelect");
        multiSelect.keyCode = null;
        multiSelect.state   = false;
    }
    multiSelect(){
        this.graph.set(this._name, {
            state: false,
            keyCode: null
        });
    }
    zoomStage() {
        let container = this.graph.get("container");
        this.graph.set("zoomStageScale", 1);
        container.addEventListener("wheel", this._zoomStageExe, false);
    }

    _zoomStageExe = (e) => {
        const {clientX, clientY, deltaY} = e;
        let scale = 1 + (deltaY < 0 ? 0.1 : -0.1);
        let newScaleMat = new Matrix([[scale, 0], [0, scale], [0, 0]]);
        let oldScaleMat = new Matrix(this._zoomGetScale());
        let newMat = oldScaleMat.multiply(newScaleMat).arr.reduce(function (a, b) {
            let f = (param) => {
                if (param !== 0) {
                    if (param.toString().indexOf(".") > 0 && param.toString().length > 3) {
                        param = Number(param).toFixed(2);
                        return Number(param);
                    } else {
                        return param;
                    }
                } else {
                    return param;
                }
            };
            let na = a.map((_a) => {
                return f(_a);
            });
            let nb = b.map((_b) => {
                return f(_b);
            });
            return na.concat(nb);
        });
        // let oldXY = oldScaleMat.row(2);
        // let oldScale = oldScaleMat.row(0)[0];
        if (newMat[0] <= 0.09 || newMat[0] >= 3) return false;
        let zoomStageScale;
        zoomStageScale = newMat[0];
        this.graph.set("zoomStageScale", zoomStageScale);
        // this._zoomGetMiceRealPoint(newMat,oldScale,oldXY,clientX,clientY);
        this._zoomSetScale(newMat);
        this.graph.emit("wheel", zoomStageScale);
    }

    _zoomSetScale(mat) {
        let container = this.graph.get("container");
        container.style.transform = `matrix(${mat[0]},0,0,${mat[3]},${mat[4]},${mat[5]})`;
    }

    _zoomGetScale() {
        let container = this.graph.get("container");
        let transformValue = this._getStyle(container, "transform");
        if (transformValue === 'none') {
            return [[1, 0], [0, 1], [0, 0]];
        } else {
            let temp = transformValue.match(/\d+(?:\.\d{0,9})?/g);
            let arr = [];
            let a = [];
            let count = 0;
            temp.forEach(t => {
                if (count <= 1) {
                    a.push(Number(t));
                    count++;
                }
                if (count === 2) {
                    arr.push(a);
                    a = [];
                    count = 0;
                }
            });
            return arr;
        }
    }

    _zoomGetMiceRealPoint(mat, oldScale, oldXY, clientX, clientY) {
        let containerRect = this.graph.get("container").getBoundingClientRect();
        let originPos = {
            x: Math.abs((this._zoomStageScale - 1) * containerRect.width),
            y: Math.abs((this._zoomStageScale - 1) * containerRect.height)
        };
        let mXScale = (clientX - containerRect.left) / containerRect.width;
        let mYScale = (clientY - containerRect.top) / containerRect.height;
        console.log(oldXY[0] - (0.5 - mXScale) * originPos.x, mat[4]);
        // mat[4] = oldXY[0] - (0.5-mXScale)*originPos.x;
        // mat[5] = oldXY[1] - (0.5-mYScale)*originPos.y;
        //mat[4] = oldXY[0] - mXScale*originPos.x
        //console.log(oldScale,this._zoomStageScale,oldXY,clientX,clientY);
        //mat[4] -= originPos.x*()
        //mat[5] = originPos.y;
    }

    _getMiceRealPoint(x, y) {
        let containerRect = this.graph.get("container").getBoundingClientRect();
        this._miceRealPoint = {
            x: x - containerRect.left,
            y: y - containerRect.top
        };
    }

    _dragStageUpRestoreState() {
        let dragStage = this.graph.get("DragStage");
        if (dragStage) {
            if (dragStage.keyCode !== null && dragStage.keyCode === 32) {
                this._dragStageSetGrab(dragStage);
            } else {
                this._dragStageSetDef(dragStage);
            }
            dragStage.state = false;
        }
    }

    _dragStageKeyUpRestore() {
        let dragStage = this.graph.get("DragStage");
        dragStage.state = false;
        dragStage.keyCode = null;
        this._dragStageSetDef(dragStage);
    }

    _dragStageSetGrab(dragStage) {
        dragStage.mask.style.cursor = "grab";
        dragStage.mask.style.display = "block";
    }

    _dragStageSetGrabbing(dragStage) {
        dragStage.mask.style.cursor = "grabbing";
    }

    _dragStageSetDef(dragStage) {
        dragStage.mask.style.cursor = "default";
        setTimeout(() => {
            dragStage.mask.style.display = "none";
        }, 0);
    }

    dragStage() {
        let mask = this._dragStageCreateMask();
        this.graph.set(this._name, {
            state: false,
            keyCode: null,
            mask: mask
        });
        this[this._name].startDrag = false;
        this[this._name].startX = 0;
        this[this._name].startY = 0;
        this[this._name].stage = this.graph.get("container");
        mask.addEventListener("mousedown", this._dragStageInit, false);
    }

    _dragStageCreateMask() {
        let container = this.graph.get("container");
        let mask = document.createElement("div");
        mask.style.position = "absolute";
        mask.style.width = "100%";
        mask.style.height = "100%";
        mask.style.zIndex = "10";
        mask.style.display = "none";
        container.appendChild(mask);
        return mask;
    }

    _dragStageInit = (e) => {
        let event = e || window.e;
        let dragStage = this.graph.get(this._name);
        let pos = this._dragStageGetPosition();
        dragStage.state = true;
        if (dragStage.keyCode !== null && dragStage.keyCode === 32) {
            this._dragStageSetGrabbing(dragStage);
            this[this._name].startDrag = true;
            this[this._name].startX = event.clientX - pos.x;
            this[this._name].startY = event.clientY - pos.y;
            document.addEventListener('mousemove', this._dragStageMove.bind(this, dragStage, pos), false);
            document.addEventListener('mouseup', this._dragStageEnd, false);
        }
    }

    _dragStageMove(dragStage, pos, e) {
        if (!this[this._name].startDrag || dragStage.keyCode === null) return;
        let event = e || window.e;
        let x = event.clientX - this[this._name].startX;
        let y = event.clientY - this[this._name].startY;
        this._dragStageSetPosition({
            sx: pos.sx ? pos.sx : 1,
            sy: pos.sy ? pos.sy : 1,
            x: x,
            y: y
        });
    }

    _dragStageEnd = () => {
        this[this._name].startDrag = false;
        document.removeEventListener('mousemove', this._dragStageMove, false);
        document.removeEventListener('mouseup', this._dragStageEnd, false);
    }

    _dragStageSetPosition(pos) {
        this[this._name].stage.style.transform = 'matrix(' + pos.sx + ',0,0,' + pos.sy + ',' + pos.x + ',' + pos.y + ')';
    }

    _dragStageGetPosition() {
        let pos = {
            sx: 0,
            sy: 0,
            x: 0,
            y: 0
        };
        let stage = this[this._name].stage;
        let transformValue = this._getStyle(stage, "transform");
        if (transformValue === 'none') {
            stage.style.transform = 'matrix(1,0,0,1,0,0)';
        } else {
            let temp = transformValue.match(/\-?\d+(?:\.\d{0,9})?/g);
            pos = {
                sx: temp[0].trim(),
                sy: temp[3].trim(),
                x: temp[4].trim(),
                y: temp[5].trim()
            }
        }
        return pos;
    }

    _adsorption(x, y) {
        let item = this[this._name].item;
        item.update({x, y});
        let model = item.get("model");
        let items = this.graph.get("items");
        let index = items.indexOf(item);
        let VALIDITY = 6;
        let pointsAll = [];
        let pointVicinity = null;
        let pointDynamic = [
            {
                x: model.minX,
                y: model.minY
            },
            {
                x: model.centerX,
                y: model.centerY
            },
            {
                x: model.maxX,
                y: model.maxY
            }
        ];
        if (items.length === 1) return null;
        items.forEach((n, i) => {
            if (index !== i) {
                let m = n.get("model");
                let tPL = {
                    x: m.minX,
                    y: m.minY
                };
                let tPC = {
                    x: m.centerX,
                    y: m.minY
                };
                let tPR = {
                    x: m.maxX,
                    y: m.minY
                };
                let cPL = {
                    x: m.minX,
                    y: m.centerY
                };
                let cPR = {
                    x: m.maxX,
                    y: m.centerY
                };
                let bPL = {
                    x: m.minX,
                    y: m.maxY
                };
                let bPC = {
                    x: m.centerX,
                    y: m.maxY
                };
                let bPR = {
                    x: m.maxX,
                    y: m.maxY
                };
                pointsAll.push(tPL, tPC, tPR, cPL, cPR, bPL, bPC, bPR);
            }
        });
        for (let i = 0; i < pointDynamic.length; i += 1) {
            let dx = pointDynamic[i].x;
            let dy = pointDynamic[i].y;
            for (let j = 0; j < pointsAll.length; j += 1) {
                if (Math.abs(dx - pointsAll[j].x) <= VALIDITY) {
                    //console.log("true",dx,pointsAll[j].x,x);
                    if (dx > x) {
                        pointVicinity = {
                            x: pointsAll[j].x - (model.insideCenterX) * i,
                            dir: "x"
                        };
                    } else {
                        pointVicinity = {
                            x: pointsAll[j].x,
                            dir: "x"
                        };
                    }
                    return pointVicinity;
                }
                if (Math.abs(dy - pointsAll[j].y) <= VALIDITY) {
                    if (dy > y) {
                        pointVicinity = {
                            y: pointsAll[j].y - (model.insideCenterY) * i,
                            dir: "y"
                        };
                    } else {
                        pointVicinity = {
                            y: pointsAll[j].y,
                            dir: "y"
                        };
                    }
                    return pointVicinity;
                }
            }
        }
        return pointVicinity;
    }

    _createAuxiliaryLines() {
        let lineElement = {};
        let lines = ["h", "h", "h", "v", "v", "v"];
        let linesContainer = document.createElement("div");
        let container = this.graph.get("container");
        let count = 0;
        lines.forEach((name) => {
            let line = document.createElement("div");
            line.className = `line ${name}`;
            if (count === 3) {
                count = 0;
            }
            lineElement[name + count] = line;
            count++;
            linesContainer.appendChild(line);
        });
        container.appendChild(linesContainer);
        this.graph.set("lineElement", lineElement);
        this.graph.set("linesContainer", linesContainer);
    };

    changeLineVisibility(visible) {
        let linesContainer = this.graph.get("linesContainer");
        if (visible) {
            linesContainer.style.display = "block";
        } else {
            linesContainer.style.display = "none";
        }
        this.graph.set("_lineVisible", visible);
    }

    hideLines() {
        this.changeLineVisibility(false);
    }

    showLines() {
        this.changeLineVisibility(true);
    }

    isVisible() {
        return this.graph.get("_lineVisible");
    }

    _auxiliaryLines() {
        if (!this.isVisible()) {
            this.showLines();
        }
        let item = this[this._name].item;
        let model = item.get("model");
        let items = this.graph.get("items");
        let lineElement = this.graph.get("lineElement");
        let pointXDynamic = [
            {
                x: model.minX,
                hasPoints: []
            },
            {
                x: model.centerX,
                hasPoints: []
            },
            {
                x: model.maxX,
                hasPoints: []
            }
        ];
        let pointYDynamic = [
            {
                y: model.minY,
                hasPoints: []
            },
            {
                y: model.centerY,
                hasPoints: []
            },
            {
                y: model.maxY,
                hasPoints: []
            }
        ];
        let pointsAll = [];
        if (items.length === 1) return false;
        items.forEach((n) => {
            let m = n.get("model");
            let tPL = {
                x: m.minX,
                y: m.minY
            };
            let tPC = {
                x: m.centerX,
                y: m.minY
            };
            let tPR = {
                x: m.maxX,
                y: m.minY
            };
            let cPL = {
                x: m.minX,
                y: m.centerY
            };
            let cPR = {
                x: m.maxX,
                y: m.centerY
            };
            let bPL = {
                x: m.minX,
                y: m.maxY
            };
            let bPC = {
                x: m.centerX,
                y: m.maxY
            };
            let bPR = {
                x: m.maxX,
                y: m.maxY
            };
            pointsAll.push(tPL, tPC, tPR, cPL, cPR, bPL, bPC, bPR);
        });
        for (let i = 0; i < pointXDynamic.length; i += 1) {
            const x = pointXDynamic[i].x;
            for (let j = 0; j < pointsAll.length; j += 1) {
                if (x === pointsAll[j].x) {
                    pointXDynamic[i].hasPoints.push(pointsAll[j]);
                }
            }
        }
        for (let i = 0; i < pointYDynamic.length; i += 1) {
            const y = pointYDynamic[i].y;
            for (let j = 0; j < pointsAll.length; j += 1) {
                if (y === pointsAll[j].y) {
                    pointYDynamic[i].hasPoints.push(pointsAll[j]);
                }
            }
        }
        for (let i = 0; i < pointXDynamic.length; i += 1) {
            if (pointXDynamic[i].hasPoints.length >= 4) {
                let pointsY = pointXDynamic[i].hasPoints.map((m) => {
                    return m.y;
                });
                let vMinY = Math.min(...pointsY);
                let vMaxY = Math.max(...pointsY);
                lineElement["v" + i].style.display = "block";
                lineElement["v" + i].style.height = 40 + vMaxY - vMinY + "px";
                lineElement["v" + i].style.transform = 'translate(' + pointXDynamic[i].x + 'px, ' + (vMinY - 20) + 'px)';
            } else {
                lineElement["v" + i].style.display = "none";
            }
        }
        for (let i = 0; i < pointYDynamic.length; i += 1) {
            if (pointYDynamic[i].hasPoints.length >= 4) {
                let pointsX = pointYDynamic[i].hasPoints.map((m) => {
                    return m.x;
                });
                let vMinX = Math.min(...pointsX);
                let vMaxX = Math.max(...pointsX);
                lineElement["h" + i].style.display = "block";
                lineElement["h" + i].style.width = 40 + vMaxX - vMinX + "px";
                lineElement["h" + i].style.transform = 'translate(' + (vMinX - 20) + 'px, ' + pointYDynamic[i].y + 'px)';
            } else {
                lineElement["h" + i].style.display = "none";
            }
        }
    }

    pullBox() {
        let container = this.graph.get("container");
        //console.log("pullBox",container);
    }

    ruler() {
        //console.log("ruler");
    }

    drag() {
        this[this._name].item = this.get("item");
        this[this._name].states = this[this._name].item.get("states");
        this[this._name].BBox = this[this._name].item.get("BBox");
        this[this._name].startDrag = false;
        this[this._name].startMove = false;
        this[this._name].startX = 0;
        this[this._name].startY = 0;
        this[this._name].transform = !this._getTransform();
        this[this._name].BBox.addEventListener("mousedown", this._dragInit, false);
    }

    _dragInit = (e) => {
        let event = e || window.e;
        let item = this[this._name].item;
        let itemController = this.graph.get("itemController");
        let multiSelect = this.graph.get("MultiSelect");
        let pos = this._dragGetPosition();
        let zoomStageScale = this[this._name].zoomStageScale = this.graph.get("zoomStageScale");
        let cX = event.clientX / zoomStageScale;
        let cY = event.clientY / zoomStageScale;
        event.stopPropagation();
        if (e.target.nodeName.toLocaleUpperCase() === "SPAN") {
            this.graph.set("_anchor", {
                className: e.target.className,
                item: this[this._name].item,
                start: true,
                move: false,
                dx: cX,
                dy: cY
            });
        } else {
            this[this._name].startDrag = true;
            this[this._name].startX = cX - pos.x;
            this[this._name].startY = cY - pos.y;
            this[this._name].cX = cX;
            this[this._name].cY = cY;
            if(multiSelect.keyCode !== 16 && !multiSelect.state){
                itemController._changeItemMoveStyle(item);
            }
            document.addEventListener('mousemove', this._dragMove, false);
            document.addEventListener('mouseup', this._dragEnd, false);
        }
    }
    _dragMove = (e) => {
        if (!this[this._name].startDrag) return;
        let event = e || window.e;
        let zoomStageScale = this[this._name].zoomStageScale;
        let cX = event.clientX / zoomStageScale;
        let cY = event.clientY / zoomStageScale;
        let x = cX - this[this._name].startX;
        let y = cY - this[this._name].startY;
        let disThresholdX = Math.abs(cX - this[this._name].cX);
        let disThresholdY = Math.abs(cY - this[this._name].cY);
        if(disThresholdX === 0 || disThresholdY === 0)return false;
        let adsorption = this._adsorption(x, y);
        if (adsorption !== null) {
            if (adsorption.dir === "x") {
                x = adsorption.x;
            } else {
                y = adsorption.y;
            }
        }
        this._dragSetPosition({
            x,
            y
        });
        this._auxiliaryLines();
        this[this._name].startMove = true;
    }
    _dragEnd = () => {
        let item = this[this._name].item;
        let pos = this._dragGetPosition();
        item.update({...pos});
        item.changeItemMoveStyle(true);
        let multi = this.graph.get("multi");
        let multiSelect = this.graph.get("MultiSelect");
        if(multi.length >= 0 && multiSelect.keyCode === null && !multiSelect.state){
            multi = [];
            multi.push(item);
            this.graph.set("multi",multi);
        }
        if (!this[this._name].startMove) {
            if(multiSelect.keyCode === 16 && multiSelect.state){
                multi.push(item);
                this.graph.set("multi",multi);
            }else{
                this.graph.selectItem(item);
                this.graph.emit("click", item);
            }
        }

        this[this._name].startDrag = false;
        this[this._name].startMove = false;
        this.hideLines();
        document.removeEventListener('mousemove', this._dragMove, false);
        document.removeEventListener('mouseup', this._dragEnd, false);
    }

    _dragGetPosition() {
        let pos = {
            x: 0,
            y: 0
        };
        let elem = this[this._name].BBox;
        let transform = this[this._name].transform;
        if (transform) {
            let transformValue = this._getStyle(elem, transform);
            if (transformValue === 'none') {
                elem.style[transform] = 'translate(0, 0)';
            } else {
                let temp = transformValue.match(/-?\d+/g);
                pos = {
                    x: parseInt(temp[4].trim()),
                    y: parseInt(temp[5].trim())
                }
            }
        } else {
            if (this._getStyle(elem, 'position') === 'static') {
                elem.style.position = 'relative';
            } else {
                pos = {
                    x: Math.ceil(this._getStyle(elem, 'left') ? this._getStyle(elem, 'left').replace("px", "") : 0),
                    y: Math.ceil(this._getStyle(elem, 'top') ? this._getStyle(elem, 'top').replace("px", "") : 0)
                }
            }
        }
        return pos;
    }

    _dragSetPosition(pos) {
        if (this[this._name].transform) {
            this[this._name].BBox.style[this[this._name].transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
        } else {
            this[this._name].BBox.style.marginTop = this[this._name].BBox.style.marginLeft = 0;
            this[this._name].BBox.style.left = pos.x + "px";
            this[this._name].BBox.style.top = pos.y + "px";
        }
        this[this._name].item.update({...pos});
    }

    _getStyle(ele, prop) {
        return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(ele, false)[prop] : ele.currentStyle[prop];
    }

    _getTransform() {
        let transform = '',
            divStyle = document.createElement('div').style,
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
            l = transformArr.length;
        for (let i = 0; i < l; i += 1) {
            if (transformArr[i] in divStyle) {
                return transform = transformArr[i];
            }
        }
        return transform;
    }

    dragSetMove(pos) {
        this._dragSetPosition(pos);
    }

    get(key) {
        return this._cfg[key];
    }

    set(key, val) {
        this._cfg[key] = val;
        return this;
    }
}

class Item {
    constructor(cfg) {
        const defaultCfg = {
            id: null,
            model: {},
            states: [],
            type: "item",
            size: "manual",
            width: 100,
            height: 100,
            anchorPoints: [
                [0, 0],
                [0.5, 0],
                [1, 0],
                [0, 1],
                [0.5, 1],
                [1, 1],
                [0, 0.5],
                [1, 0.5]
            ],
            x: 0,
            y: 0
        };
        this._cfg = Util.deepMix(defaultCfg, cfg);
        let id = this._cfg.id;
        if (!id || id === "") {
            id = Util.uniqueId(this.get('type'));
        }
        this.set("id", id);
        this.init();
    }

    init() {
        this._updateModelBBox();
        this._createBBox();
        this._createBBoxComponent();
        this._createAnchorPoints();
    }

    get(key) {
        return this._cfg[key];
    }

    set(key, val) {
        if (Util.isObject(key)) {
            for (let k in key) {
                this._cfg[k] = key[k];
            }
        } else {
            this._cfg[key] = val;
        }
        return this;
    }

    _createBBox() {
        let BBox = document.createElement("div");
        let width = this.get("width");
        let height = this.get("height");
        let size = this.get("size");
        let x = this.get("x");
        let y = this.get("y");
        if (size !== "auto") {
            BBox.style.width = width + "px";
            BBox.style.height = height + "px";
        }
        BBox.style.position = "absolute";
        BBox.style.border = "1px solid transparent";
        BBox.style.boxSizing = "border-box";
        BBox.style.left = x + "px";
        BBox.style.top = y + "px";
        this.set("BBox", BBox);
    }

    _createBBoxComponent() {
        let BBox = this.get("BBox");
        let BBoxComponent = document.createElement("div");
        BBoxComponent.style.position = "relative";
        BBoxComponent.style.width = "100%";
        BBoxComponent.style.height = "100%";
        //BBoxComponent.style.pointerEvents = "none";
        BBox.appendChild(BBoxComponent);
        this.set("BBoxComponent", BBoxComponent);
    }

    _calculateBBoxPosition(model) {
        let BBoxPoint = {
            insideCenterX: Math.ceil(model.width / 2),
            insideCenterY: Math.ceil(model.height / 2),
            minX: model.x,
            minY: model.y,
            maxX: model.x + model.width,
            maxY: model.y + model.height,
            centerX: model.x + Math.ceil(model.width / 2),
            centerY: model.y + Math.ceil(model.height / 2)
        };
        for (let k in BBoxPoint) {
            model[k] = BBoxPoint[k];
        }
    }

    _createAnchorPoints() {
        let anchorNames = [];
        let xyMap = {
            0: {
                "0": "left",
                "1": "right",
                "0.5": "center"
            },
            1: {
                "0": "top",
                "1": "bottom",
                "0.5": "center"
            }
        };
        let anchorPoints = this.get("anchorPoints");
        if (!Array.isArray(anchorPoints) || anchorPoints.length === 0) return false;
        anchorPoints.forEach(function (ap) {
            let name;
            if (!Array.isArray(ap) || ap.length !== 2) {
                throw Error('invalid anchorPoint');
            }
            name = xyMap[1][ap[1]] + "-" + xyMap[0][ap[0]];
            anchorNames.push(name);
        });
        this._createPointItem(anchorNames);
    }

    _createPointItem(anchorNames) {
        let BBox = this.get("BBox");
        let anchorContainer = document.createElement("div");
        let convertToStyle = {
            _w: 8,
            _h: 8,
            convert(name) {
                let styleStr = "";
                let style = {};
                let _this = this;
                style["position"] = "absolute";
                style["display"] = "block";
                style["border"] = "1px solid #168DF8";
                style["background"] = "#FFF";
                style["box-sizing"] = "border-box";
                style["width"] = _this._w + "px";
                style["height"] = _this._h + "px";
                let n = name.split("-");
                let n1 = n[0];
                let n2 = n[1];
                let whMap = {
                    top: _this._h,
                    bottom: _this._h,
                    left: _this._w,
                    right: _this._w
                };
                if (n1 !== "center") {
                    style[n1] = -whMap[n1] / 2 + "px";
                } else {
                    style["top"] = "50%";
                    style["margin-top"] = -whMap["top"] / 2 + "px";
                }
                if (n2 !== "center") {
                    style[n2] = -whMap[n2] / 2 + "px";
                } else {
                    style["left"] = "50%";
                    style["margin-left"] = -whMap["left"] / 2 + "px";
                }
                for (let k in style) {
                    styleStr += `${k}:${style[k]};`;
                }
                return styleStr;
            }
        };
        let anchor = {};
        anchorNames = anchorNames || [];
        anchorNames.forEach((an) => {
            let style = convertToStyle.convert(an);
            let anchorElement = document.createElement("span");
            anchorElement.className = an;
            anchorElement.setAttribute("style", style);
            anchorContainer.appendChild(anchorElement);
            anchor[an] = anchorElement;
            this.set("anchorNames", anchor);
        });
        BBox.appendChild(anchorContainer);
        this.set("anchorContainer", anchorContainer);
        this.changeAnchorVisibility(false);
    }

    setItemStyleHide() {
        if (this.isVisibleAnchor()) {
            this.setBBoxStyleNone();
            this.hideAnchor();
            this.set("state", "none");
        }
    }

    setItemStyleShow() {
        if (!this.isVisibleAnchor()) {
            this.setBBoxStyleClick();
            this.showAnchor();
            this.set("state", "click");
        }
    }

    hideAnchor() {
        this.changeAnchorVisibility(false);
    }

    showAnchor() {
        this.changeAnchorVisibility(true);
    }

    changeAnchorVisibility(visible) {
        let anchorContainer = this.get("anchorContainer");
        if (visible) {
            anchorContainer.style.display = "block";
        } else {
            anchorContainer.style.display = "none";
        }
        this.set('_anchorVisible', visible);
    }

    isVisibleAnchor() {
        return this.get('_anchorVisible');
    }

    changeItemMoveStyle(flag) {
        if (flag) {
            this.showAnchor();
            this.set("state", "click");
        } else {
            this.hideAnchor();
            this.set("state", "none");
        }
        this.setBBoxStyleClick();
    }

    setBBoxStyleClick() {
        let BBox = this.get("BBox");
        BBox.style.borderColor = "#168DF8";
    }

    setBBoxStyleNone(){
        let BBox = this.get("BBox");
        BBox.style.borderColor = "transparent";
    }
    setBBox(model) {
        this._calculateBBoxPosition(model);
    }

    update(cfg) {
        let model = this.get("model");
        if (Util.isObject(cfg)) {
            for (let k in cfg) {
                if (this._cfg.hasOwnProperty(k)) {
                    this.set(k, cfg[k]);
                    model[k] = cfg[k];
                } else {
                    model[k] = cfg[k];
                }
            }
        }
        this.setBBox(model);
        this._updateModelStyle(cfg);
    }

    _updateModelStyle(cfg){
        let BBox = this.get("BBox");
        let styleDefaultProp = {
            x:"left",
            y:"top",
            width :"width",
            height:"height"
        };
        for(let k in cfg){
            if(styleDefaultProp.hasOwnProperty(k)){
                BBox.style[styleDefaultProp[k]] = cfg[k] + "px";
            }
        }
    }

    _updateModelBBox() {
        let model = this.get("model");
        let props = ["width", "height", "x", "y", "id", "type"];
        props.forEach((prop) => {
            model[prop] = this.get(prop);
        });
        this.setBBox(model);
    }

    comboComponent(multi){
        if(multi.length > 1){
            let BBoxComponent = this.get("BBoxComponent");
            let model = this.get("model");
            multi.forEach((item)=>{
                let BBox = item.get("BBox");
                let m = item.get("model");
                item.update({
                    x:m.x - model.x,
                    y:m.y - model.y
                });
                BBoxComponent.appendChild(BBox);
            })
        }
    }

    destroy() {
        if (!this.destroyed) {
            this.get("BBox").remove();
            this._cfg = null;
            this.destroyed = true;
        }
    }
}

class ControllerItem {
    constructor(graph) {
        this.graph = graph;
    }

    removeItem(item) {
        try {
            let items = this.graph.get("items");
            let index = items.indexOf(item);
            if (index < 0) return;
            items.splice(index, 1);
            delete this.graph.get('itemById')[item.get('id')];
            item.destroy();
        } catch (e) {
            console.error("not item");
        }
    }

    addItem(cfg) {
        let item = new Item(cfg);
        let BBox = item.get("BBox");
        let multi= this.graph.get("multi");
        this.graph.get("container").appendChild(BBox);
        this.pluginDrag = new PluginEvent(this.graph, {
            name: "drag",
            item: item
        });
        this.graph.get("items").push(item);
        this.graph.get("itemById")[item.get("id")] = item;
        if(multi.length > 0){
            multi = [];
        }
        multi.push(item);
        this.graph.set("multi",multi);
        return item;
    }

    selectItem(item) {
        let items = this.graph.get("items");
        let index = items.indexOf(item);
        if (items.length === 1) {
            item.setItemStyleShow();
        } else {
            items.forEach((it, i) => {
                if (index !== i && it.get("state") === "click") {
                    it.setItemStyleHide();
                } else if (index === i) {
                    it.setItemStyleShow();
                }
            });
        }
    }

    _changeItemMoveStyle(item) {
        let items = this.graph.get("items");
        let index = items.indexOf(item);
        if (items.length === 1) {
            item.changeItemMoveStyle(false);
        } else {
            items.forEach((it, i) => {
                if (index !== i) {
                    it.setItemStyleHide();
                } else {
                    it.changeItemMoveStyle(false);
                }
            });
        }
    }

    undo() {
        try {
            let redos = this.graph.get("redos");
            let item = this.graph.get("item");
            let states = item.get("states");
            if (states.length > 0) {
                let srdo = states.pop();
                redos.push(srdo);
                if (states.length !== 0) {
                    let sudo = states[states.length - 1];
                    this.pluginDrag.dragSetMove(sudo.move);
                } else {
                    this.graph.set("redos", []);
                }
            }
        } catch (e) {
            console.error("invalid Item")
        }

    }

    redo() {
        try {
            let statesUndo = this.item.get("states");
            let states = this.redos;
            if (states.length > 0) {
                let srdo = states.pop();
                statesUndo.push(srdo);
                this.pluginDrag.dragSetMove(srdo.move);
            }
        } catch (e) {
            console.error("invalid Item")
        }
    }

    toBack(item) {
        let items = this.graph.get("items");
        let index = items.indexOf(item);
        if (items.length === 1) return false;
        let dataItem = items.splice(index, 1);
        items.unshift(dataItem[0]);
        //todo 当有组存在时 变为组节点
        let container = this.graph.get("container");
        let firstNode = container.children[0];
        let node = item.get("BBox");
        container.insertBefore(node, firstNode);
    }

    toFront(item) {
        let items = this.graph.get("items");
        let index = items.indexOf(item);
        if (items.length === 1) return false;
        let dataItem = items.splice(index, 1);
        items.push(dataItem[0]);
        let container = this.graph.get("container");
        let node = item.get("BBox");
        container.appendChild(node);
    }

    combo(multi){
        let xs = [];
        let ys = [];
        multi.forEach((item)=>{
            let model = item.get("model");
            xs.push(model.minX,model.maxX);
            ys.push(model.minY,model.maxY);
        });
        xs.sort((a,b)=>{
            return a-b;
        });
        ys.sort((a,b)=>{
            return a-b;
        });
        let gMinX = xs[0];
        let gMaxX = xs[xs.length - 1];
        let gMinY = ys[0];
        let gMaxY = ys[ys.length - 1];
        let cfg = {
            x:gMinX,
            y:gMinY,
            width :gMaxX - gMinX,
            height:gMaxY - gMinY
        };
        let item = this.addItem(cfg);
        item.comboComponent(multi);
        this.selectItem(item);
    }
}

class Graph extends EventEmitter {
    constructor(cfg) {
        super();
        this._cfg = Util.deepMix(this.getDefaultCfg(), cfg);
        this._init();
    }

    getDefaultCfg() {
        return {
            container: null,
            items: [],
            itemById: {},
            multi:[],
            plugins: ["ruler", "pullBox", "dragStage", "zoomStage","multiSelect"]
        };
    }

    _init() {
        this._initContainer();
        const itemController = new ControllerItem(this);
        this.set({
            itemController
        });
        this._initPlugins();
    }

    _initPlugins() {
        let plugins = this.get("plugins");
        plugins.forEach((name) => {
            new PluginEvent(this, {
                name: name
            });
        });
    };

    _initContainer() {
        let container = this.get("container");
        if (Util.isString(container)) {
            container = document.getElementById(container);
            this.set('container', container);
        }
        if (!container) {
            throw Error('invalid container');
        }
    }

    get(key) {
        return this._cfg[key];
    }

    set(key, val) {
        if (Util.isObject(key)) {
            for (let k in key) {
                this._cfg[k] = key[k];
            }
        } else {
            this._cfg[key] = val;
        }
        return this;
    }

    remove(item) {
        this.removeItem(item);
    }

    removeItem(item) {
        this.get("itemController").removeItem(item);
    }

    addItem(model) {
        return this.get("itemController").addItem(model);
    }

    add(model) {
        this.addItem(model);
    }

    undo() {
        this.get("itemController").undo();
    }

    redo() {
        this.get("itemController").redo();
    }

    findById(id) {
        return this.get('itemById')[id];
    }

    data(data) {
        this.set("data", data);
    }

    render() {
        const data = this.get("data");
    }

    save() {
        let items = [];
        let its = this.get("items");
        its.forEach(function (item) {
            let model = item.get("model");
            items.push(model);
        });
        return {items};
    }

    destroy() {

    }

    toBack(item) {
        this.get("itemController").toBack(item);
    }

    toFront(item) {
        this.get("itemController").toFront(item);
    }

    selectItem(item) {
        this.get("itemController").selectItem(item);
    }

    ss(item) {
        this.selectItem(item);
    }
    combo(){
        let multi = this.get("multi");
        if(multi.length <=1)return false;
        this.get("itemController").combo(multi);
    }
}

let KVis = {
    Graph: Graph,
    version: "0.0.1"
};
