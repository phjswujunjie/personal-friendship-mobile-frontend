<template>
  <div v-if="display" ref="allDiv">
    <div class="my-action-sheet-div" >
      <button class="action-sheet-button" @click="onSelect" :index="index" v-for="(value, index) in action" :key="value.title">
        <i :index="index" v-if="value.icon" :class="value.icon"></i>
        {{value.title}}
      </button>
      <button class="action-sheet-button" style="margin-top: 5px" @click="onCancel">取消</button>
    </div>
    <div class="backdrop-modal" @click="onCancel"></div>
  </div>
</template>

<script>
export default {
  name: 'action-sheet',
  watch: {
    actionVal: {
      handler (val, oldVal) {
        this.action = val
      },
      deep: true
    },
    displayVal: {
      handler (val, oldVal) {
        this.display = val
      },
      deep: true
    }
  },
  props: ['actionVal', 'displayVal'],
  data () {
    return {
      // 必须为数组
      action: this.actionVal,
      // boolean值
      display: this.displayVal
    }
  },
  methods: {
    onSelect (e) {
      this.$emit('onSelect', this.action[Number(e.target.getAttribute('index'))])
    },
    onCancel () {
      this.display = false
      this.$emit('onCancel', false)
    }
  }
}
</script>

<style scoped lang="less">
.my-action-sheet-div {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #ebedf0;
  z-index: 2002;
  border-radius: 20px 20px 0 0;

  button:first-child {
    border-radius: 20px 20px 0 0;
  }

  .action-sheet-button {
    width: 100%;
    height: 50px;
    padding: 10px;
    border: none;
    background-color: white;
    color: #646566;
    font-size: 1.25rem;
    cursor: pointer;
    display: block;
  }

  .action-sheet-icon {
    font-size: 1.25rem;
    margin-right: 5px;
  }
}

.backdrop-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
