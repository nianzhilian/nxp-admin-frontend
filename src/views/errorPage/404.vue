<template>
  <div style="background:#f0f2f5;height:100%;position:absolute;overflow:hidden;width:100%">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" :src="img_404" alt="404">
        <img class="pic-404__child left" :src="img_404_cloud" alt="404">
        <img class="pic-404__child mid" :src="img_404_cloud" alt="404">
        <img class="pic-404__child right" :src="img_404_cloud" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__info">版权所有<a class='link-type' href='' target='_blank'>我的车车</a></div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
        <a href="/" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
import img_404 from '../../assets/404_images/404.png'
import img_404_cloud from '../../assets/404_images/404_cloud.png'

export default {
  data() {
    return {
      img_404,
      img_404_cloud
    }
  },
  computed: {
    message() {
      return '特朗普说这个页面你不能进......'
    }
  }
}
</script>

<style  scoped>

.wscn-http404 {
    margin: 0px auto;
    overflow: hidden;
    padding: 0 100px;
    position: relative;
    width: 1200px;
}
.wscn-http404 .pic-404 {
    float: left;
    overflow: hidden;
    padding: 150px 0;
    position: relative;
    width: 600px;
}
.wscn-http404 .pic-404__parent {
    width: 100%;
}
.wscn-http404 .pic-404__child {
    position: absolute;
}
.wscn-http404 .pic-404__child.left {
    animation-delay: 1s;
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-name: cloudLeft;
    animation-timing-function: linear;
    left: 220px;
    opacity: 0;
    top: 17px;
    width: 80px;
}
.wscn-http404 .pic-404__child.mid {
    animation-delay: 1.2s;
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-name: cloudMid;
    animation-timing-function: linear;
    left: 420px;
    opacity: 0;
    top: 10px;
    width: 46px;
}
.wscn-http404 .pic-404__child.right {
    animation-delay: 1s;
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-name: cloudRight;
    animation-timing-function: linear;
    left: 500px;
    opacity: 0;
    top: 100px;
    width: 62px;
}
@keyframes cloudLeft {
0% {
    left: 220px;
    opacity: 0;
    top: 17px;
}
20% {
    left: 188px;
    opacity: 1;
    top: 33px;
}
80% {
    left: 92px;
    opacity: 1;
    top: 81px;
}
100% {
    left: 60px;
    opacity: 0;
    top: 97px;
}
}
@keyframes cloudMid {
0% {
    left: 420px;
    opacity: 0;
    top: 10px;
}
20% {
    left: 360px;
    opacity: 1;
    top: 40px;
}
70% {
    left: 180px;
    opacity: 1;
    top: 130px;
}
100% {
    left: 120px;
    opacity: 0;
    top: 160px;
}
}
@keyframes cloudRight {
0% {
    left: 500px;
    opacity: 0;
    top: 100px;
}
20% {
    left: 460px;
    opacity: 1;
    top: 120px;
}
80% {
    left: 340px;
    opacity: 1;
    top: 180px;
}
100% {
    left: 300px;
    opacity: 0;
    top: 200px;
}
}
.wscn-http404 .bullshit {
    float: left;
    overflow: hidden;
    padding: 150px 0;
    position: relative;
    width: 300px;
}
.wscn-http404 .bullshit__oops {
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-name: slideUp;
    color: #1482f0;
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    margin-bottom: 20px;
    opacity: 0;
}
.wscn-http404 .bullshit__headline {
    animation-delay: 0.1s;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-name: slideUp-data;
    color: #1482f0;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 10px;
    opacity: 0;
}
.wscn-http404 .bullshit__info {
    animation-delay: 0.2s;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-name: slideUp-data;
    color: grey;
    font-size: 13px;
    line-height: 21px;
    margin-bottom: 30px;
    opacity: 0;
}
.wscn-http404 .bullshit__return-home {
    animation-delay: 0.3s;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-name: slideUp-data;
    background: #1482f0 none repeat scroll 0 0;
    border-radius: 100px;
    color: #ffffff;
    cursor: pointer;
    display: block;
    float: left;
    font-size: 14px;
    height: 36px;
    line-height: 36px;
    opacity: 0;
    text-align: center;
    width: 110px;
}
@keyframes slideUp-data {
0% {
    opacity: 0;
    transform: translateY(60px);
}
100% {
    opacity: 1;
    transform: translateY(0px);
}
}

</style>
