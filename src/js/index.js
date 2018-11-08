import {watchers} from './watcher'

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
        x: 70,
        y: 70
    },
    height: window.furniture_calc.height ? window.furniture_calc.height : 280,
    width: window.furniture_calc.width ? window.furniture_calc.width : 380,
    bevelDegreeX: 40,
    bevelDegreeY: 43,
    strokeColor: '#868686',
    createGroup(iter = 1, onlySection = false){
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
                }),
                crossBarGroup: new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'crossBar' + (this.groups.count + 1)
                }),
                buttonGroup: new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'button' + (this.groups.count + 1)
                })
            };
            this.groups.count++;
        }
        if(!onlySection){
            this.groups['doorsGroup'] = new Konva.Group({
                x: 0,
                y: 0,
                name: 'doors',
                draggable: false
            });
            this.layer.add(this.groups['doorsGroup'])

            this.groups['rightConsoleGroup'] = new Konva.Group({
                x: 0,
                y: 0,
                name: 'rightConsoleGroup',
                draggable: false
            })
            this.groups['leftConsoleGroup'] = new Konva.Group({
                x: 0,
                y: 0,
                name: 'leftConsoleGroup',
                draggable: false
            })

            this.layer.add(this.groups['rightConsoleGroup'])
            this.layer.add(this.groups['leftConsoleGroup'])
        }
    },
    createLeftSection() {
        let x1 = this.firstPoint.x;
        let y1 = this.firstPoint.y;
        let height = this.height;
        let polyLeft = new Konva.Line({
            points: [x1, y1, x1+40, y1-43, x1+40, y1-43+height, x1, y1+height, x1, y1],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            name: 'leftSection'
        });

        this.limitation['left'] = polyLeft.attrs.points[0];
        this.layers[this.layers.length] = polyLeft;
        this.layer.add(polyLeft);
        polyLeft.setZIndex(2);
    },

    createRightSection() {
        let x1 = this.firstPoint.x;
        let y1 = this.firstPoint.y;
        let width = this.width;
        let height = this.height;
        let polyRight = new Konva.Line({
            points: [x1+width, y1, x1+width+40,y1-43, x1+width+40, y1-43+height, x1+width, y1+height, x1+width, y1],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            name: 'rightSection'
        });

        this.limitation['right'] = polyRight.attrs.points[0];
        this.layers[this.layers.length] = polyRight;
        this.layer.add(polyRight);
        polyRight.setZIndex(50);
    },
    createTopSection() {
        let x1 = this.firstPoint.x;
        let y1 = this.firstPoint.y;
        let width = this.width;
        let polyTop = new Konva.Line({
            points: [x1, y1, x1+40, y1-43 , x1+width+40, y1-43, x1+width, y1, x1+width, y1],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            name: 'topSection'
        });

        this.limitation['top'] = polyTop.attrs.points[1];
        this.layers[this.layers.length] = polyTop;
        this.layer.add(polyTop);
        polyTop.setZIndex(60);
    },

    createBotSection() {
        let x1 = this.firstPoint.x;
        let y1 = this.firstPoint.y;
        let width = this.width;
        let height = this.height;
        let polyBot = new Konva.Line({
            points: [x1, y1+height, x1+40, y1+height-43 , x1+40+width, y1+height-43, x1+width, y1+height, x1+width, y1+height],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            name: 'botSection'
        });

        this.limitation['bottom'] = polyBot.attrs.points[1];
        this.layers[this.layers.length] = polyBot;
        this.layer.add(polyBot);
        polyBot.setZIndex(1);

        polyBot.on('mouseover', ()=>{
            watchers.handleMouseOver(polyBot)
            this.layer.draw()
        })
        polyBot.on('mouseleave', ()=>{
            watchers.handleMouseLeave(polyBot)
            this.layer.draw()
        })
    },

    addShelf(section){
        section = parseInt(section);
        let x1,x2,x3,x4,shelf,attrs,oldZIndex,boxHeight,points1,points2,rightSectionIndex,
            boxCount = this.groups['group'+section]['boxGroup']['children']['length'],
            sections = {},
            y1 = this.firstPoint.y,
            height = this.height;

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
        }else if (sections.length){
            attrs = sections[section]['attrs'];
            x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0);
            x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
        }else{
            x3 = this.limitation.right + 40;
            x4 = this.limitation.right;
        }

        x1 = x1 ? x1 : this.firstPoint.x
        x2 = x2 ? x2 : this.firstPoint.x + this.bevelDegreeX

        points1 = [x1?x1:50, height/2+y1, x2?x2:90, height/2+y1-43, x3,height/2+y1-43, x4, height/2+y1, x1?x1:50, height/2+y1]
        shelf = new Konva.Line({
            points: [...points1],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'shelf'
        });

        if(!this.shelfsDefaultPositions.hasOwnProperty('shelfX1') && !this.shelfsDefaultPositions.hasOwnProperty('shelfX2')){
            this.shelfsDefaultPositions['shelfX1'] = shelf.attrs.points[4];
            this.shelfsDefaultPositions['shelfX2'] = shelf.attrs.points[6];
        }


        if(this.layer.find('.box' + section).length){
            oldZIndex = this.layer.find('.box' + section)[0].getZIndex()+1;
        }
        else if (this.layer.find('.section' + (section - 1)).length) {
            oldZIndex = this.layer.find('.section' + (section - 1))[0].getZIndex()+1;
        }else{
            oldZIndex = oldZIndex ? oldZIndex : 2;
        }
        this.groups['group'+section]['shelfGroup'].add(shelf);
        if(section>1){
            for(let key in this.stage.children[0]['children']){
                if(this.stage.children[0]['children'].hasOwnProperty(key)){
                    let child = this.stage.children[0]['children'][key];
                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs')){
                        this.layer.add(this.groups['group'+section]['shelfGroup']);
                        this.groups['group'+section]['shelfGroup'].setZIndex(oldZIndex);
                    }
                }
            }
        }else{
            this.layer.add(this.groups['group'+section]['shelfGroup']);
            this.groups['group'+section]['shelfGroup'].setZIndex(oldZIndex+1);
        }

        for(let i = boxCount; i>0; i--){
            height = height - 22 - 10;
        }
        this.shelfGroupPosition(this.groups['group'+section]['shelfGroup']['children'], section, height);

        let leftSection = this.layer.find('.leftSection')
        if(leftSection[0]['index']>this.groups['group'+section]['shelfGroup'].getZIndex()){
            this.groups['group'+section]['shelfGroup'].moveUp()
        }

        if(this.layer.find('.rightSection')){
            rightSectionIndex = this.layer.find('.rightSection')[0].getZIndex()
        }

        if(rightSectionIndex < this.groups['group'+section]['shelfGroup'].getZIndex()){
            this.groups['group'+section]['shelfGroup'].moveDown()
        }
        let currentGroup = this.groups['group'+section]
        if(currentGroup['shelfGroup']['index'] > currentGroup['sectionGroup']['index']){
            currentGroup['shelfGroup'].moveDown()
        }
        this.layer.draw();

        //methods

        shelf.on('mouseover', ()=>{
            watchers.handleMouseOver(shelf)
            this.layer.draw()
        })
        shelf.on('mouseleave', ()=>{
            watchers.handleMouseLeave(shelf)
            this.layer.draw()
        })
        shelf.on('dblclick', (e)=>{
            // e.target.remove()
            // this.shelfGroupPosition(this.groups['group'+section]['shelfGroup']['children'], section, height);
            // this.layer.draw()
            //let removeShelfTrigger = document.querySelector('.removeShelf')
            //watchers.simulateClick(removeShelfTrigger)
            //this.removeShelves(e.target, this.groups['group'+section]['shelfGroup']['children'], section, height)
        })
    },

    shelfGroupPosition(children, section = '', height = this.height, isConsole = false){
        if(children){
            let count = children.length,
                interval = (height - 40)/count,
                i=1

            for(let y = children.length; y >= 0; y--){
                if(children.hasOwnProperty(y) && children[y].hasOwnProperty('attrs')){
                    let attrs = children[y]['attrs'],
                        oldY = 0;
                    if(attrs.hasOwnProperty('y')){
                        oldY = attrs['y'];
                    }
                    if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                        attrs.points[1] = interval*i + 90 - interval/2 - oldY;
                        attrs.points[3] = interval*i - 43 + 90 - interval/2 - oldY;
                        attrs.points[5] = interval*i - 43 + 90 - interval/2 - oldY;
                        attrs.points[7] = interval*i + 90 - interval/2 - oldY;
                        attrs.points[9] = interval*i + 90 - interval/2 - oldY;
                        i++;
                        attrs.dragBoundFunc = (pos) => {
                            let minY = this.limitation.top;
                            let maxY = minY+height;
                            let newY;
                            let isFirst = !children.hasOwnProperty(y+1);
                            let isLast = !children.hasOwnProperty(y-1);
                            let newChildren

                            if(isConsole){
                                newChildren = this.layer.find('.'+isConsole)[0]['children']
                            }else{
                                newChildren = this.layer.find('.shelves'+section)[0]['children']
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

                            if(children.hasOwnProperty(y)){
                                children[y]['changedY'] = e.target.attrs.y;
                                this.layer.draw();
                            }
                        });

                    }
                }
            }
        }

    },

    addCrossBar(section, crossBarheight = 6){
        section = parseInt(section);
        if(section == 1){
            this.layer.add(this.groups['group1']['crossBarGroup']);
        }
        let x1,x2,x4,crossBarLine,attrs,oldZIndex,linePoints,
            sections = {},
            crossBarX1 = this.firstPoint.x +20,
            crossBarY1 = this.firstPoint.y + 40;
        for(let i = 1; i<this.groups.count; i++){
            sections[i] = this.groups['group'+i]['sectionGroup']['children'][0];
            sections['length'] = i;
        }
        if(sections.length > 0 && section > 1){
            attrs = sections[section-1]['attrs'];
            x1 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0) + 20;
            x2 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0) - 20;
            if(sections.hasOwnProperty(section)){
                attrs = sections[section]['attrs'];
                x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0) - 20;
            }else{
                x4 = this.limitation['right'];
            }
        }else if (sections.length){
            attrs = sections[section]['attrs'];
            x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0);
        }else{
            x4 = this.limitation.right;
        }

        crossBarLine = new Konva.Line({
            points: [
                x1?x1:crossBarX1, //50
                crossBarY1,//225
                x2?x2:crossBarX1,
                crossBarY1-crossBarheight,
                x4+20,
                crossBarY1-+crossBarheight,
                x4+20,
                crossBarY1,
                x1?x1:crossBarX1,
                crossBarY1
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            lineJoin: 'round',
            name: 'crossBarLine'
        });

        if(this.layer.find('.section' + (section - 1)).length){
            oldZIndex = this.layer.find('.section' + (section - 1))[0].getZIndex()+1
        }
        else if (this.layer.find('.shelves' + (section)).length) {
            oldZIndex = this.layer.find('.shelves' + (section))[0].getZIndex()
        }
        else if(this.layer.find('.section' + (section)).length){
            oldZIndex = this.layer.find('.section' + (section))[0].getZIndex();
        }
        else if (this.layer.find('.rightSection')){
            oldZIndex = this.layer.find('.rightSection')[0].getZIndex();
        }
        else{
            oldZIndex = oldZIndex <= 2 ? 2 : oldZIndex;
        }

        linePoints = crossBarLine.attrs;
        let crossBar = new Konva.Group({
            x: 0,
            y: 0-(crossBarheight+10),
            name: 'crossBar' + (this.groups['group'+section]['crossBarGroup']['length']?this.groups['group'+section]['crossBarGroup']['length']+1:1),
            draggable: true,
            dragBoundFunc: (pos) => {
                let newY;
                if(pos.y < (linePoints.points[3] - this.limitation.top - 20)*-1){
                    newY = (linePoints.points[3] - this.limitation.top - 20)*-1
                }else if(pos.y > (this.limitation.bottom - linePoints.points[1] - 20)){
                    newY = (this.limitation.bottom - linePoints.points[1] - 20)
                }else{
                    newY = pos.y
                }
                return{
                    y:newY,
                    x:0
                }
            }
        });

        crossBarLine.on('mouseover', ()=>{
            crossBarLine.fill('rgba(225,225,225, 0.5)')
            this.layer.draw()
        })
        crossBarLine.on('mouseleave', ()=>{
            crossBarLine.fill('white')
            this.layer.draw()
        })


        crossBar.add(crossBarLine)
        this.groups['group'+section]['crossBarGroup'].add(crossBar)
        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key]
                if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name != 'crossBar'+section){
                    this.layer.add(this.groups['group'+section]['crossBarGroup'])
                    this.groups['group'+section]['crossBarGroup'].setZIndex(oldZIndex <= 2? 2 : oldZIndex)
                }else{
                    this.layer.add(this.groups['group'+section]['crossBarGroup'])
                    this.groups['group'+section]['crossBarGroup'].setZIndex(oldZIndex <= 2? 2 : oldZIndex)
                }
            }
        }
        let currentGroup = this.groups['group'+section]
        if(currentGroup['crossBarGroup']['index'] > (currentGroup['sectionGroup']['index'] || this.layer.find('.rightSection')[0]['index'])){
            currentGroup['crossBarGroup'].moveDown()
        }

        this.layer.draw()
    },

    addBox(section, boxHeight = 22, handleHeight = 4, handleWidth = 30){
        if(section == 1){
            this.layer.add(this.groups['group1']['boxGroup']);
        }
        section = parseInt(section);
        let x1,x2,x3,x4,boxBottom,boxFront,boxLeft,boxRight,boxBack,boxHandle,attrs,oldZIndex,rightSectionIndex,
            boxCount = this.groups['group'+section]['boxGroup']['children']['length'],
            height = this.height,
            sections = {},
            boxX1 = this.firstPoint.x,
            boxY1 = this.firstPoint.y + this.height - 20;
        for(let i = 1; i<this.groups.count; i++){
            sections[i] = this.groups['group'+i]['sectionGroup']['children'][0]
            sections['length'] = i
        }
        if(sections.length > 0 && section > 1){
            attrs = sections[section-1]['attrs']
            x1 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0)
            x2 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0)
            if(sections.hasOwnProperty(section)){
                attrs = sections[section]['attrs']
                x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0)
                x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0)
            }else{
                x3 = this.limitation['right']+40
                x4 = this.limitation['right']
            }
        }else if (sections.length){
            attrs = sections[section]['attrs']
            x3 = attrs['points'][2] + (attrs['x'] ? attrs['x'] : 0)
            x4 = attrs['points'][0] + (attrs['x'] ? attrs['x'] : 0)
        }else{
            x3 = this.limitation.right + 40
            x4 = this.limitation.right
        }

        boxBottom = new Konva.Line({
            points: [
                x1?x1:boxX1, //50
                boxY1,//225
                x2?x2:boxX1+40,
                boxY1-43,
                x3,
                boxY1-43,
                x4,
                boxY1,
                x1?x1:boxX1,
                boxY1
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: 'boxBottom'
        });

        boxFront = new Konva.Line({
            points: [
                x1?x1:boxX1,
                boxY1,
                x1?x1:boxX1,
                boxY1-boxHeight,
                x4,
                boxY1-boxHeight,
                x4,
                boxY1,
                x1?x1:boxX1,
                boxY1
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: 'boxFront'
        });

        // boxHandle = new Konva.Line({
        //     points: [
        //         x1?x1:boxX1+(x4 - (x1?x1:boxX1))/2 - handleWidth/2,
        //         boxY1-boxHeight + boxHeight/2 + handleHeight/2,
        //         x1?x1:boxX1+(x4 - (x1?x1:boxX1))/2 - handleWidth/2,
        //         boxY1-boxHeight + boxHeight/2 - handleHeight/2,
        //         x1?x1:boxX1+(x4 - (x1?x1:boxX1))/2 + handleWidth/2,
        //         boxY1-boxHeight + boxHeight/2 - handleHeight/2,
        //         x1?x1:boxX1+(x4 - (x1?x1:boxX1))/2 + handleWidth/2,
        //         boxY1-boxHeight + boxHeight/2 + handleHeight/2,
        //         x1?x1:boxX1+(x4 - (x1?x1:boxX1))/2 - handleWidth/2,
        //         boxY1-boxHeight + boxHeight/2 + handleHeight/2
        //     ],
        //     fill: 'white',
        //     stroke: 'black',
        //     strokeWidth: 1,
        //     closed : true,
        //     draggable: false,
        //     name: 'boxHandle'
        // });


        boxBack = new Konva.Line({
            points: [
                x2?x2:boxX1+40,
                boxY1-43,
                x2?x2:boxX1+40,
                boxY1-boxHeight-43,
                x3,
                boxY1-boxHeight-43,
                x3,
                boxY1-43,
                x2?x2:boxX1+40,
                boxY1-43
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: 'boxBack'
        });

        boxLeft = new Konva.Line({
            points: [
                x1?x1:boxX1,
                boxY1,
                x1?x1:boxX1,
                boxY1-boxHeight,
                x2?x2:boxX1+40,
                boxY1-boxHeight-43,
                x2?x2:boxX1+40,
                boxY1-43,
                x1?x1:boxX1,
                boxY1
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: 'boxLeft'
        });

        boxRight = new Konva.Line({
            points: [
                x4,
                boxY1,
                x4,
                boxY1-boxHeight,
                x3,
                boxY1-boxHeight-43,
                x3,
                boxY1-43,
                x4,
                boxY1
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: 'boxRight'
        });

        if(this.layer.find('.section' + (section - 1)).length){
            oldZIndex = this.layer.find('.section' + (section - 1))[0].getZIndex()+1
        }
        else if (this.layer.find('.shelves' + (section)).length) {
            oldZIndex = this.layer.find('.shelves' + (section))[0].getZIndex()
        }
        else if(this.layer.find('.section' + (section)).length){
            oldZIndex = this.layer.find('.section' + (section))[0].getZIndex()
        }
        else if (this.layer.find('.rightSection')){
            oldZIndex = this.layer.find('.rightSection')[0].getZIndex()
        }
        else{
            oldZIndex = oldZIndex <= 2 ? 2 : oldZIndex
        }

        let box = new Konva.Group({
            x: 0,
            y: 0-(boxHeight+10)*boxCount,
            name: 'box' + (this.groups['group'+section]['boxGroup']['length']?this.groups['group'+section]['boxGroup']['length']+1:1),
            draggable: false
        })

        box.add(boxBottom,boxBack, boxLeft,boxRight,boxFront)
        this.groups['group'+section]['boxGroup'].add(box)
        boxCount = this.groups['group'+section]['boxGroup']['children']['length']
        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key]
                if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name != 'box'+section){
                    this.layer.add(this.groups['group'+section]['boxGroup'])
                    this.groups['group'+section]['boxGroup'].setZIndex(oldZIndex <= 2? 2 : oldZIndex)
                }else{
                    this.layer.add(this.groups['group'+section]['boxGroup'])
                    this.groups['group'+section]['boxGroup'].setZIndex(oldZIndex <= 2? 2 : oldZIndex)
                }
            }
        }
        if(this.layer.find('.rightSection')){
            rightSectionIndex = this.layer.find('.rightSection')[0].getZIndex()
        }
        if(rightSectionIndex < this.groups['group'+section]['boxGroup'].getZIndex()){
            this.groups['group'+section]['boxGroup'].moveDown()
        }
        for(let i = boxCount; i>0; i--){
            height = height - 22 - 10;
        }

        this.shelfGroupPosition(this.groups['group'+section]['shelfGroup']['children'], section, height)
        let currentGroup = this.groups['group'+(section)]
        if(currentGroup['boxGroup']['index'] > currentGroup['sectionGroup']['index']){
            currentGroup['boxGroup'].moveDown()
        }
        if(currentGroup['boxGroup']['index'] > currentGroup['shelfGroup']['index']){
            currentGroup['boxGroup'].moveDown()
        }
        this.layer.draw();
    },

    addSection(section){
        this.createGroup(1,true)
        let x1 = this.firstPoint.x,
            y1 = this.firstPoint.y,
            width = this.width,
            height = this.height,
            polySection = new Konva.Line({
                points: [width/2 + x1, y1, width/2 + x1+40, y1-43, width/2 + x1+40, y1+height-43, width/2 + x1, y1+height, width/2 + x1, y1],
                fill: 'white',
                stroke: this.strokeColor,
                strokeWidth: 1,
                closed : true,
                draggable: true,
                name: 'section1'
            }),
            oldZIndex,maxZIndex

        if(!this.groups['group'+(this.groups.count-1)].hasOwnProperty('sectionGroup')){
            let sectionGroup = new Konva.Group({
                x: 0,
                y: 0,
                height: this.height,
                name: 'section' + (this.groups.count + 1)
            })
            this.groups['group'+(this.groups.count-1)]['sectionGroup'] = sectionGroup
        }

        this.groups['group'+(this.groups.count-1)]['sectionGroup'].add(polySection)

        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key]
                if( child.hasOwnProperty('attrs') && child.attrs.name == 'rightSection'){
                    maxZIndex = child.getZIndex()
                }
                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'shelves' + (section - 1)) {
                    oldZIndex = child.getZIndex()+1
                }
                else if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'box' + (section - 1)){
                    oldZIndex = child.getZIndex()+1
                }
                else if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name == 'section' + (section - 2)){
                    oldZIndex = child.getZIndex()
                }
                else{
                    oldZIndex = oldZIndex ? oldZIndex : 2
                }
            }
        }

        oldZIndex = oldZIndex >= maxZIndex ? maxZIndex-1 : oldZIndex

        for(let key in this.stage.children[0]['children']){
            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                let child = this.stage.children[0]['children'][key]
                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && child.hasOwnProperty('attrs') && child.attrs.name != 'section' + (section - 1)) {
                    this.layer.add(this.groups['group' + (section - 1)]['sectionGroup'])
                    this.groups['group' + (section - 1)]['sectionGroup'].setZIndex(oldZIndex+1)
                    break
                }
                else{
                    this.layer.add(this.groups['group' + (section - 1)]['sectionGroup'])
                    this.groups['group' + (section - 1)]['sectionGroup'].setZIndex(2)
                }
            }
        }


        if(this.layer.find('.crossBar'+ (section-1).length) && this.layer.find('.crossBar' + (section-1)).hasOwnProperty(0)){
            while(this.layer.find('.crossBar' + (section-1))[0]['index'] > this.groups['group' + (section - 1)]['sectionGroup'].getZIndex()){
                this.groups['group'+(section-1)]['crossBarGroup'].moveDown()
            }
        }



        this.sectionGroupPosition(this.getSectionsCount())

        let leftSection = this.layer.find('.leftSection')
        if(leftSection[0]['index']>this.groups['group' + (section - 1)]['sectionGroup'].getZIndex()){
            this.groups['group' + (section - 1)]['sectionGroup'].moveUp()
        }
        this.layer.draw()


        //methods
        polySection.on('mouseover', ()=>{
            watchers.handleMouseOver(polySection)
            this.layer.draw()
        })
        polySection.on('mouseleave', ()=>{
            watchers.handleMouseLeave(polySection)
            this.layer.draw()
        })

        polySection.on('dblclick', (e)=>{
            let index = this.groups.count,
                minusButton = document.body.querySelector('.amount-wrap.sections button.minus')
            watchers.simulateClick(minusButton)
        })

        this.createButton(section)
    },
    getSectionsCount(){
        let sections = {};
        for(let i = 1; i<this.groups.count; i++){
            if(sections[i] = this.groups['group'+i].hasOwnProperty('sectionGroup')){
                sections[i] = this.groups['group'+i]['sectionGroup']['children'][0]
                sections['length'] = i
            }
        }
        return sections
    },
    sectionGroupPosition(children){
        if(children.length){
            let count = children.length,
                interval = (this.width - 40)/count,
                i=1,
                isLast = false
            for(let y = 0; y <= children.length; y++){
                if(y==children.length){
                    isLast = true
                }
                if(children.hasOwnProperty(y) && children[y].hasOwnProperty('attrs')){
                    let attrs = children[y]['attrs'],
                        oldX = 0
                    if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'section1'){
                        if(attrs.hasOwnProperty('x')){
                            oldX = attrs['x']
                        }
                        attrs.points[0] = (interval*i + 90 - interval/2) - oldX
                        attrs.points[2] = (interval*i + 40 + 90 - interval/2) - oldX
                        attrs.points[4] = (interval*i + 40 + 90 - interval/2) - oldX
                        attrs.points[6] = (interval*i + 90 - interval/2) - oldX
                        attrs.points[8] = (interval*i + 90 - interval/2) - oldX
                        i++

                        if(this.layer.find('.shelves'+y).length && this.layer.find('.shelves'+y).hasOwnProperty(0)){
                            let childs = this.layer.find('.shelves'+y)[0]['children']
                            for(let i=0; i<childs.length; i++){
                                let child = childs[i],
                                    points = child['attrs']['points']
                                points[4] = attrs.points[2] + oldX
                                points[6] = attrs.points[0] + oldX
                            }
                        }

                        if(this.layer.find('.shelves'+(y+1)).length && this.layer.find('.shelves'+(y+1)).hasOwnProperty(0)){
                            let childs = this.layer.find('.shelves'+(y+1))[0]['children']
                            for(let i=0; i<childs.length; i++){
                                let child = childs[i],
                                    points = child['attrs']['points']
                                points[2] = attrs.points[2] + oldX
                                points[0] = points[8] = attrs.points[0] + oldX
                                if(isLast){
                                    points[4] = this.limitation.right+40
                                    points[6] = this.limitation.right
                                }
                            }
                        }

                        for(let key in this.stage.children[0]['children']){
                            if(this.stage.children[0]['children'].hasOwnProperty(key)){
                                let child = this.stage.children[0]['children'][key]
                                if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && (child.attrs.name == 'box'+y || child.attrs.name == 'box'+(y+1))){
                                    let boxGroup = child
                                    if(boxGroup && boxGroup.hasOwnProperty('children')){
                                        let children = boxGroup['children']
                                        for(let key in children){
                                            if(children.hasOwnProperty(key) && children[key].hasOwnProperty('children')){
                                                let childin = children[key]['children']
                                                for(let key in childin){
                                                    if(childin.hasOwnProperty(key) && childin[key].hasOwnProperty('attrs')){
                                                        let boxAttrs = childin[key]['attrs']
                                                        if(child.attrs.name == 'box'+y){
                                                            if(boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxFront'){
                                                                boxAttrs['points'][4] = boxAttrs['points'][6] = attrs.points[0] + oldX
                                                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxRight'){
                                                                boxAttrs['points'][0] = boxAttrs['points'][2] = boxAttrs['points'][8] = attrs.points[0] + oldX
                                                                boxAttrs['points'][4] = boxAttrs['points'][6] = attrs.points[2] + oldX
                                                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBottom'){
                                                                boxAttrs['points'][4] = attrs.points[2] + oldX
                                                                boxAttrs['points'][6] = attrs.points[0] + oldX
                                                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBack'){
                                                                boxAttrs['points'][4] = boxAttrs['points'][6] = attrs.points[2] + oldX
                                                            }
                                                        }
                                                        else{
                                                            if(boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxFront'){
                                                                boxAttrs['points'][2] = attrs.points[0] + oldX
                                                                boxAttrs['points'][0] = boxAttrs['points'][8] = attrs.points[0] + oldX
                                                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxLeft'){
                                                                boxAttrs['points'][0] = boxAttrs['points'][2] = boxAttrs['points'][8] = attrs.points[0] + oldX
                                                                boxAttrs['points'][4] = boxAttrs['points'][6] = attrs.points[2] + oldX
                                                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBottom'){
                                                                boxAttrs['points'][2] = attrs.points[2] + oldX
                                                                boxAttrs['points'][0] = boxAttrs['points'][8] = attrs.points[0] + oldX
                                                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBack'){
                                                                boxAttrs['points'][2] = attrs.points[2]  + oldX
                                                                boxAttrs['points'][0] = boxAttrs['points'][8] = attrs.points[2] + oldX
                                                            }
                                                            if(isLast){
                                                                if(boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxFront'){
                                                                    boxAttrs['points'][4] = boxAttrs['points'][6] = this.limitation.right
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxRight'){
                                                                    boxAttrs['points'][0] = boxAttrs['points'][2] = boxAttrs['points'][8] = this.limitation.right
                                                                    boxAttrs['points'][4] = boxAttrs['points'][6] = this.limitation.right+40
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBottom'){
                                                                    boxAttrs['points'][4] = this.limitation.right+40
                                                                    boxAttrs['points'][6] = this.limitation.right
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBack'){
                                                                    boxAttrs['points'][4] = boxAttrs['points'][6] = this.limitation.right+40
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && (child.attrs.name == 'crossBar'+(y) || child.attrs.name == 'crossBar'+(y+1))){
                                    let crossBarGroup = child
                                    if(crossBarGroup && crossBarGroup.hasOwnProperty('children')){
                                        let children = crossBarGroup['children']
                                        for(let key in children){
                                            if(children.hasOwnProperty(key) && children[key].hasOwnProperty('children')){
                                                let crossBarAttrs = children[key]['children'][0]['attrs']
                                                if(crossBarAttrs && crossBarAttrs.hasOwnProperty('name')){
                                                    if(child.attrs.name == 'crossBar'+(y)){
                                                        crossBarAttrs.points[4] = attrs.points[2] + oldX - 20
                                                        crossBarAttrs.points[6] = attrs.points[0] + oldX + 20
                                                    }else{
                                                        crossBarAttrs.points[2] = attrs.points[2] + oldX - 20
                                                        crossBarAttrs.points[0] = crossBarAttrs.points[8] = attrs.points[0] + oldX + 20
                                                        if(isLast){
                                                            crossBarAttrs.points[4] = crossBarAttrs.points[6] = this.limitation.right + 20
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        attrs.dragBoundFunc = (pos) => {
                            let minX = this.limitation.left
                            let maxX = this.limitation.right,
                                newX,
                                isFirst = !children.hasOwnProperty(y-1),
                                isLast = !children.hasOwnProperty(y+1),
                                newChildren = children,
                                nextSectionPoints = !isLast ?  newChildren[y+1]['attrs']['points'] : null,
                                prevSectionPoints = !isFirst ? newChildren[y-1]['attrs']['points'] : null,
                                nextChangedX = !isLast ? newChildren[y+1]['changedX'] : 0,
                                prevChangedX = !isFirst ? newChildren[y-1]['changedX'] : 0

                            if(children.length == 1){
                                if(pos.x < (maxX-minX)/2*(-1)+20){
                                    newX = (maxX-minX)/2*(-1)+20
                                }else if (pos.x > (maxX-minX)/2 - 20 ){
                                    newX = (maxX-minX)/2 - 20
                                }else{
                                    newX = pos.x
                                }
                            }else{
                                if(isFirst){
                                    if(pos.x < (attrs.points[0] - minX - 20)*-1){
                                        newX = (attrs.points[0] - minX - 20)*-1
                                    }else if (pos.x > (nextSectionPoints[0] - attrs.points[0] - 20 + (nextChangedX ? nextChangedX : 0))){
                                        newX = (nextSectionPoints[0] - attrs.points[0] - 20 + (nextChangedX ? nextChangedX : 0))
                                    }else{
                                        newX = pos.x
                                    }
                                }else if (isLast){
                                    if(pos.x < ((attrs.points[0] - prevSectionPoints[0] - 20 - (prevChangedX ? prevChangedX : 0)) *-1)){
                                        newX = (attrs.points[0] - prevSectionPoints[0] - 20 - (prevChangedX ? prevChangedX : 0))*-1
                                    }else if (pos.x > (maxX-attrs.points[0]) - 20 ){
                                        newX = (maxX-attrs.points[0]) - 20
                                    }else{
                                        newX = pos.x
                                    }
                                }else{
                                    if(pos.x < (attrs.points[0] - prevSectionPoints[0] - 20 - (prevChangedX ? prevChangedX : 0))*-1){
                                        newX = (attrs.points[0] - prevSectionPoints[0] - 20 - (prevChangedX ? prevChangedX : 0))*-1
                                    }else if (pos.x > (nextSectionPoints[0] - attrs.points[0] - 20 + (nextChangedX ? nextChangedX : 0)) ){
                                        newX = (nextSectionPoints[0] - attrs.points[0] - 20 + (nextChangedX ? nextChangedX : 0))
                                    }else{
                                        newX = pos.x
                                    }
                                }
                            }

                            for(let key in this.stage.children[0]['children']){
                                if(this.stage.children[0]['children'].hasOwnProperty(key)){
                                    let child = this.stage.children[0]['children'][key];
                                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && (child.attrs.name == 'shelves'+(y) || child.attrs.name == 'shelves'+(y+1))){
                                        let shelfGroup = child
                                        if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                            let children = shelfGroup['children']
                                            for(let key in children){
                                                if(children.hasOwnProperty(key) && children[key].hasOwnProperty('attrs')){
                                                    let shelfAttrs = children[key]['attrs']
                                                    if(shelfAttrs && shelfAttrs.hasOwnProperty('name') && shelfAttrs.name == 'shelf'){
                                                        if(child.attrs.name == 'shelves'+(y)){
                                                            shelfAttrs.points[4] = attrs.points[2] + newX
                                                            shelfAttrs.points[6] = attrs.points[0] + newX
                                                        }
                                                        else{
                                                            shelfAttrs.points[2] = attrs.points[2] + newX
                                                            shelfAttrs.points[0] = shelfAttrs.points[8] = attrs.points[0] + newX
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && (child.attrs.name == 'box'+y || child.attrs.name == 'box'+(y+1))){
                                        let boxGroup = child;
                                        if(boxGroup && boxGroup.hasOwnProperty('children')){
                                            let children = boxGroup['children']
                                            for(let key in children){
                                                if(children.hasOwnProperty(key) && children[key].hasOwnProperty('children')){
                                                    let childIn = children[key]['children']
                                                    for(let key in childIn){
                                                        if(childIn.hasOwnProperty(key) && childIn[key].hasOwnProperty('attrs')){
                                                            let boxAttrs = childIn[key]['attrs']
                                                            if(child.attrs.name == 'box'+y){
                                                                if(boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxFront'){
                                                                    boxAttrs['points'][4] = attrs.points[0] + newX
                                                                    boxAttrs['points'][6] = attrs.points[0] + newX
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxRight'){
                                                                    boxAttrs['points'][0] = boxAttrs['points'][2] = boxAttrs['points'][8] = attrs.points[0] + newX;
                                                                    boxAttrs['points'][4] = boxAttrs['points'][6] = attrs.points[2] + newX;
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBottom'){
                                                                    boxAttrs['points'][4] = attrs.points[2] + newX
                                                                    boxAttrs['points'][6] = attrs.points[0] + newX
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBack'){
                                                                    boxAttrs['points'][4] = attrs.points[2] + newX
                                                                    boxAttrs['points'][6] = attrs.points[2] + newX
                                                                }
                                                            }
                                                            else{
                                                                if(boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxFront'){
                                                                    boxAttrs['points'][2] = attrs.points[0] + newX
                                                                    boxAttrs['points'][0] = boxAttrs['points'][8] = attrs.points[0] + newX
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxLeft'){
                                                                    boxAttrs['points'][0] = boxAttrs['points'][2] = boxAttrs['points'][8] = attrs.points[0] + newX
                                                                    boxAttrs['points'][4] = boxAttrs['points'][6] = attrs.points[2] + newX
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBottom'){
                                                                    boxAttrs['points'][2] = attrs.points[2] + newX
                                                                    boxAttrs['points'][0] = boxAttrs['points'][8] = attrs.points[0] + newX
                                                                }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBack'){
                                                                    boxAttrs['points'][2] = attrs.points[2] + newX
                                                                    boxAttrs['points'][0] = boxAttrs['points'][8] = attrs.points[2] + newX
                                                                }
                                                            }

                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group' && (child.attrs.name == 'crossBar'+(y) || child.attrs.name == 'crossBar'+(y+1))){
                                        let crossBarGroup = child;
                                        if(crossBarGroup && crossBarGroup.hasOwnProperty('children')){
                                            let children = crossBarGroup['children']
                                            for(let key in children){
                                                if(children.hasOwnProperty(key) && children[key].hasOwnProperty('children')){
                                                    let crossBarAttrs = children[key]['children'][0]['attrs']
                                                    if(crossBarAttrs && crossBarAttrs.hasOwnProperty('name')){
                                                        if(child.attrs.name == 'crossBar'+(y)){
                                                            crossBarAttrs.points[4] = attrs.points[2] + newX - 20
                                                            crossBarAttrs.points[6] = attrs.points[0] + newX + 20
                                                        }else{
                                                            crossBarAttrs.points[2] = attrs.points[2] + newX - 20
                                                            crossBarAttrs.points[0] = crossBarAttrs.points[8] = attrs.points[0] + newX + 20
                                                        }
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
                            let pos = this.stage.getPointerPosition()
                            let shape = this.layer.getIntersection(pos)

                            children[y]['changedX'] = e.target.attrs.x
                            this.layer.draw()
                        });
                    }
                }
            }
        }else{
            if(this.layer.find('.shelves1').length && this.layer.find('.shelves1').hasOwnProperty(0)){
                let childs = this.layer.find('.shelves1')[0]['children']
                for(let i=0; i<childs.length; i++){
                    let child = childs[i],
                        points = child['attrs']['points']

                    points[4] = this.limitation.right+40
                    points[6] = this.limitation.right

                }
            }

            if(this.layer.find('.box1').length && this.layer.find('.box1').hasOwnProperty(0)){
                let boxGroup = this.layer.find('.box1')[0]
                let children = boxGroup.getChildren()
                for(let i=0; i<children.length; i++){
                    let childin = children[i]['children']

                    for(let key in childin){
                        if(childin.hasOwnProperty(key) && childin[key].hasOwnProperty('attrs')){
                            let boxAttrs = childin[key]['attrs']
                            if(boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxFront'){
                                boxAttrs['points'][4] = this.limitation.right
                                boxAttrs['points'][6] = this.limitation.right
                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxRight'){
                                boxAttrs['points'][0] = boxAttrs['points'][2] = boxAttrs['points'][8] = this.limitation.right
                                boxAttrs['points'][4] = boxAttrs['points'][6] = this.limitation.right+40
                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBottom'){
                                boxAttrs['points'][4] = this.limitation.right+40
                                boxAttrs['points'][6] = this.limitation.right
                            }else if (boxAttrs.hasOwnProperty('name') && boxAttrs['name'] == 'boxBack'){
                                boxAttrs['points'][4] = this.limitation.right+40
                                boxAttrs['points'][6] = this.limitation.right+40
                            }
                        }
                    }
                }

            }

            if(this.layer.find('.crossBar1').length && this.layer.find('.box1').hasOwnProperty(0)){
                let boxGroup = this.layer.find('.crossBar1')[0]
                let children = boxGroup.getChildren()
                for(let i=0; i<children.length; i++){
                    let childin = children[i]['children']

                    for(let key in childin){
                        if(childin.hasOwnProperty(key) && childin[key].hasOwnProperty('attrs')){
                            let crossBarAttrs = childin[key]['attrs']
                            if(crossBarAttrs && crossBarAttrs.hasOwnProperty('name')){
                                crossBarAttrs.points[4] = this.limitation.right + 20
                                crossBarAttrs.points[6] = this.limitation.right + 20
                            }
                        }
                    }
                }
            }
        }
    },
    showDoors(count = 3){
        let doorWidth = 126,
            doorCount,
            doorRealWidth,
            width = this.width,
            height = this.height,
            x1 = this.limitation.left,
            y1 = this.limitation.bottom;
        doorCount = count
        doorRealWidth = width/doorCount

        for(let i=0; i<doorCount; i++){
            let door = new Konva.Line({
                points: [x1+doorRealWidth*i, y1, x1+doorRealWidth*i, y1-height, x1+doorRealWidth*i + doorRealWidth, y1-height, x1+doorRealWidth*i + doorRealWidth, y1, x1+doorRealWidth*i, y1],
                fill: 'white',
                stroke: this.strokeColor,
                strokeWidth: 1,
                closed : true,
                draggable: true,
                name: `door${i+1}`,
                dragBoundFunc: (pos) =>{
                    let isFirst, isLast,newX,
                        doors = this.groups['doorsGroup']['children'],
                        points = door['attrs']['points'];

                    if(!doors.hasOwnProperty(i-1) && doors.hasOwnProperty(i+1)){
                        isFirst = true
                    }
                    else if (doors.hasOwnProperty(i-1) && !doors.hasOwnProperty(i+1)){
                        isLast = true
                    }

                    if(isFirst){
                        if(pos.x<0){
                            newX = 0
                        }else if (pos.x > doorRealWidth-5){
                            newX = doorRealWidth-5
                        }else{
                            newX = pos.x
                        }
                    }else if(isLast){
                        if(pos.x<-doorRealWidth+5){
                            newX = -doorRealWidth+5
                        }else if (pos.x > 0){
                            newX = 0
                        }else{
                            newX = pos.x
                        }
                    }else{
                        if(points[0]+pos.x<points[0]-doorRealWidth){
                            newX = -doorRealWidth+5
                        }else if (points[0]+pos.x > points[0]+doorRealWidth){
                            newX = doorRealWidth-5
                        }else{
                            newX = pos.x
                        }
                    }
                    return{
                        y: 0,
                        x: newX
                    }
                }
            });
            this.groups['doorsGroup'].add(door)
        }
        this.groups['doorsGroup'].moveToTop()
        this.groups['doorsGroup'].show()
        this.layer.draw()
    },

    hideDoors(){
        this.groups['doorsGroup'].removeChildren()
        this.layer.draw()
    },

    showRightSideConsole(consoleWidth = 60, removeButtons = true){
        if(this.groups['rightConsoleGroup']['children']['length']){
            this.groups['rightConsoleGroup'].show()
            this.layer.draw()
            let consoleElement = this.layer.find('.rightConsoleShelves')
            watchers.createConsoleButton(consoleElement, this.width, this.height, this.limitation,'right')
            return
        }
        let height = this.height,
            x1 = this.limitation.right,
            y1 = this.limitation.top,
            bevelX = this.bevelDegreeX,
            bevelY = this.bevelDegreeY

        let consoleTop = new Konva.Line({
            points: [
                ...[x1, y1],
                ...[x1+bevelX, y1-bevelY],
                ...[x1+bevelX+consoleWidth,y1-bevelY],
                ...[x1+consoleWidth,y1],
                ...[x1, y1],
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: `consoleTop`
        })

        let consoleBot = new Konva.Line({
            points: [
                ...[x1, y1+height],
                ...[x1+bevelX, y1-bevelY+height],
                ...[x1+bevelX+consoleWidth,y1-bevelY+height],
                ...[x1+consoleWidth,y1+height],
                ...[x1, y1+height],
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: `consoleBot`
        })

        let consoleBack = new Konva.Line({
            points: [
                ...[x1+bevelX, y1-bevelY],
                ...[x1+bevelX+consoleWidth,y1-bevelY],
                ...[x1+bevelX+consoleWidth,y1-bevelY+height],
                ...[x1+bevelX, y1-bevelY+height],
                ...[x1+bevelX, y1-bevelY],
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: `consoleBack`
        })

        this.groups['rightConsoleGroup'].add(consoleBack,consoleBot ,consoleTop)
        this.groups['rightConsoleGroup'].moveToTop()
        this.groups['rightConsoleGroup'].show()
        this.layer.draw()

        let consoleElement = this.layer.find('.rightConsoleShelves')
        watchers.createConsoleButton(consoleElement, this.width, this.height, this.limitation,'right', removeButtons)
    },

    addRightConsoleShelf(consoleWidth = 60){
        let height = this.height,
            x1 = this.limitation.right,
            y1 = this.limitation.top + height/2,
            bevelX = this.bevelDegreeX,
            bevelY = this.bevelDegreeY,
            points1,
            shelf

        points1 = [
            x1, y1,
            x1+bevelX, y1-bevelY,
            x1+bevelX+consoleWidth,y1-bevelY,
            x1+consoleWidth,y1,
            x1,y1
        ]
        shelf = new Konva.Line({
            points: [...points1],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'shelf'
        })

        if(this.layer.find('.rightConsoleGroup').length){
            if(!this.layer.find('.rightConsoleShelves').length){
                let rightConsoleShelf = new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'rightConsoleShelves'
                })
                this.groups['rightConsoleGroup'].add(rightConsoleShelf)
            }
            let consoleElement = this.layer.find('.rightConsoleShelves')

            consoleElement.add(shelf)
            consoleElement.moveToTop()
            consoleElement.moveDown()
            this.shelfGroupPosition(consoleElement[0]['children'], '', height, 'rightConsoleShelves')
            this.layer.draw()
        }


        //methods

        shelf.on('mouseover', ()=>{
            watchers.handleMouseOver(shelf)
            this.layer.draw()
        })
        shelf.on('mouseleave', ()=>{
            watchers.handleMouseLeave(shelf)
            this.layer.draw()
        })
        // shelf.on('dblclick', (e)=>{
        //     let consoleElement = this.layer.find('.rightConsoleShelves')
        //     this.removeShelves(e.target,consoleElement[0]['children'], '', height, 'rightConsoleShelves')
        // })
    },

    hideRightSideConsole(){
        this.groups['rightConsoleGroup'].hide()
        this.layer.draw()
        watchers.hideConsoleButton('right')
    },

    showLeftSideConsole(consoleWidth = -60, removeButtons = true){

        if(this.groups['leftConsoleGroup']['children']['length']){
            this.groups['leftConsoleGroup'].show()
            this.layer.draw()
            let consoleElement = this.layer.find('.leftConsoleShelves')
            watchers.createConsoleButton(consoleElement, this.width, this.height, this.limitation,'left')
            return
        }

        let height = this.height,
            x1 = this.limitation.left,
            y1 = this.limitation.top,
            bevelX = this.bevelDegreeX,
            bevelY = this.bevelDegreeY

        let consoleTop = new Konva.Line({
            points: [
                ...[x1, y1],
                ...[x1+bevelX, y1-bevelY],
                ...[x1+bevelX+consoleWidth,y1-bevelY],
                ...[x1+consoleWidth,y1],
                ...[x1, y1],
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: `consoleTop`
        })

        let consoleBot = new Konva.Line({
            points: [
                ...[x1, y1+height],
                ...[x1+bevelX, y1-bevelY+height],
                ...[x1+bevelX+consoleWidth,y1-bevelY+height],
                ...[x1+consoleWidth,y1+height],
                ...[x1, y1+height],
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: `consoleBot`
        })

        let consoleBack = new Konva.Line({
            points: [
                ...[x1+bevelX, y1-bevelY],
                ...[x1+bevelX+consoleWidth,y1-bevelY],
                ...[x1+bevelX+consoleWidth,y1-bevelY+height],
                ...[x1+bevelX, y1-bevelY+height],
                ...[x1+bevelX, y1-bevelY],
            ],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: false,
            name: `consoleBack`
        })

        this.groups['leftConsoleGroup'].add(consoleBack,consoleBot ,consoleTop)
        this.groups['leftConsoleGroup'].moveToBottom()
        this.groups['leftConsoleGroup'].show()
        this.layer.draw()

        let consoleElement = this.layer.find('.leftConsoleShelves')
        watchers.createConsoleButton(consoleElement, this.width, this.height, this.limitation,'left', removeButtons)
    },

    addLeftConsoleShelf(consoleWidth = -60){
        let height = this.height,
            x1 = this.limitation.left,
            y1 = this.limitation.top + height/2,
            bevelX = this.bevelDegreeX,
            bevelY = this.bevelDegreeY,
            points1,
            shelf

        points1 = [
            x1, y1,
            x1+bevelX, y1-bevelY,
            x1+bevelX+consoleWidth,y1-bevelY,
            x1+consoleWidth,y1,
            x1,y1
        ]
        shelf = new Konva.Line({
            points: [...points1],
            fill: 'white',
            stroke: this.strokeColor,
            strokeWidth: 1,
            closed : true,
            draggable: true,
            name: 'shelf'
        })

        if(this.layer.find('.leftConsoleGroup').length){
            if(!this.layer.find('.leftConsoleShelves').length){
                let leftConsoleShelf = new Konva.Group({
                    x: 0,
                    y: 0,
                    height: this.height,
                    name: 'leftConsoleShelves'
                })
                this.groups['leftConsoleGroup'].add(leftConsoleShelf)
            }
            let consoleElement = this.layer.find('.leftConsoleShelves')

            consoleElement.add(shelf)
            consoleElement.moveToTop()
            consoleElement.moveDown()
            this.shelfGroupPosition(consoleElement[0]['children'], '', height, 'leftConsoleShelves');
            this.layer.draw()
        }

        //methods

        shelf.on('mouseover', ()=>{
            watchers.handleMouseOver(shelf)
            this.layer.draw()
        })
        shelf.on('mouseleave', ()=>{
            watchers.handleMouseLeave(shelf)
            this.layer.draw()
        })
        // shelf.on('dblclick', (e)=>{
        //     let consoleElement = this.layer.find('.leftConsoleShelves')
        //     this.removeShelves(e.target,consoleElement[0]['children'], '', height, 'leftConsoleShelves')
        // })
    },

    hideLeftSideConsole(){
        this.groups['leftConsoleGroup'].hide()
        this.layer.draw()
        watchers.hideConsoleButton('left')
    },

    removeShelves(target, children, section, height, name){
        target.remove()
        this.shelfGroupPosition(children, section, height, name)
        this.layer.draw()
    },

    removeLastShelve(index){
        if(!index){
            index = this.groups['count']
        }

        if(this.groups['group'+index].hasOwnProperty('shelfGroup')){
            let children = this.groups['group'+index]['shelfGroup']['children'],
                boxCount = this.groups['group'+index]['boxGroup']['children']['length'],
                height = this.height
            children[children.length-1].remove()
            for(let i = boxCount; i>0; i--){
                height = height - 22 - 10;
            }
            this.shelfGroupPosition(this.groups['group'+index]['shelfGroup']['children'], index, height, name)
            this.layer.draw()
        }
    },

    removeLastConsoleShelve(consoleType){
        let consoleElement = this.layer.find('.'+consoleType),
            children = consoleElement[0]['children'],
            height = this.height

        children[children.length-1].remove()

        this.shelfGroupPosition(consoleElement[0]['children'], '', height, consoleType)
        this.layer.draw()

    },

    removeSection(index){
        if(!index){
            index = this.groups['count']
        }
        if (index==1) return
        for(let key in this.groups['group'+index]){
            if(this.groups['group'+index].hasOwnProperty(key)){
                this.groups['group'+index][key].remove()
            }
        }
        delete this.groups['group'+index]
        let sectionGroup = this.layer.find('.section'+(index-1))[0]
        sectionGroup.removeChildren()
        this.groups['count'] -= 1
        this.sectionGroupPosition(this.getSectionsCount())
        watchers.createButtons(this.groups, this.width, this.height, this.limitation)
        this.layer.draw()
        //watchers.watchSectionsCount(this.groups['count'])
    },

    removeBox(index){
        if(!index){
            index = this.groups['count']
        }

        if(this.groups['group'+index].hasOwnProperty('boxGroup')){
            let children = this.groups['group'+index]['boxGroup']['children'],
                boxCount,
                height = this.height

            children[children.length-1].remove()
            boxCount = this.groups['group'+index]['boxGroup']['children']['length']
            for(let i = boxCount; i>0; i--){
                height = height - 22 - 10;
            }
            this.shelfGroupPosition(this.groups['group'+index]['shelfGroup']['children'], index, height, name)
            this.layer.draw()
        }
    },

    hideCrossBar(section){
        let crossBar = this.groups['group'+section]['crossBarGroup']
        crossBar.removeChildren()
        this.layer.draw()
    },

    setDoorImage(val, index, src){
        let doors = this.layer.find('.doors'),
            currentDoor = doors[0]['children'][index-1]

        if(src){
            let imageObj = new Image()
            imageObj.onload = ()=>{
                currentDoor.fillPatternImage(imageObj)
                this.layer.draw()

            }
            imageObj.src = src
            currentDoor.fill('')
        }
        else{
            currentDoor.fill('#fff')
            this.layer.draw()
        }
    },

    createButton(){
        watchers.createButtons(this.groups, this.width, this.height, this.limitation);
    },

    createLayer() {
        this.layer = new Konva.Layer();
    },
    createStage(layer) {
        let width = window.innerWidth
        let height = window.innerHeight

        this.stage = new Konva.Stage({
            container: 'app',
            width: width,
            height: height
        });
        this.stage.add(layer)
    },

    init() {
        this.createLayer()
        this.createGroup()
        this.createBotSection()
        this.createLeftSection()
        this.createRightSection()
        this.createTopSection()
        this.createStage(this.layer)
        this.createButton(1)

        window.myLayers = this.layer;
    }
};

export {furniture}