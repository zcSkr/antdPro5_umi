import React, { useRef, useEffect } from 'react';
let map = null;
let marker = null;
let centerMap = null

const AMapComponent = ({
  style,
  onClick,
  id,
  onlyShow,
  value
}) => {
  // console.log(props)
  const containerRef = useRef()

  useEffect(() => {
    map = new AMap.Map(containerRef.current, {
      zoom: 12,//级别
      center: [value?.lng || 104.072113, value?.lat || 30.660360],//中心点坐标
      viewMode: '3D'//使用3D视图
    });

    // 地图标注单点时事件
    const clickHandler = ({ lnglat }) => {
      if (onlyShow) return
      // console.log(latLng)
      if (onClick) onClick(lnglat, id)
      marker && map.remove(marker);
      // 平移地图中心
      centerMap = new AMap.LngLat(lnglat?.lng || 104.072113, lnglat?.lat || 30.660360);
      map.setCenter(centerMap);
      //创建标记
      marker = new AMap.Marker({
        position: new AMap.LngLat(lnglat?.lng, lnglat?.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: ''
      });
      map.add(marker);
    }
    map.on('click', clickHandler);
    return () => {
      // 解绑事件
      map.off('click', clickHandler)
    }
  }, [])

  useEffect(() => {
    if (value) {
      // 移动中心位置
      centerMap = new AMap.LngLat(value?.lng || 104.072113, value?.lat || 30.660360);
      map.setCenter(centerMap);
      // 重新打点
      marker && map.remove(marker);
      marker = new AMap.Marker({
        position: centerMap,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: ''
      });
      map.add(marker);
    }
  }, [value]);


  return (
    <div ref={containerRef} style={{ maxWidth: '100%', minHeight: 400, height: 400, ...style }}></div>
  )
}

export default AMapComponent