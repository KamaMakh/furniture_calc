<template>
    <div id="app">
        <v-stage ref="stage" :config="configKonva" @click="stageClick">
            <v-layer ref="layer">
                <v-circle :config="configCircle"  @mousedown="handlClick" />
                <v-line :config="configLine" @click="handlClick" @mouseover="handlMouseover"></v-line>
                <v-transformer></v-transformer>
            </v-layer>

            <v-layer ref="dragLayer" ></v-layer>
        </v-stage>
    </div>
</template>

<script>
    let vm = {};
    export default {
        data(){
            return {
                configKonva: {
                    width: 500,
                    height: 500
                },
                configCircle: {
                    x: 250,
                    y: 300,
                    radius: 70,
                    fill: "red",
                    stroke: "black",
                    strokeWidth: 4,
                    draggable: true,
                    dragBoundFunc: function(pos) {
                        const stage = vm.$refs.stage.getStage();
                        let x = stage.getWidth() / 2;
                        let newY;
                        if(pos.y < 100){
                            newY = 100;
                        }else if (pos.y > stage.getHeight()-70){
                            newY = stage.getHeight()-70;
                        }else{
                            newY = pos.y;
                        }
                        return {
                            x: x,
                            y: newY
                        }
                    }
                },
                configLine: {
                    points: [50, 70, 80, 10, 80, 270, 50, 330, 50, 70],
                    stroke: 'red',
                    fill: '#00D2FF',
                    strokeWidth: 1,
                    lineCap: 'round',
                    lineJoin: 'round',
                    draggable: true,
                    closed: true,
                    name: 'myLine'
                }
            }
        },
        methods: {
             handlClick(vueComponent, event){

             },
            handlMouseover(vueComponent, event){
                event.target.attrs.fill = 'black';
                this.configLine.fill = 'black';
            },
            stageClick(vueComponent, event){
                let className = event.target.classname;
                let stage = vm.$refs.stage.getStage();
                let layer = vm.$refs.layer.getStage();

                console.log(stage)
                // if click on empty area - remove all transformers
                if (event.target === stage) {
                    stage.find('Transformer').destroy();
                    layer.draw();
                    return;
                }

                // do nothing if clicked NOT on our rectangles
                if (!event.target.hasName('rect')) {
                    return;
                }
                // remove old transformers
                // TODO: we can skip it if current rect is already selected
                stage.find('Transformer').destroy();

                // create new transformer
                let tr = new Konva.Transformer();
                layer.add(tr);
                tr.attachTo(event.target);
                layer.draw();
            }
          },
          mounted() {
              vm = this;
              const scale = Math.random();
              const stage = vm.$refs.stage.getStage();
          }
    }
</script>