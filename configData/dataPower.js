let dataPower = [
    {
        name: "name",
        displayName: "名称:",
        type: "text",
        accessType: "attr",
        nodeType: "shape",
        field: "required"
    },
    {
        name: "code",
        displayName: "物理编码:",
        type: "text",
        accessType: "attr",
        field: "required",
        values:123
    },
    {
        name: "extSystemId",
        displayName: "外部系统ID:",
        type: "text",
        accessType: "attr"
    },
    {
        name: "type",
        displayName: "电表类型:",
        type: "combo",
        accessType: "attr",
        values: [[0, 1, 2], ["单相表", "三相三线表", "三相四线表"]],
    },
    {
        name: "typeface",
        displayName: "设备型号:",
        type: "text",
        accessType: "attr",
        field: "required"
    },
    {
        name: "maximumRange",
        displayName: "最大量程(kWh):",
        type: "text",
        accessType: "attr",
        field: "required"
    },
    {
        name: "manufacturers",
        displayName: "制造厂家:",
        type: "textArea",
        accessType: "attr",
        field: "required"
    },
    {
        name: "location",
        displayName: "安装位置:",
        type: "tree",
        accessType: "attr",
        field:"required"
    },
    {
        name: "installationTime",
        displayName: "安装日期:",
        type: "date",
        accessType: "attr"
    },
    {
        name: "equipmentType",
        displayName: "设备状态:",
        type: "combo",
        accessType: "attr",
        values: [[0, 1, 2], ["完好", "待修", "报废"]],
        field:"required"
    }
];
