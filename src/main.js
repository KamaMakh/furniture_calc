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
        this.shelfsDefaultPositions['shelfX1'] = shelf.attrs.points[4];
        this.shelfsDefaultPositions['shelfX2'] = shelf.attrs.points[6];
        this.shelfGroup = new Konva.Group({
            x: 0,
            y: 0
        });
        this.shelfGroup.add(shelf);
        this.layers[this.layers.length] = this.shelfGroup;
        //this.layers[this.layers.length] = shelf;

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
        if(!this.shelfsDefaultPositions.hasOwnProperty('shelfX1') && !this.shelfsDefaultPositions.hasOwnProperty('shelfX2')){
            this.shelfsDefaultPositions['shelfX1'] = shelf.attrs.points[4];
            this.shelfsDefaultPositions['shelfX2'] = shelf.attrs.points[6];
        }

        this.layer.add(shelf);
        shelf.setZIndex(3);
        this.layer.draw();



        let count = 0;
        console.log(this.stage);
        for(let key in this.stage){
            if(this.stage.hasOwnProperty(key)){
                let children = this.stage[key];
                for(let key in children){
                    if(children.hasOwnProperty(key)){
                        let obj = children[key];
                        for(let key in obj){
                            if(obj.hasOwnProperty(key)){
                                let childs = obj[key];
                                for(let key in childs){
                                    if(childs && childs.hasOwnProperty(key)){
                                        let element = childs[key];
                                        if(element && element.hasOwnProperty('attrs')){
                                            let attrs = element.attrs;
                                            if(attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                                                count++;
                                                console.log(childs, count);
                                            }
                                        }
                                    }
                                }
                            }
                        }
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
                        if(child.hasOwnProperty('attrs')){
                            let attrs = child.attrs;
                            if(attrs.hasOwnProperty('name') && attrs.name == 'shelf'){
                                attrs.points[4] = this.shelfsDefaultPositions['currentShelfX1'] = this.shelfsDefaultPositions.shelfX1 + newX;
                                attrs.points[6] = this.shelfsDefaultPositions['currentShelfX2'] = this.shelfsDefaultPositions.shelfX2 + newX;
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
    limitation: {},
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
// let width = window.innerWidth;
// let height = window.innerHeight;
//
//
// let stage = new Konva.Stage({
//     container: 'app',
//     width: width,
//     height: height
// });
//
// let layer = new Konva.Layer();
//
// let polyRight = new Konva.Line({
//     points: [440, 70, 480, 27, 480, 307, 440, 350, 440, 70],
//     fill: 'white',
//     stroke: 'black',
//     strokeWidth: 1,
//     closed : true
// });
//
// let polyLeft = new Konva.Line({
//     points: [50, 70, 90, 27, 90, 307, 50, 350, 50, 70],
//     fill: 'white',
//     stroke: 'black',
//     strokeWidth: 1,
//     closed : true,
//     name: 'leftSection'
// });
//
//
//
// let polyTop = new Konva.Line({
//     points: [50, 70, 90, 27 , 480, 27, 440, 70, 440, 70],
//     fill: 'white',
//     stroke: 'black',
//     strokeWidth: 1,
//     closed : true
// });
//
// let polyBot = new Konva.Line({
//     points: [50, 350, 90, 307 , 480, 307, 440, 350, 440, 350],
//     fill: 'white',
//     stroke: 'black',
//     strokeWidth: 1,
//     closed : true
// });
//
// let shelf = new Konva.Line({
//     points: [50, 225, 90, 182, 285, 182, 245, 225, 50, 225],
//     fill: 'white',
//     stroke: 'black',
//     strokeWidth: 1,
//     closed : true,
//     draggable: true,
//     dragBoundFunc: function(pos) {
//         let minY = polyTop.attrs.points[1];
//         let maxY = polyBot.attrs.points[1];
//         console.log(minY,maxY)
//         let newY;
//         if(pos.y < (maxY-minY)/2*(-1) + 20){
//             newY = (maxY-minY)/2*(-1) + 20;
//         }else if (pos.y > (maxY-minY)/2 - 20 ){
//             newY = (maxY-minY)/2 - 20;
//         }else{
//             newY = pos.y;
//         }
//         return {
//             x: 0,
//             y: newY
//         }
//     }
// });
//
// let shelfsDefaultPositions = {
//     shelfX1 : shelf.attrs.points[4],
//     shelfX2 : shelf.attrs.points[6]
// };
//
// let polySection = new Konva.Line({
//     points: [245, 70, 285, 27, 285, 307, 245, 350, 245, 70],
//     fill: 'white',
//     stroke: 'black',
//     strokeWidth: 1,
//     closed : true,
//     draggable: true,
//     dragBoundFunc: function(pos) {
//         let minX = polyLeft.attrs.points[0],
//             maxX = polyRight.attrs.points[0],
//             newX;
//         if(pos.x < (maxX-minX)/2*(-1) + 20){
//             newX = (maxX-minX)/2*(-1) + 20;
//         }else if (pos.x > (maxX-minX)/2 - 20 ){
//             newX = (maxX-minX)/2 - 20;
//         }else{
//             newX = pos.x;
//         }
//         console.log(newX);
//         shelf.attrs.points[4] = shelfsDefaultPositions.shelfX1 + newX;
//         shelf.attrs.points[6] = shelfsDefaultPositions.shelfX2 + newX;
//         console.log(shelf);
//         return {
//             x: newX,
//             y: 0
//         }
//     }
// });
//
//
//
// // add the shape to the layer
// layer.add(polyBot,polyLeft,shelf,polySection,polyRight,polyTop);
//
// // add the layer to the stage
// stage.add(layer);