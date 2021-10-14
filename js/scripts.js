/*!
    * Start Bootstrap - SB Admin v7.0.3 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2021 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

const map = new kakao.maps.Map(document.getElementById('map'), {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3
});

const geocoder = new kakao.maps.services.Geocoder();
const places = new kakao.maps.services.Places();

let marker_list = [];
let infowindow_list = [];

const callback = (result, status) => {
    console.log(result[0]);
    if (status === kakao.maps.services.Status.OK) {
        setCenter(result[0].y, result[0].x);

        clearMarker();
        removeMarker();
        clearInfoWindow();
        removeInfowindow();

        const marker = new kakao.maps.Marker({ 
            position: map.getCenter() 
        });                    
        marker_list.push(marker);

        const infowindow = new kakao.maps.InfoWindow({
            position : map.getCenter(),
            content : `<div class="marker-infowindow"><div>${result[0].address_name}</div></div>` 
        });
        infowindow_list.push(infowindow);

        drawMarker();
        map.setLevel(result[0].address_type === 'REGION' ? 9 : 3);

        document.querySelector("#address-keyword").value = "";
        document.querySelector("#address-keyword").focus();
    }
};

const callback2 = (result, status) => {
    console.log(result);
    if (status === kakao.maps.services.Status.OK) {
        clearMarker();
        removeMarker();
        clearInfoWindow();
        removeInfowindow();

        result.forEach((item) => {
            const markerPos = new kakao.maps.LatLng(item.y, item.x);
            const marker = new kakao.maps.Marker({ 
                position: markerPos
            }); 
            marker_list.push(marker);
            
            const infowindow = new kakao.maps.InfoWindow({
                position : markerPos, 
                content : `<div class="marker-infowindow"><div>${item.place_name}</div></div>` 
            });
            infowindow_list.push(infowindow);
        });
        drawMarker();
        map.setLevel(5);

        setCenter(result[0].y, result[0].x);
    }
};

document.querySelector('#address-region').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        const { target : { value }} = e;
        
        geocoder.addressSearch(value, callback, {
            analyze_type: kakao.maps.services.AnalyzeType.SIMILAR,
        });
    }
});

document.querySelector("#address-keyword").addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        const { target : { value }} = e;

        places.keywordSearch(value, callback2, {
            location: map.getCenter(),
            radius: 5000,
            sort: kakao.maps.services.SortBy.DISTANCE,
        });
    }
});

function clearMarker() {
    marker_list.forEach(marker => {
        marker.setMap(null);
    });
}
function clearInfoWindow() {
    infowindow_list.forEach(infowindow => {
        infowindow.close();
    });
}

function removeMarker() {
    marker_list = [];
}
function removeInfowindow() {
    infowindow_list = [];
}

function drawMarker() {
    marker_list.forEach((marker, i) => {
        marker.setMap(map);
        if(infowindow_list[i]) {
            infowindow_list[i].open(map, marker);
        }
    });
};

function setCenter(lat, lng) {            
    // 이동할 위도 경도 위치를 생성합니다 
    const centerXY = new kakao.maps.LatLng(lat, lng);
    
    // 지도 중심을 이동 시킵니다
    map.setCenter(centerXY);
}

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});
