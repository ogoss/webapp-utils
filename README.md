# CanvasFramePlayer 模块

## 使用方法
``` javascript
<script src="dist/frame-player.min.js"></script>
```

## 本地测试

- 安装依赖

```
npm install
```

- 启动服务

```
npm start
```

## 配置属性

``` javascript
framePlayer.init({
  nodeName: '#canvas',
  nodeClass: '',
  width: 750,
  height: 1207
});
```

- nodeName: canvas外层元素
- nodeClass: canvas外层元素样式类名
- width: (default: 750px) canvas宽度
- height: (default: 1207px) canvas高度

## 方法调用

- 加载序列帧图片

``` javascript
/**
 * @param {Array} frames 序列帧数组
 * @param {String} tag 序列帧索引
 */
framePlayer.loadFrame(frames, tag);
```

- 播放序列帧

``` javascript
/**
 * @param {String} tag 序列帧索引
 * @param {Number} duration 持续时间，单位ms
 * @param {Number} times 动画播放次数 [times<0:无限次, times=0:不播放, times>0:播放times次]
 * @param {Function} onPlayStart 开始播放回调函数
 * @param {Function} onPlayEnd 结束播放回调函数
 */
framePlayer.play(tag, duration, times, onPlayStart, onPlayEnd);
```

- 清除屏幕内容

``` javascript
framePlayer.clear();
```

- 停止动画

``` javascript
framePlayer.stop();
```