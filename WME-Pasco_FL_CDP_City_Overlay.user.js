// ==UserScript==
// @name                Pasco, FL City/CDP Overlay
// @author		        IAmTheKLB from davielde and rickzabel template
// @namespace           https://greasyfork.org/en/users/
// @description         Creates polygon layers for Cities, Towns, and large CDPs in Pasco Co, FL
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             2.0
// @grant               none
// @copyright           2014 davielde
// ==/UserScript==


//---------------------------------------------------------------------------------------


//based on rickzabel's overlay generator

function bootstrap_MapOverlay()
{
  var bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
  }
  catch (err) { /* Ignore */ }

  if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
      var dummyElem = document.createElement('p');
      dummyElem.setAttribute('onclick', 'return window;');
      return dummyElem.onclick();
    }) ();
  }

    /* begin running the code! */
    setTimeout(InitMapOverlay, 1000);
}

function AddPolygon(mapLayer,polyPoints,polyColor,polyLabel){
    
    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;
    
    var style = {
        strokeColor: polyColor,
        strokeOpacity: 0.8,
        strokeWidth: 3,
        fillColor: polyColor,
        fillOpacity: 0.15,
        label: polyLabel,
        labelOutlineColor: "red",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: polyColor,
        fontOpacity: 0.85,
        fontWeight: "normal"  
    };
    
    var attributes = {
        name: polyLabel 
    };
    
    var pnt= [];
    for(i=0;i<polyPoints.length;i++){
        convPoint = new OpenLayers.Geometry.Point(polyPoints[i].lon,polyPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
        pnt.push(convPoint);
    }
		       
    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);
    
    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    mapLayer.addFeatures([feature]);
}

function CurrentLocation(_mapLayer){
    var mro_Map = unsafeWindow.Waze.map;

    for(i=0;i<_mapLayer.features.length;i++){
        var MapCenter = mro_Map.getCenter();
        var CenterPoint = new OpenLayers.Geometry.Point(MapCenter.lon,MapCenter.lat);
        var CenterCheck = _mapLayer.features[i].geometry.components[0].containsPoint(CenterPoint);
	    var holes = _mapLayer.features[i].attributes.holes;
		
        
        if(CenterCheck === true){
		
		var str = $('#topbar-container > div > div.location-info-region > div').text();
			
		var n2 = str.indexOf(" - ");
            
        var LocationLabel = '';
        var res2 = '';
			
		if(n2 > 0){
			var n = str.length;
			var res = str.substring(n2+2, n);
			var rescount = res.indexOf(" - ");
			if(rescount>0){
				var n3 = res.length;
				res2 = res.substring(rescount+2, n3);
			}
			LocationLabel = 'City/CDP - ' + _mapLayer.features[i].attributes.name + ' - ' + res2;

		} else {
			LocationLabel = 'City/CDP - ' + _mapLayer.features[i].attributes.name + ' - ' + $('#topbar-container > div > div.location-info-region > div').text();
						
		}	
		setTimeout(function(){$('#topbar-container > div > div.location-info-region > div').text(LocationLabel);},200);
		 if (holes === "false") { break; }
	}
    }
}

function InitMapOverlay(){

    var mro_Map = unsafeWindow.Waze.map;
    var mro_OL = unsafeWindow.OpenLayers;

    var mro_mapLayers = mro_Map.getLayersBy("uniqueName","__PascoCoFL");
        
    var _mapLayer = new mro_OL.Layer.Vector("Pasco_Cities_CDPs", {
        displayInLayerSwitcher: true,
        uniqueName: "__PascoCoFL"
    });
        
    I18n.translations.en.layers.name["__PascoCoFL"] = "Pasco_Cities_CDPs";
    mro_Map.addLayer(_mapLayer);
    _mapLayer.setVisibility(true);

  
    var vSanAntonioCity1 = [{lon:'-82.288163',lat:'28.333824'},{lon:'-82.288007',lat:'28.333821'},{lon:'-82.288008',lat:'28.33391'},{lon:'-82.287747',lat:'28.333911'},
                           {lon:'-82.287216',lat:'28.333914'},{lon:'-82.287187',lat:'28.334918'},{lon:'-82.2871',lat:'28.33793'},{lon:'-82.287071',lat:'28.338934'},
                           {lon:'-82.287069',lat:'28.33895'},{lon:'-82.287067',lat:'28.338999'},{lon:'-82.287067',lat:'28.339016'},{lon:'-82.287014',lat:'28.340579'},
                           {lon:'-82.286859',lat:'28.345271'},{lon:'-82.286807',lat:'28.346835'},{lon:'-82.286421',lat:'28.346826'},{lon:'-82.285984',lat:'28.346825'},
                           {lon:'-82.283517',lat:'28.346822'},{lon:'-82.282695',lat:'28.346821'},{lon:'-82.28233',lat:'28.346821'},{lon:'-82.281239',lat:'28.346824'},
                           {lon:'-82.280875',lat:'28.346825'},{lon:'-82.280595',lat:'28.346825'},{lon:'-82.280601',lat:'28.350489'},{lon:'-82.280871',lat:'28.350483'},
                           {lon:'-82.282637',lat:'28.350488'},{lon:'-82.2837',lat:'28.350489'},{lon:'-82.283723',lat:'28.354133'},{lon:'-82.282685',lat:'28.35413'},
                           {lon:'-82.28255',lat:'28.354129'},{lon:'-82.280164',lat:'28.354123'},{lon:'-82.278506',lat:'28.354119'},{lon:'-82.278506',lat:'28.354011'},
                           {lon:'-82.278506',lat:'28.353687'},{lon:'-82.278506',lat:'28.35358'},{lon:'-82.278505',lat:'28.353273'},{lon:'-82.278505',lat:'28.352353'},
                           {lon:'-82.278505',lat:'28.352307'},{lon:'-82.2791',lat:'28.352311'},{lon:'-82.279118',lat:'28.352037'},{lon:'-82.279119',lat:'28.35169'},
                           {lon:'-82.278833',lat:'28.351691'},{lon:'-82.278831',lat:'28.351333'},{lon:'-82.278504',lat:'28.351337'},{lon:'-82.278504',lat:'28.351202'},
                           {lon:'-82.278504',lat:'28.35116'},{lon:'-82.278504',lat:'28.351014'},{lon:'-82.278506',lat:'28.350578'},{lon:'-82.278507',lat:'28.350488'},
                           {lon:'-82.276722',lat:'28.350488'},{lon:'-82.276466',lat:'28.350488'},{lon:'-82.276461',lat:'28.34681'},{lon:'-82.275373',lat:'28.346802'},
                           {lon:'-82.27439',lat:'28.346819'},{lon:'-82.271087',lat:'28.34682'},{lon:'-82.270701',lat:'28.346821'},{lon:'-82.270457',lat:'28.346821'},
                           {lon:'-82.27044',lat:'28.345787'},{lon:'-82.270408',lat:'28.344248'},{lon:'-82.270378',lat:'28.344238'},{lon:'-82.270351',lat:'28.344229'},
                           {lon:'-82.270302',lat:'28.344184'},{lon:'-82.270279',lat:'28.344145'},{lon:'-82.270258',lat:'28.34409'},{lon:'-82.270258',lat:'28.343648'},
                           {lon:'-82.270258',lat:'28.341725'},{lon:'-82.270259',lat:'28.341085'},{lon:'-82.27025',lat:'28.340702'},{lon:'-82.270226',lat:'28.339556'},
                           {lon:'-82.270219',lat:'28.339174'},{lon:'-82.27022',lat:'28.338796'},{lon:'-82.270225',lat:'28.337663'},{lon:'-82.270226',lat:'28.337432'},
                           {lon:'-82.270227',lat:'28.337286'},{lon:'-82.270248',lat:'28.336225'},{lon:'-82.270244',lat:'28.335557'},{lon:'-82.269891',lat:'28.335561'},
                           {lon:'-82.270018',lat:'28.335534'},{lon:'-82.270115',lat:'28.335505'},{lon:'-82.270207',lat:'28.335459'},{lon:'-82.270259',lat:'28.335381'},
                           {lon:'-82.270287',lat:'28.335288'},{lon:'-82.270304',lat:'28.334362'},{lon:'-82.270315',lat:'28.333808'},{lon:'-82.270317',lat:'28.333685'},
                           {lon:'-82.270344',lat:'28.333526'},{lon:'-82.27042',lat:'28.33331'},{lon:'-82.270434',lat:'28.333278'},{lon:'-82.27044',lat:'28.332361'},
                           {lon:'-82.270442',lat:'28.332166'},{lon:'-82.270443',lat:'28.33197'},{lon:'-82.270431',lat:'28.331764'},{lon:'-82.270419',lat:'28.331557'},
                           {lon:'-82.270418',lat:'28.331544'},{lon:'-82.270379',lat:'28.330891'},{lon:'-82.270369',lat:'28.33072'},{lon:'-82.270359',lat:'28.33055'},
                           {lon:'-82.270342',lat:'28.330269'},{lon:'-82.270331',lat:'28.330085'},{lon:'-82.27102',lat:'28.330093'},{lon:'-82.271622',lat:'28.33009'},
                           {lon:'-82.271626',lat:'28.330211'},{lon:'-82.274188',lat:'28.33022'},{lon:'-82.27428',lat:'28.330221'},{lon:'-82.274279',lat:'28.32989'},
                           {lon:'-82.274278',lat:'28.329743'},{lon:'-82.274275',lat:'28.329304'},{lon:'-82.274275',lat:'28.329158'},{lon:'-82.274275',lat:'28.328974'},
                           {lon:'-82.274279',lat:'28.328425'},{lon:'-82.27428',lat:'28.328242'},{lon:'-82.274389',lat:'28.328242'},{lon:'-82.274946',lat:'28.328244'},
                           {lon:'-82.276945',lat:'28.32825'},{lon:'-82.277612',lat:'28.328253'},{lon:'-82.278441',lat:'28.328256'},{lon:'-82.278432',lat:'28.328634'},
                           {lon:'-82.278422',lat:'28.329048'},{lon:'-82.278376',lat:'28.331028'},{lon:'-82.278358',lat:'28.331798'},{lon:'-82.278357',lat:'28.331839'},
                           {lon:'-82.278356',lat:'28.331878'},{lon:'-82.278356',lat:'28.331892'},{lon:'-82.278428',lat:'28.331891'},{lon:'-82.282807',lat:'28.33191'},
                           {lon:'-82.284434',lat:'28.331906'},{lon:'-82.284863',lat:'28.331907'},{lon:'-82.28615',lat:'28.331913'},{lon:'-82.28658',lat:'28.331915'},
                           {lon:'-82.286863',lat:'28.331916'},{lon:'-82.287146',lat:'28.331917'},{lon:'-82.287142',lat:'28.332064'},{lon:'-82.288002',lat:'28.332061'},
                           {lon:'-82.288002',lat:'28.332045'},{lon:'-82.288001',lat:'28.33202'},{lon:'-82.287998',lat:'28.331945'},{lon:'-82.287998',lat:'28.33192'},
                           {lon:'-82.288029',lat:'28.33192'},{lon:'-82.288122',lat:'28.33192'},{lon:'-82.288154',lat:'28.331921'},{lon:'-82.288154',lat:'28.331945'},
                           {lon:'-82.288154',lat:'28.332017'},{lon:'-82.288155',lat:'28.332042'},{lon:'-82.288157',lat:'28.332441'},{lon:'-82.288163',lat:'28.333641'},
                           {lon:'-82.288163',lat:'28.333824'}];
    
	var vSanAntonioCity2 = [{lon:'-82.289216',lat:'28.331921'}, {lon:'-82.288695',lat:'28.331921'}, {lon:'-82.288693',lat:'28.331787'},{lon:'-82.287145',lat:'28.331824'},
		{lon:'-82.287145',lat:'28.331757'},{lon:'-82.287128',lat:'28.328271'},{lon:'-82.288642',lat:'28.32827'},{lon:'-82.289215',lat:'28.32827'},
        {lon:'-82.289216',lat:'28.331783'},{lon:'-82.289216',lat:'28.331921'}];

	AddPolygon(_mapLayer, vSanAntonioCity1, "#FFFFFF","San Antonio");
	AddPolygon(_mapLayer, vSanAntonioCity2, "#FFFFFF","San Antonio");
    
    
    setTimeout(function(){CurrentLocation(_mapLayer);},3000);
    mro_Map.events.register("moveend", Waze.map, function(){CurrentLocation(_mapLayer);});
    mro_Map.events.register("zoomend", Waze.map, function(){CurrentLocation(_mapLayer);});

}

bootstrap_MapOverlay(); 

