<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {

  data(){
    return{

    }
  },
 created() {
    setTimeout(() => {
      window.L2Dwidget.init({
          pluginRootPath: 'live2dw/',
          pluginJsPath: 'lib/',
          pluginModelPath: 'live2d-widget-model-miku/assets/',
          tagMode: false,
          debug: false,
          //model: { jsonPath: '../live2dw/live2d-widget-model-z16/assets/z16.model.json' },
          model: { jsonPath: '../live2dw/live2d-widget-model-miku/assets/miku.model.json' },
          display: { position: 'right', width: 250, height: 500 },
          mobile: { show: true },
          log: false
          })
     }, 0)
},
}
</script>

