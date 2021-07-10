import React, { useRef, useEffect } from 'react';
let QMap = null;
let marker = null;
let circleMap = null;
let centerMap = null

const QQMapComponent = ({
  zoom,
  minZoom,
  maxZoom,
  scaleControl,
  zoomControl = false,
  panControl,
  mapTypeControl = false,
  draggable,
  scrollwheel,
  disableDoubleClickZoom,
  circle,
  style,
  onClick,
  id,
  onlyShow,
  value
}) => {
  // console.log(props)
  const containerRef = useRef()

  useEffect(() => {
    centerMap = new qq.maps.LatLng(value?.lat || 30.660360, value?.lng || 104.072113);
    QMap = new qq.maps.Map(containerRef.current, {
      zoom: zoom || 12,
      center: centerMap,
      mapTypeId: qq.maps.MapTypeId.ROADMAP, //图类型显示普通的街道地图
      minZoom, //设置地图的最小缩放级别。
      maxZoom,//设置地图的最大缩放级别。
      scaleControl, //比例尺控件的初始启用/停用状态。
      zoomControl, //缩放控件的初始启用/停用状态。
      panControl, //移控件的初始启用/停用状态。
      mapTypeControl, //地图类型控件的初始启用/停用状态。
      draggable,//设置是否可以拖拽
      scrollwheel,//设置是否可以滚动
      disableDoubleClickZoom, //设置是否可以双击放大
    })
    QMap.panTo(centerMap);

    if (circle) {
      circleMap && circleMap.setMap(null);
      circleMap = new qq.maps.Circle({
        map: QMap,
        center: centerMap,
        radius: circle.radius || 0,
        strokeWeight: 1
      })
    }

    // 地图标注单点时事件
    const listener = qq.maps.event.addListener(QMap, 'click', ({ latLng }) => {
      if (onlyShow) return
      // console.log(latLng)
      if (onClick) onClick(latLng, id)
      marker && marker.setMap(null);
      circleMap && circleMap.setMap(null);
      // 平移地图中心
      QMap.panTo(new qq.maps.LatLng(latLng.lat, latLng.lng));
      //创建标记
      marker = new qq.maps.Marker({ position: latLng, map: QMap });
      // 创建圆形覆盖物
      centerMap = new qq.maps.LatLng(latLng.lat, latLng.lng);
      circleMap = circle ? new qq.maps.Circle({
        map: QMap,
        center: centerMap,
        radius: circle.radius || 0,
        strokeWeight: 1
      }) : null

    });
    return () => {
      qq.maps.event.removeListener(listener);
    }
  }, [])

  useEffect(() => {
    if (value) {
      centerMap = new qq.maps.LatLng(value?.lat || 30.660360, value?.lng || 104.072113);
      QMap.panTo(centerMap);
      marker && marker.setMap(null);
      marker = new qq.maps.Marker({ position: centerMap, map: QMap });
    }
  }, [value]);


  return (
    <div ref={containerRef} style={{ maxWidth: '100%', minHeight: 400, height: 400, ...style }}></div>
  )
}

export default QQMapComponent