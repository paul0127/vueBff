<template>
  <form class="d-flex flex-row hma_form">
    <slot />
  </form>
</template>
<script setup>
import { provide, ref } from 'vue'

const props = defineProps({
  labelWidth: { type: String, default: 'auto' },
  labelPossition: { type: String, default: 'left' },
  labelBottom: { type: String, default: '25px' },
  rules: { type: Object, default: () => ({}) },
  model: { type: Object, default: () => ({}) },
})

const formItems = ref([])

const registerFormItem = (item) => {
  formItems.value.push(item)
}
const unregisterFormItem = (item) => {
  formItems.value = formItems.value.filter((i) => i !== item)
}

const validate = async () => {
  let isValid = true

  for (const item of formItems.value) {
    const result = await item.validateItem()
    if (!result) {
      isValid = false
    }
  }

  return isValid
}

provide('labelWidth', props.labelWidth)
provide('labelPossition', props.labelPossition)
provide('labelBottom', props.labelBottom)
provide('rules', props.rules)
provide('model', props.model)
provide('registerFormItem', registerFormItem)
provide('unregisterFormItem', unregisterFormItem)

defineExpose({ validate })
</script>

<style lang="scss" scoped>
$default_color: #00848c;
$white_color: #ffff;
.form-check-label {
  white-space: nowrap;
}
%septum_line {
  position: relative;
  // &::before,&::after{
  //     content: '';
  //     position: absolute;
  //     width: 2px;
  //     border-right: 2px dotted #0097d4;
  // }
}
.hma_form {
  @extend %septum_line;
  &::before,
  &::after {
    top: 30px;
    height: 175px;
  }
  &::before {
    left: 35%;
  }
  &::after {
    left: 67%;
  }
  width: 100%;
  margin: auto;
  padding: 30px;
  flex-wrap: wrap;
  background-color: #cdcdcd38;
  .col {
    margin-bottom: 25px;
    .col-sm-3a {
      flex: 0 0 auto;
      white-space: nowrap;
      width: 26%;
      margin-left: 5px;
    }
    &.case_sort {
      .col-form-label {
        margin-right: 8px;
      }
    }
    // &:nth-child(2n + 1){
    //     border: 1px solid red;
    //     .col-form-label{
    //         margin-left: 10px;
    //     }
    // }
    &.dataPicker {
      display: flex;
      .dp__theme_light {
        width: 42%;
        margin-left: 0px;

        &.start,
        &.end {
          .dp__input_wrap {
            .dp__pointer {
              border-color: #ffff;
              padding: 0;
              font-size: x-small;
              line-height: 3;
            }
          }

          &.start {
            svg,
            .dp--clear-btn {
              display: none;
            }
          }
          &.end {
            svg {
              left: 80%;
              color: $default_color;
            }
          }
        }
      }
      .date_input {
        // border:1px solid #ddd;
        border-radius: 0.375rem;
        //  background-color: white;
        display: flex;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        margin-left: 8px;
        width: 95%;
        position: relative;
        z-index: 2;
        .date_item {
          width: 100%;
          display: flex;
          position: relative;
          z-index: 1;
          .datepicker {
            border-radius: 0.375rem;
            border-color: transparent;
            background-color: transparent;
            width: 100%;
            border-width: 0px;
            padding-left: 20px;
            position: relative;
          }
          &::after {
            color: #333;
            content: '\f214';
            cursor: pointer;
            display: inline-block;
            font-family: bootstrap-icons !important;
            font-style: normal;
            font-weight: normal !important;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            vertical-align: -0.125em;
            -webkit-font-smoothing: antialiased;
            position: absolute;
            z-index: -1;
            right: 5px;
            top: 10px;
          }
        }
        .datepicker:focus-visible {
          outline: white 0 0;
        }
      }
    }
    .col-form-label {
      text-align: right;
    }
    .symbol {
      display: flex;
      align-items: center;
      margin-left: 0;
    }
    .form-select {
      margin-left: 9px;
    }
    &.check-group {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .tabs {
    width: 100%;
    .nav {
      background-image: none;
      justify-content: flex-start;
    }
  }
}
input:focus {
  outline: 2px solid transparent;
}
.search_result {
  display: flex;
  justify-content: center;
  margin: auto;
  position: relative;
  width: 150px;
  &::after {
    content: '';
    border-radius: 50%;
    background-color: #d1ecee;
    left: 50px;
    opacity: 0.5;
    position: absolute;
    top: 50px;
    width: 100px;
    height: 100px;
  }
  &::before {
    content: '';
    border-radius: 50%;
    background-color: #def1f2;
    left: 0px;
    opacity: 0.9;
    position: absolute;
    top: 0px;
    width: 100px;
    height: 100px;
  }
  img {
    position: relative;
    width: 100px;
    z-index: 9;
  }
}

.pageHome,
.pageCMSI {
  .datepicker table tr td {
    &.active,
    &.highlighted {
      &:active,
      &.highlighted,
      &.active {
        background-color: #00848c;
        border-color: #00848c;
      }
    }
  }
}
@media screen and (width<=1560px) {
  .hma_form .col.dataPicker .date_input .date_item .bi-calendar3 {
    top: 5px;
    right: 10px;
  }
}
@media screen and (width<=1500px) {
  .hma_form .col.dataPicker .date_input .date_item .datepicker {
    padding-left: 10px;
  }
}
@media screen and (width<=1440px) {
  .hma_form .col.dataPicker .date_input .date_item {
    .datepicker {
      padding-left: 6px;
      font-size: 14px;
    }
  }
}
@media screen and (width<=1366px) {
  .hma_form .col {
    .col-sm-3a {
      white-space: nowrap;
      width: 30%;
    }
    &.dataPicker {
      .dp__theme_light {
        &.start,
        &.end {
          &.end svg {
            left: 68%;
            path {
              &:first-child {
                left: 68%;
              }
            }
          }
        }
      }
    }
  }
}
@media screen and (width<=1360px) {
  .hma_form {
    padding: 20px;
  }
}
@media screen and (width <= 1280px) {
  .hma_form .col.dataPicker .date_input .date_item {
    .datepicker {
      padding-left: 2px;
      font-size: 14px;
    }
  }
}

@media screen and (width<=1260px) {
  .hma_form {
    .col-sm-4 {
      width: 32%;
      &.flex-row {
        flex-direction: column !important;
        .col-sm-3a {
          width: 100%;
        }
      }
      margin-left: 5px;
    }
    .col-sm-12 {
      flex-wrap: wrap;
      margin-left: 15px;
      .form-check {
        margin-bottom: 10px;
      }
    }
    .col {
      &.dataPicker .date_input {
        height: 39px;
        .date_item .datepicker {
          padding-left: 10px;
          font-size: 0.9rem;
        }
      }
    }
  }
}
@media screen and (width<=1060px) {
  .hma_form {
    .col-sm-4 {
      width: 48%;
      margin-left: 5px;
    }
  }
}
@media screen and (width<=768px) {
  .title_area .title {
    font-size: 24px;
  }
}
@media screen and (width<=767px) {
  .hma_form {
    .col-sm-4 {
      width: 45%;
      margin-left: 5px;
    }
  }
}
@media screen and (width <= 575px) {
  .hma_form .col-sm-4 {
    width: 45%;
    margin-left: 5px;
  }
}
</style>