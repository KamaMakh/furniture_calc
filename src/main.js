import Vue from "vue";
import VueKonva from "vue-konva";
Vue.use(VueKonva);/*  */
Vue.config.productionTip = false;


let furniture = {
    layers: [],
    stage: {},
    layer:{},
    shelfGroup:{},
    shelfsDefaultPositions : {},
    limitation: {},
    height: 280,
    width:380,
    createLeftSection: function() {
        let polyLeft = new Konva.Line({
            points: [50, 70, 90, 27, 90, 307, 50, 350, 50, 70],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'leftSection'
        });

        this.limitation['left'] = polyLeft.attrs.points[0];
        this.layers[this.layers.length] = polyLeft;
        polyLeft.setZIndex(2);
    },
    createRightSection: function() {
        let polyRight = new Konva.Line({
            points: [440, 70, 480, 27, 480, 307, 440, 350, 440, 70],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'rightSection',
            globalCompositeOperation: 'source-over'
        });

        this.limitation['right'] = polyRight.attrs.points[0];
        this.layers[this.layers.length] = polyRight;
        polyRight.setZIndex(5);
    },

    createTopSection: function() {
        let polyTop = new Konva.Line({
            points: [50, 70, 90, 27 , 480, 27, 440, 70, 440, 70],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'topSection'
        });

        this.limitation['top'] = polyTop.attrs.points[1];
        this.layers[this.layers.length] = polyTop;
        polyTop.setZIndex(6);
    },

    createBotSection: function() {
        let polyBot = new Konva.Line({
            points: [50, 350, 90, 307 , 480, 307, 440, 350, 440, 350],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            name: 'botSection'
        });

        this.limitation['bottom'] = polyBot.attrs.points[1];
        this.layers[this.layers.length] = polyBot;
        polyBot.setZIndex(1);
    },
    createShelf: function() {
        let shelf = new Konva.Line({
            points: [50, 225, 90, 182, 285, 182, 245, 225, 50, 225],
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
        // shelf.on('dragend', (e) => {
        //     let pos = this.stage.getPointerPosition();
        //     let shape = this.layer.getIntersection(pos);
        //
        //     e.target.attrs.points[1] = e.target.attrs.points[1] + e.target.attrs.y;
        //     e.target.attrs.points[3] = e.target.attrs.points[3] + e.target.attrs.y;
        //     e.target.attrs.points[5] = e.target.attrs.points[5] + e.target.attrs.y;
        //     e.target.attrs.points[7] = e.target.attrs.points[7] + e.target.attrs.y;
        //     e.target.attrs.points[9] = e.target.attrs.points[9] + e.target.attrs.y;
        //
        //     this.layer.draw();
        // });

        this.shelfsDefaultPositions['shelfX1'] = shelf.attrs.points[4];
        this.shelfsDefaultPositions['shelfX2'] = shelf.attrs.points[6];
        this.shelfGroup = new Konva.Group({
            x: 0,
            y: 0,
            height: this.height
        });
        this.shelfGroup.add(shelf);
        this.layers[this.layers.length] = this.shelfGroup;

        this.shelfGroup.setZIndex(3);
        shelf.setZIndex(3);

    },

    addShelf: function(){
        let x3 = this.shelfsDefaultPositions['currentShelfX1'] ? this.shelfsDefaultPositions['currentShelfX1'] : 285,
            x4 = this.shelfsDefaultPositions['currentShelfX2']? this.shelfsDefaultPositions['currentShelfX2'] : 245,
            shelf = new Konva.Line({
            points: [50, 225, 90, 182, x3,182, x4, 225, 50, 225],
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

        this.shelfGroup.add(shelf);
        shelf.setZIndex(3);
        this.shelfGroupPosition(this.shelfGroup.children);
        this.layer.draw();
    },

    shelfGroupPosition(children){
        if(children){
            let count = children.length,
                interval = (this.height - 40)/count,
                i=1,
                center = [50, 225, 90, 182, 285, 182, 245, 225, 50, 225];

            for(let y = children.length; y >= 0; y--){
                if(children.hasOwnProperty(y) && children[y].hasOwnProperty('attrs')){
                    let attrs = children[y]['attrs'];
                    if(attrs && attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                        //attrs.points[0] = 50;
                        attrs.points[1] = interval*i + 90 - interval/2;
                        //attrs.points[2] = 90;
                        attrs.points[3] = interval*i - 43 + 90 - interval/2;
                        //attrs.points[4] = 285;
                        attrs.points[5] = interval*i - 43 + 90 - interval/2;
                        //attrs.points[6] = 245;
                        attrs.points[7] = interval*i + 90 - interval/2;
                        //attrs.points[8] = 50;
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
                                    if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group'){
                                        let shelfGroup = child;
                                        if(shelfGroup && shelfGroup.hasOwnProperty('children')){
                                            newChildren = shelfGroup['children'];
                                        }
                                    }

                                }
                            }

                            if(isFirst){

                                if(pos.y < (attrs.points[1] - minY - 20)*-1){
                                    newY = (attrs.points[1] - minY - 20)*-1;
                                }else if (pos.y > (newChildren[y-1]['attrs']['points'][1] - attrs.points[1] - 20 + (newChildren[y-1]['changedY'] ? newChildren[y-1]['changedY'] : 0))){
                                    newY = (newChildren[y-1]['attrs']['points'][1] - attrs.points[1] - 20 + (newChildren[y-1]['changedY'] ? newChildren[y-1]['changedY'] : 0));
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
                                    console.log(1);
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
            points: [245, 70, 285, 27, 285, 307, 245, 350, 245, 70],
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1,
            closed : true,
            draggable: true,
            zIndex: '1',
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
                        if(child.hasOwnProperty('nodeType') && child['nodeType'] == 'Group'){
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
                        }

                    }
                }
                return {
                    x: newX,
                    y: 0
                }
            }
        });

        this.layers[this.layers.length] = polySection;
        polySection.setZIndex(4);
    },
    createLayer: function(obj) {
        this.layer = new Konva.Layer();
        console.log(this.layer);

        this.layer.add(...obj);

        this.createStage(this.layer);
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
    },

    init: function() {
        this.createBotSection();
        this.createLeftSection();
        this.createShelf();
        this.createSectin();
        this.createRightSection();
        this.createTopSection();

        this.createLayer(this.layers);
    }
};


furniture.init();

let addShelf = document.querySelector('.addShelf');

addShelf.addEventListener('click', function(){
    furniture.addShelf();
});