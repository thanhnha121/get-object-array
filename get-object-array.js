function GOA_DetectArray(data, array) {
    var result = [];

    for (var i = 0; i <= array.length - 1; i++) {
        for (var j = 0; j <= array[i].length - 1; j++) {
            var tmp = GOA_SplitLeftArray(array[i], j, data);
            var isArray = false;
            try {
                isArray = Array.isArray(eval('data.' + tmp));
            } catch (e) {
                isArray = false;
            }
            if (isArray) {
                var left = GOA_SplitLeftArray(array[i], j, data);
                var right = GOA_SplitRightArray(data, array[i], j); 
                result = GOA_AddToResult(data, result, array, left, right);
            }
        }
    }
    return result;
}

function GOA_AddToResult(data, result, array, left, right) {
    var check = 0;
    for (var i = result.length - 1; i >= 0; i--) {
        if (result[i].path === left) {
            var fieldsString = result[i].fields.map(x => x.name);
            try {
                if (!fieldsString.includes(right)) {
                    result[i].fields.push({
                        name: right,
                        value: eval('data.' + left + '[0].' + right) 
                    });
                }
            } catch (e) {}
            
            check = 1;
        }
    }
    if (check === 0) {
        try {
            result.push({
                path: left,
                fields: [ {
                    name: right,
                    value: eval('data.' + left + '[0].' + right) 
                } ]
            });
        } catch (e) {}
        
    }
    return result;
}


function GOA_SplitRightArray(data, array, index) {
    var rs = '';
    for (var i = index + 1; i <= array.length - 1; i++) {
        if (i != index + 1 && isNaN(array[i])) {
            rs += '.';
        }
        var tmp = GOA_SplitLeftArray(array, i, data);
        var isArray = false;
        try {
            isArray = Array.isArray(eval('data.' + tmp));
        } catch (e) {
            isArray = false;
        }

        if (!isNaN(array[i]) && isArray) {
            rs += '[' + array[i] + ']';
        } else if (!isNaN(array[i]) && !isArray) {
            rs += '[\'' + array[i] + '\']';
        } else {
            rs += array[i];
        }
    }
    return rs;
}

function GOA_SplitLeftArray(array, index, data) {
    var rs = '';
    for (var i = 0; i <= index - 1; i++) {
        var isArray = false;
        try {
            isArray = Array.isArray(eval('data.' + rs));
        } catch (e) {
            isArray = false;
        }

        if (!isNaN(array[i]) && isArray) {
            rs += '[' + array[i] + ']';
        } else if (!isNaN(array[i]) && !isArray) {
            rs += '[\'' + array[i] + '\']';
        } else {
            rs += array[i];
        }
        if (i != index - 1 && isNaN(array[i + 1])) {
            rs += '.';
        }
    }

    return rs;
}

function GOA_ObjTree(item) {
    function iter(r, p) {
        var keys = Object.keys(r);
        if (keys.length) {
            return keys.forEach((x) => {
                if (typeof r[x] === 'object') {
                    iter(r[x], p.concat(x));
                } else {
                    result.push(p.concat(x));
                }
            });
        }
        result.push([p]);
    }
    var result = [];
    iter(item, []);
    return result;
}

function GOA_Execute(data) {
    var tree = GOA_ObjTree(data);
    var result = GOA_DetectArray(data, tree);
    return result;
}

function GOA_Demo() {
    var data = {
            "menu": {
            "header": "SVG Viewer",
            "items": [
                {"id": "OpenNew", "label": "Open New"},
                {"id": "ZoomIn", "label": "Zoom In"},
                {"id": "ZoomOut", "label": "Zoom Out"},
                {"id": "OriginalView", "label": "Original View"},
                {"id": "Find", "label": "Find..."},
                {"id": "FindAgain", "label": "Find Again"},
                {"id": "CopyAgain", "label": "Copy Again"},
                {"id": "CopySVG", "label": "Copy SVG"},
                {"id": "ViewSVG", "label": "View SVG"},
                {"id": "ViewSource", "label": "View Source"},
                {"id": "SaveAs", "label": "Save As"},
                {"id": "About", "label": "About Adobe CVG Viewer..."}
            ],
            "more_info": [ 
                { "language": "EN", "locate": "US" },
                {
                    0: { name: "John", age: 20 },
                    1: { 
                        name: "Deo", 
                        age: 22,
                        objects: [ { name: "Square", color: "Red" } ]
                    }
                },
                {
                    tags: [
                        { id: 1, tag: "Deeper" },
                        { id: 2, tag: "Slap" }
                    ]
                }
            ]
        }
    };

    var result = GOA_Execute(data);
    console.log('Result: ', result);
}

GOA_Demo();