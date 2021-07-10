import React, { useEffect } from 'react';

let map = null
let marker = null
const BMapCpmponent = ({
	value,
	onClick,
	onlyShow,
	id,
	style,
}) => {

	useEffect(() => {
		map = new BMap.Map("allmap", { enableMapClick: false }); // 创建Map实例
		map.setCurrentCity("成都");
		map.disableDoubleClickZoom() //禁用双击放大。
		map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
		map.centerAndZoom(new BMap.Point(value?.lng || 104.072113, value?.lat || 30.660360), 12); // 初始化地图,设置中心点坐标和地图级别

		// 监听地图点击事件
		map.addEventListener('click', handleClick, true)
		const handleClick = ({
			type,
			target,
			point,
			pixel,
			overlay
		}) => {
			if (onlyShow) return
			if (onClick) onClick(point, id)
			marker = new BMap.Marker(point); // 创建标注
			map.clearOverlays();
			map.addOverlay(marker);
		}

		return () => {
			map.removeEventListener('click', handleClick);
		}
	}, [])

	useEffect(() => {
		if (value) {
			map.centerAndZoom(new BMap.Point(value?.lng || 104.072113, value?.lat || 30.660360), 12); // 初始化地图,设置中心点坐标和地图级别
			marker = new BMap.Marker({
				lng: value.lng,
				lat: value.lat
			});
			// 创建标注
			map.addOverlay(marker);
		}
	}, [value]);

	return <div id="allmap" style={{ maxWidth: '100%', minHeight: 400, height: 400, ...style }}></div>
}

export default BMapCpmponent