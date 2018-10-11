//import Vue from "vue";
import VueKonva from "vue-konva";
//Vue.use(VueKonva);/*  */
//Vue.config.productionTip = false;


let furniture = {
    layers: [],
    stage: {},
    layer:{},
    groups: {
        'count' : 0
        },
    shelfsDefaultPositions : {},
    limitation: {},
    zIndexConfig:{
        'leftSection': 20,
        'rightSection': 50,
        'topSection': 60,
        'botSection': 1
    },
    firstPoint:{
        x: 50,
        y: 70
    },
    height: 280,
    width:380,
    createGroup: function(iter = 1){
        for(let i = 1; i<=iter; i++){
            this.groups['group'+ (this.groups.count + 1)] = {
                shelfGroup: new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'shelves' + (this.groups.count + 1)
                }),

                sectionGroup: new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'section' + (this.groups.count + 1)
                }),

                boxGroup: new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'box' + (this.groups.count + 1)
                })
            };
            this.groups.count++;
        }
    },
    createLeftSection: function() {
        let polyLeft = new Konva.Line({
            points: [this.firstPoint.x, this.firstPoint.y, this.firstPoint.x+40, this.firstPoint.y-43, this.firstPoint.x+40, this.firstPoint.y-43+this.height, this.firstPoint.x, this.firstPoint.y+this.height, this.firstPoint.x, this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'leftSection'
        });

        this.limitation['left'] = polyLeft.attrs.points[0];
        this.layers[this.layers.length] = polyLeft;
        this.layer.add(polyLeft);
        polyLeft.setZIndex(2);
    },
    createRightSection: function() {
        let polyRight = new Konva.Line({
            points: [this.firstPoint.x+this.width, this.firstPoint.y, this.firstPoint.x+this.width+40, this.firstPoint.y-43, this.firstPoint.x+this.width+40, this.firstPoint.y-43+this.height, this.firstPoint.x+this.width, this.firstPoint.y+this.height, this.firstPoint.x+this.width, this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'rightSection'
        });

        this.limitation['right'] = polyRight.attrs.points[0];
        this.layers[this.layers.length] = polyRight;
        this.layer.add(polyRight);
        polyRight.setZIndex(50);
    },

    createTopSection: function() {
        let polyTop = new Konva.Line({
            points: [this.firstPoint.x, this.firstPoint.y, this.firstPoint.x+40, this.firstPoint.y-43 , this.firstPoint.x+this.width+40, this.firstPoint.y-43, this.firstPoint.x+this.width, this.firstPoint.y, this.firstPoint.x+this.width, this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'topSection'
        });

        this.limitation['top'] = polyTop.attrs.points[1];
        this.layers[this.layers.length] = polyTop;
        this.layer.add(polyTop);
        polyTop.setZIndex(60);
    },

    createBotSection: function() {
        let polyBot = new Konva.Line({
            points: [this.firstPoint.x, this.firstPoint.y+this.height, this.firstPoint.x+40, this.firstPoint.y+this.height-43 , this.firstPoint.x+40+this.width, this.firstPoint.y+this.height-43, this.firstPoint.x+this.width, this.firstPoint.y+this.height, this.firstPoint.x+this.width, this.firstPoint.y+this.height],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'botSection'
        });

        this.limitation['bottom'] = polyBot.attrs.points[1];
        this.layers[this.layers.length] = polyBot;
        this.layer.add(polyBot);
        polyBot.setZIndex(1);
    },
    createShelf: function() {
        let shelf = new Konva.Line({
            points: [this.firstPoint.x, (this.height)/2+this.firstPoint.y, this.firstPoint.x+40, (this.height)/2+this.firstPoint.y-43, (this.width)/2 + this.firstPoint.x+40, (this.height)/2+this.firstPoint.y-43, (this.width)/2 + this.firstPoint.x, (this.height)/2+this.firstPoint.y, this.firstPoint.x, (this.height)/2+this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'shelf',
            dragBoundFunc: (pos) => {
                let minY = this.limitation.top;
                let maxY = this.limitation.bottom;
                let newY;
                if(pos.y < (maxY-minY)/2*(-1) + 20){
                    newY = (maxY-minY)/2*(-1) + 20;
                }else if (pos.y > (maxY-minY)/2 - 20 ){
                    newY = (maxY-minY)/2 - 20;
                }else{
                    newY = pos.y;
                }
                return {
                    x: 0,
                    y: newY
                }
            }
        });

        this.shelfsDefaultPositions['shelfX1'] = shelf.attrs.points[4];
        this.shelfsDefaultPositions['shelfX2'] = shelf.attrs.points[6];
        this.groups['group1']['shelfGroup'].add(shelf);
        this.layers[this.layers.length] = this.groups['group1']['shelfGroup'];
        this.layer.add(this.groups['group1']['shelfGroup']);
    },

    addShelf: function(section){
        section = parseInt(section);
        let x1,x2,x3,x4,shelf,attrs,oldZIndex,
            sections = {};
        for(let i = 1; i<this.groups.count; i++){
            sections[i] = this.groups['group'+i]['sectionGroup']['children'][0];
            sections['length'] = i;
        }
        x3 = this.shelfsDefaultPositions['currentShelfX1'] ? this.shelfsDefaultPositions['currentShelfX1'] : 285;
        x4 = this.shelfsDefaultPositions['currentShelfX2'] ? this.shelfsDefaultPositions['currentShelfX2'] : 245;
        if(sections.length > 0 && section > 1){
            attrs = sections[section-1]['attrs'];
            x1 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
            x2 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
            if(sections.hasOwnProperty(section)){
                attrs = sections[section]['attrs'];
                x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
                x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
            }else{
                x3 = this.limitation['right']+40;
                x4 = this.limitation['right'];
            }
        }else{
            attrs = sections[section]['attrs'];
            x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
            x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
        }

        shelf = new Konva.Line({
            points: [x1?x1:50, (this.height)/2+this.firstPoint.y, x2?x2:90, (this.height)/2+this.firstPoint.y-43, x3,(this.height)/2+this.firstPoint.y-43, x4, (this.height)/2+this.firstPoint.y, x1?x1:50, (this.height)/2+this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'shelf'
        });
        if(!this.shelfsDefaultPositions.hasOwnProperty('shelfX1') && !this.shelfsDefaultPositions.hasOwnProperty('shelfX2')){
            this.shelfsDefaultPositions['shelfX1'] = shelf.attrs.points[4];
            this.shelfsDefaultPositions['shelfX2'] = shelf.attrs.points[6];
        }


        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key];
                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'section' + (section - 1)) {
                    oldZIndex = child.getZIndex();
                }
            }
        }

        this.groups['group'+section]['shelfGroup'].add(shelf);
        if(section>1){
            for(let key in this.stage.children[0]['children']){
                if(this.stage.children[0]['children'].hasOwnProperty(key)){
                    let child = this.stage.children[0]['children'][key];
                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name != 'shelves'+section){
                        this.layer.add(this.groups['group'+section]['shelfGroup']);
                        this.groups['group'+section]['shelfGroup'].setZIndex(oldZIndex+1);
                    }
                }
            }
        }

        this.shelfGroupPosition(this.groups['group'+section]['shelfGroup']['children'], section);

        this.layer.draw();

    },

    addBox: function(section){
        section = parseInt(section);
        let x1,x2,x3,x4,box,attrs,oldZIndex,
            sections = {};
        for(let i = 1; i<this.groups.count; i++){
            sections[i] = this.groups['group'+i]['sectionGroup']['children'][0];
            sections['length'] = i;
        }
        if(sections.length > 0 && section > 1){
            attrs = sections[section-1]['attrs'];
            x1 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
            x2 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
            if(sections.hasOwnProperty(section)){
                attrs = sections[section]['attrs'];
                x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
                x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
            }else{
                x3 = this.limitation['right']+40;
                x4 = this.limitation['right'];
            }
        }else{
            attrs = sections[section]['attrs'];
            x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
            x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
        }

        box = new Konva.Line({
            points: [x1?x1:50, 225, x2?x2:90, 182, x3,182, x4, 225, x1?x1:50, 225],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'shelf'
        });
        if(!this.shelfsDefaultPositions.hasOwnProperty('shelfX1') && !this.shelfsDefaultPositions.hasOwnProperty('shelfX2')){
            this.shelfsDefaultPositions['shelfX1'] = box.attrs.points[4];
            this.shelfsDefaultPositions['shelfX2'] = box.attrs.points[6];
        }


        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key];
                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'section' + (section - 1)) {
                    oldZIndex = child.getZIndex();
                }
            }
        }

        this.groups['group'+section]['shelfGroup'].add(box);
        if(section>1){
            for(let key in this.stage.children[0]['children']){
                if(this.stage.children[0]['children'].hasOwnProperty(key)){
                    let child = this.stage.children[0]['children'][key];
                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name != 'shelves'+section){
                        this.layer.add(this.groups['group'+section]['shelfGroup']);
                        this.groups['group'+section]['shelfGroup'].setZIndex(oldZIndex+1);
                    }
                }
            }
        }

        this.shelfGroupPosition(this.groups['group'+section]['shelfGroup']['children'], section);

        this.layer.draw();

    },

    shelfGroupPosition(children, section){
        if(children){
            let count = children.length,
                interval = (this.height - 40)/count,
                i=1,
                center = [50, 225, 90, 182, 285, 182, 245, 225, 50, 225];

            for(let y = children.length; y >= 0; y--){
                if(children.hasOwnProperty(y) && children[y].hasOwnProperty('attrs')){
                    let attrs = children[y]['attrs'];
                    if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                        attrs.points[1] = interval*i + 90 - interval/2;
                        attrs.points[3] = interval*i - 43 + 90 - interval/2;
                        attrs.points[5] = interval*i - 43 + 90 - interval/2;
                        attrs.points[7] = interval*i + 90 - interval/2;
                        attrs.points[9] = interval*i + 90 - interval/2;
                        i++;

                        attrs.dragBoundFunc = (pos) => {
                            let minY = this.limitation.top;
                            let maxY = this.limitation.bottom;
                            let newY;
                            let isFirst = !children.hasOwnProperty(y+1);
                            let isLast = !children.hasOwnProperty(y-1);
                            let newChildren;

                            for(let key in this.stage.children[0]['children']){
                                if(this.stage.children[0]['children'].hasOwnProperty(key)){
                                    let child = this.stage.children[0]['children'][key];
                                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'shelves'+section){
                                        let shelfGroup = child;
                                        if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                            newChildren = shelfGroup['children'];
                                        }
                                    }

                                }
                            }

                            if(isFirst){
                                let nextShelf,changeY;
                                if(newChildren.hasOwnProperty(y-1)){
                                    nextShelf = newChildren[y-1]['attrs']['points'][1] - attrs.points[1] - 20;
                                    changeY = newChildren[y-1]['changedY'] ? newChildren[y-1]['changedY'] : 0;
                                }else{
                                    nextShelf = (maxY-attrs.points[1]) - 20;
                                    changeY = 0;
                                }
                                if(pos.y < (attrs.points[1] - minY - 20)*-1){
                                    newY = (attrs.points[1] - minY - 20)*-1;
                                }else if (pos.y > (nextShelf + changeY)){
                                    newY = (nextShelf + changeY);
                                }else{
                                    newY = pos.y;
                                }
                                return {
                                    x: 0,
                                    y: newY
                                }
                            }else if (isLast){
                                if(pos.y < ((attrs.points[1] - newChildren[y+1]['attrs']['points'][1] - 20 - (newChildren[y+1]['changedY'] ? newChildren[y+1]['changedY'] : 0)) *-1)){
                                    newY = (attrs.points[1] - newChildren[y+1]['attrs']['points'][1] - 20 - (newChildren[y+1]['changedY'] ? newChildren[y+1]['changedY'] : 0))*-1;
                                }else if (pos.y > (maxY-attrs.points[1]) - 20 ){
                                    newY = (maxY-attrs.points[1]) - 20;
                                }else{
                                    newY = pos.y;
                                }
                                return {
                                    x: 0,
                                    y: newY
                                }
                            }else{
                                if(pos.y < (attrs.points[1] - newChildren[y+1]['attrs']['points'][1] - 20 - (newChildren[y+1]['changedY'] ? newChildren[y+1]['changedY'] : 0))*-1){
                                    newY = (attrs.points[1] - newChildren[y+1]['attrs']['points'][1] - 20 - (newChildren[y+1]['changedY'] ? newChildren[y+1]['changedY'] : 0))*-1;
                                }else if (pos.y > (newChildren[y-1]['attrs']['points'][1] - attrs.points[1] - 20 + (newChildren[y-1]['changedY'] ? newChildren[y-1]['changedY'] : 0)) ){
                                    newY = (newChildren[y-1]['attrs']['points'][1] - attrs.points[1] - 20 + (newChildren[y-1]['changedY'] ? newChildren[y-1]['changedY'] : 0));
                                }else{
                                    newY = pos.y;
                                }
                                return {
                                    x: 0,
                                    y: newY
                                }
                            }
                        };
                        children[y].on('dragend', (e) => {
                            let pos = this.stage.getPointerPosition();
                            let shape = this.layer.getIntersection(pos);

                            children[y]['changedY'] = e.target.attrs.y;
                            this.layer.draw();
                        });
                    }
                }
            }
        }

    },

    createSectin: function(){
        let polySection = new Konva.Line({
            points: [(this.width)/2 + this.firstPoint.x, this.firstPoint.y, (this.width)/2 + this.firstPoint.x+40, this.firstPoint.y-43, (this.width)/2 + this.firstPoint.x+40, this.firstPoint.y+this.height-43, (this.width)/2 + this.firstPoint.x, this.firstPoint.y+this.height, (this.width)/2 + this.firstPoint.x, this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'section1',
            dragBoundFunc: (pos) => {
                let minX = this.limitation.left,
                    maxX = this.limitation.right,
                    newX;
                if(pos.x < (maxX-minX)/2*(-1) + 20){
                    newX = (maxX-minX)/2*(-1) + 20;
                }else if (pos.x > (maxX-minX)/2 - 20 ){
                    newX = (maxX-minX)/2 - 20;
                }else{
                    newX = pos.x;
                }
                for(let key in this.stage.children[0]['children']){
                    if(this.stage.children[0]['children'].hasOwnProperty(key)){
                        let child = this.stage.children[0]['children'][key];
                        if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.attrs.name == 'shelves1'){
                            let shelfGroup = child;
                            if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                let children = shelfGroup['children'];

                                for(let key in children){
                                    if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                        let attrs = children[key]['attrs'];
                                        if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                                            attrs.points[4] = this.shelfsDefaultPositions['currentShelfX1'] = this.shelfsDefaultPositions.shelfX1 + newX;
                                            attrs.points[6] = this.shelfsDefaultPositions['currentShelfX2'] = this.shelfsDefaultPositions.shelfX2 + newX;
                                        }
                                    }
                                }
                            }
                        }else if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.attrs.name == 'shelves2'){
                            let shelfGroup = child;
                            if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                let children = shelfGroup['children'];

                                for(let key in children){
                                    if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                        let attrs = children[key]['attrs'];
                                        if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                                            attrs.points[2] = this.shelfsDefaultPositions['currentShelfX1'] = this.shelfsDefaultPositions.shelfX1 + newX;
                                            attrs.points[0] = attrs.points[8] = this.shelfsDefaultPositions['currentShelfX2'] = this.shelfsDefaultPositions.shelfX2 + newX;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return {
                    x: newX,
                    y: 0
                }
            }
        });
        this.groups['group1']['sectionGroup'].add(polySection);
        this.layer.add(this.groups['group1']['sectionGroup']);
        this.layers[this.layers.length] = this.groups['group1']['sectionGroup'];
    },
    addSection: function(section){
        this.createGroup();
        let sections= {};
        let polySection = new Konva.Line({
            points: [(this.width)/2 + this.firstPoint.x, this.firstPoint.y, (this.width)/2 + this.firstPoint.x+40, this.firstPoint.y-43, (this.width)/2 + this.firstPoint.x+40, this.firstPoint.y+this.height-43, (this.width)/2 + this.firstPoint.x, this.firstPoint.y+this.height, (this.width)/2 + this.firstPoint.x, this.firstPoint.y],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'section1',
        });
        let oldZIndex;
        this.groups['group'+(this.groups.count-1)]['sectionGroup'].add(polySection);

        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key];
                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'shelves' + (section - 1)) {
                    oldZIndex = child.getZIndex();
                }else if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'section' + (section - 2)){
                    oldZIndex = child.getZIndex();
                }
            }
        }

        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key];
                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name != 'section' + (section - 1)) {
                    this.layer.add(this.groups['group' + (section - 1)]['sectionGroup']);
                    this.groups['group' + (section - 1)]['sectionGroup'].setZIndex(oldZIndex+1);
                }
            }
        }
        for(let i = 1; i<this.groups.count; i++){
            sections[i] = this.groups['group'+i]['sectionGroup']['children'][0];
            sections['length'] = i;
        }

        this.sectionGroupPosition(sections);
        this.layer.draw();
    },
    // removeSection: function(){
    //     let sections= {};
    //
    //      console.log(this.groups);
    //     this.groups['group'+(this.groups.count-1)]['sectionGroup'].remove();
    //     this.groups['group'+(this.groups.count)]['shelfGroup'].remove();
    //     delete this.groups['group'+(this.groups.count)];
    //
    //     this.groups['count'] = this.groups.count-1;
    //
    //     console.log(this.groups.count, this.groups);
    //     for(let i = 1; i<this.groups.count; i++){
    //         sections[i] = this.groups['group'+i]['sectionGroup']['children'][0];
    //         sections['length'] = i;
    //     }
    //
    //     this.sectionGroupPosition(sections);
    //     this.layer.draw();
    // },
    sectionGroupPosition(children){
        if(children){
            let count = children.length,
                interval = (this.width - 40)/count,
                i=1,
                center = [245, 70, 285, 27, 285, 307, 245, 350, 245, 70];

            for(let y = 0; y <= children.length; y++){
                if(children.hasOwnProperty(y) && children[y].hasOwnProperty('attrs')){
                    let attrs = children[y]['attrs'];
                    if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'section1'){
                        attrs.points[0] = interval*i + 90 - interval/2;
                        attrs.points[2] = interval*i + 40 + 90 - interval/2;
                        attrs.points[4] = interval*i + 40 + 90 - interval/2;
                        attrs.points[6] = interval*i + 90 - interval/2;
                        attrs.points[8] = interval*i + 90 - interval/2;
                        i++;

                        for(let key in this.stage.children[0]['children']){
                            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                                let child = this.stage.children[0]['children'][key];
                                if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.attrs.name == 'shelves'+(y)){
                                    let shelfGroup = child;
                                    if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                        let children = shelfGroup['children'];
                                        for(let key in children){
                                            if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                                let shelfAttrs = children[key]['attrs'];
                                                if(shelfAttrs && shelfAttrs.hasOwnProperty('name') && shelfAttrs.name == 'shelf'){
                                                    shelfAttrs.points[4] = attrs.points[2];
                                                    shelfAttrs.points[6] = attrs.points[0];
                                                }
                                            }
                                        }
                                    }
                                }else if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.attrs.name == 'shelves'+(y+1)){
                                    let shelfGroup = child;
                                    if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                        let children = shelfGroup['children'];
                                        for(let key in children){
                                            if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                                let shelfAttrs = children[key]['attrs'];
                                                if(shelfAttrs && shelfAttrs.hasOwnProperty('name') && shelfAttrs.name == 'shelf'){
                                                    shelfAttrs.points[2] = attrs.points[2];
                                                    shelfAttrs.points[0] = shelfAttrs.points[8] = attrs.points[0];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        attrs.dragBoundFunc = (pos) => {
                            let minX = this.limitation.left;
                            let maxX = this.limitation.right;
                            let newX;
                            let isFirst = !children.hasOwnProperty(y-1);
                            let isLast = !children.hasOwnProperty(y+1);
                            let newChildren = children;

                            if(isFirst){
                                if(pos.x < (attrs.points[0] - minX - 20)*-1){
                                    newX = (attrs.points[0] - minX - 20)*-1;
                                }else if (pos.x > (newChildren[y+1]['attrs']['points'][0] - attrs.points[0] - 20 + (newChildren[y+1]['changedX'] ? newChildren[y+1]['changedX'] : 0))){
                                    newX = (newChildren[y+1]['attrs']['points'][0] - attrs.points[0] - 20 + (newChildren[y+1]['changedX'] ? newChildren[y+1]['changedX'] : 0));
                                }else{
                                    newX = pos.x;
                                }
                            }else if (isLast){
                                if(pos.x < ((attrs.points[0] - newChildren[y-1]['attrs']['points'][0] - 20 - (newChildren[y-1]['changedX'] ? newChildren[y-1]['changedX'] : 0)) *-1)){
                                    newX = (attrs.points[0] - newChildren[y-1]['attrs']['points'][0] - 20 - (newChildren[y-1]['changedX'] ? newChildren[y-1]['changedX'] : 0))*-1;
                                }else if (pos.x > (maxX-attrs.points[0]) - 20 ){
                                    newX = (maxX-attrs.points[0]) - 20;
                                }else{
                                    newX = pos.x;
                                }
                            }else{
                                if(pos.x < (attrs.points[0] - newChildren[y-1]['attrs']['points'][0] - 20 - (newChildren[y-1]['changedX'] ? newChildren[y-1]['changedX'] : 0))*-1){
                                    newX = (attrs.points[0] - newChildren[y-1]['attrs']['points'][0] - 20 - (newChildren[y-1]['changedX'] ? newChildren[y-1]['changedX'] : 0))*-1;
                                }else if (pos.x > (newChildren[y+1]['attrs']['points'][0] - attrs.points[0] - 20 + (newChildren[y+1]['changedX'] ? newChildren[y+1]['changedX'] : 0)) ){
                                    newX = (newChildren[y+1]['attrs']['points'][0] - attrs.points[0] - 20 + (newChildren[y+1]['changedX'] ? newChildren[y+1]['changedX'] : 0));
                                }else{
                                    newX = pos.x;
                                }
                            }

                            for(let key in this.stage.children[0]['children']){
                                if(this.stage.children[0]['children'].hasOwnProperty(key)){
                                    let child = this.stage.children[0]['children'][key];
                                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.attrs.name == 'shelves'+(y)){
                                        let shelfGroup = child;
                                        if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                            let children = shelfGroup['children'];
                                            for(let key in children){
                                                if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                                    let shelfAttrs = children[key]['attrs'];
                                                    if(shelfAttrs && shelfAttrs.hasOwnProperty('name') && shelfAttrs.name == 'shelf'){
                                                        shelfAttrs.points[4] = attrs.points[2] + newX;
                                                        shelfAttrs.points[6] = attrs.points[0] + newX;
                                                    }
                                                }
                                            }
                                        }
                                    }else if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.attrs.name == 'shelves'+(y+1)){
                                        let shelfGroup = child;
                                        if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                            let children = shelfGroup['children'];
                                            for(let key in children){
                                                if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                                    let shelfAttrs = children[key]['attrs'];
                                                    if(shelfAttrs && shelfAttrs.hasOwnProperty('name') && shelfAttrs.name == 'shelf'){
                                                        shelfAttrs.points[2] = attrs.points[2] + newX;
                                                        shelfAttrs.points[0] = shelfAttrs.points[8] = attrs.points[0] + newX;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return {
                                x: newX,
                                y: 0
                            }
                        };
                        children[y].on('dragend', (e) => {
                            let pos = this.stage.getPointerPosition();
                            let shape = this.layer.getIntersection(pos);

                            children[y]['changedX'] = e.target.attrs.x;
                            this.layer.draw();
                        });
                    }
                }
            }
        }

    },
    createLayer: function(obj) {
        this.layer = new Konva.Layer();

        //this.layer.add(...obj);
        //this.createStage(this.layer);
    },
    createStage: function(layer) {
        let width = window.innerWidth;
        let height = window.innerHeight;

        this.stage = new Konva.Stage({
            container: 'app',
            width: width,
            height: height
        });


        this.stage.add(layer);
        // for(let i = this.layer['children'].length-1; i >= 0; i--){
        //     if(this.layer['children'].hasOwnProperty(i) && this.layer['children'][i].hasOwnProperty('attrs') && this.layer['children'][i]['attrs']['name'] != 'shelves1' && this.layer['children'][i]['attrs']['name'] != 'section1'){
        //         let childName = this.layer['children'][i]['attrs']['name'];
        //         this.layer['children'][i].setZIndex(this.zIndexConfig[childName]);
        //         console.log(childName, this.zIndexConfig[childName], this.layer['children'][i].getZIndex());
        //     }
        // }
        // this.groups['group1']['sectionGroup'].setZIndex(4);
        // this.groups['group1']['shelfGroup'].setZIndex(3);
        // this.layer.draw();
        console.log(this.stage['children']);
    },

    init: function() {
        this.createLayer();
        this.createGroup(2);
        this.createBotSection();
        this.createLeftSection();
        this.createShelf();
        this.createSectin();
        this.createRightSection();

        this.createTopSection();
        this.createStage(this.layer);
    }
};


furniture.init();

let shelvesWrap = document.body.querySelector('.shelves-wrap');

document.body.addEventListener('click', function(e){
    if(e.target.classList.contains('addShelf')){
        let group = e.target.getAttribute('data-group');
        furniture.addShelf(group);
    }else if (e.target.classList.contains('addSection')){
        let group = e.target.getAttribute('data-group'),
            span  = document.createElement('SPAN');
        furniture.addSection(group);
        e.target.setAttribute('data-group', parseInt(group)+1);
        console.log(group);
        span.innerHTML = `<button class="addShelf" data-group="${parseInt(group)}">Добавить полку в ${parseInt(group)} секцию</button>`;
        shelvesWrap.append(span);
    }else if (e.target.classList.contains('removeSection')){
        furniture.removeSection();
    }
});