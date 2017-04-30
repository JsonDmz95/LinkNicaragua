var pos = 0;
var intv;
var flippedElement;

var opcionesPlan = [{

    opciones:[{opcion:'Lorem ipsum'}, {opcion:'dolor sit amet'}, {opcion:'consectetur adipisicing elit'}], nombre: 'Plan Basico', costo:'$ ###.'},

    {opciones:[{opcion:'sed do eiusmod tempor'}, {opcion: 'incididunt ut labore et'}, {opcion: 'dolore magna aliqua'}, {opcion: 'Ut enim ad minim veniam'}], nombre:'Plan Esencial', costo:'$ ###.'},

    {opciones:[{opcion: 'quis nostrud exercitation'}, {opcion:'ullamco laboris nisi'}, {opcion:'ut aliquip ex ea'}, {opcion:'commodo consequat'}, {opcion:'Duis aute irure dolor'}], nombre:'Plan Premium', costo:'$ ###.'}
];


$(document).on('ready',function(){
    init();
});

function init(){
    /*$('#eventos').ScrollTo({
        duration:5000,
        callback: function(){
            alert('Hello!');
        }

    });*/
    $.stellar({
        'horizontalScrolling': false,
        hideDistantElements: false
    });
    var sc = $.scrollorama({
        blocks:'.fullScreen',
        enablePin:false
    });
    sc.animate('.mensajePrincipal',{
        delay: 700,
        duration: 350,
        property:'top',
        end: 500
    });
    sc.animate('.precio',{
        delay: 400,
        duration: 500,
        property:'zoom',
        start: 0.5,
        end: 1
    });
    $('#menu').localScroll();
    $('#comenzar').localScroll();
    $('.slider_controls li').on('click', handleClick);
    var width = $('.slider_container').width();

    $('.slide').each(function(i,e){
        addBackground(e,width,true);
    });

    $('.image_star').on('click', changeViewport);

    $('.image_star').each(function(i,e){
        addBackground(e,false);
        if ($(e).hasClass('viewport')) return true;
        $(e).data('top',((i)*100));
        $(e).css({
            'top':$(e).data('top')+'px'
        });
    });

    $(document).on('click', ".ver-mas", flipElement);

    //clearInterval(intv);
    intv = setInterval(handleClick,7000)
}

google.maps.event.addDomListener(window,'load',drawMap);
function drawMap (){
    var mapa;
    var opcionesMapa = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    mapa = new google.maps.Map(document.getElementById('google_canvas'), opcionesMapa);
    navigator.geolocation.getCurrentPosition(function(posicion){
        var geolocalizacion = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
        //quitar desde aqi
        var marcador = new google.maps.Marker({
            map: mapa,
            draggable: true,
            position: geolocalizacion,
            visible: true
        });
        marcador.setTitle('Aqui esta su corazon');
        //hasta aqui
        mapa.setCenter(geolocalizacion);
        calcRoute(geolocalizacion, mapa);
        marcador.addListener('dragend', function(e){
            var poslat = marcador.getPosition().lat();
            var poslng = marcador.getPosition().lng();
            alert("Su corazon esta en la siguiente posicion: latitud: "+poslat+" || longitud:"+poslng);
        });
    });
}

function calcRoute(inicioRuta, mapa){
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(mapa);
    var direccion= new google.maps.LatLng(12.1235375, -86.2553076);
    /*var marcador = new google.maps.Marker({
        map: mapa,
        draggable: false,
        position: direccion,
        visible: true
    });*/
    var request= {
        origin: inicioRuta,
        destination: direccion,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    }
    directionsService.route(request,function(response, status){
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
        }
    });
}

function changeViewport(){
    var e = $('.viewport');
    e.css('top',$(e).data('top'));
    e.removeClass('viewport');
    $(this).addClass('viewport');
    $(this).css('top',0);
}

function addBackground(element, width, setSize){
    if(!width) width = $('html').width();
    if(setSize){
        $(element).css({
            'width' : width,
            'height' : $('html').height()
        });
    }
    var imagen = $(element).data('background');
    $(element).css('background-image',"url("+(imagen+".jpg")+")")
}

function flipElement(){
    if(flippedElement != null){
        $(flippedElement).revertFlip();
        flippedElement = null;
    }
    $(flippedElement).remove();
    var padre = $(this).parent();
    flippedElement = padre;
    $('#precioTemplate').template("CompiledTemplate");
    $(padre).flip({
        direction:'rl',
        speed: 500,
        content: $('#precioTemplate').tmpl(opcionesPlan[$(this).data('number')]).html(),
        color: '#dbdbe0',
        onEnd: function(){
            $('#regresar').on('click', function() {
                $(flippedElement).revertFlip();
                flippedElement = null;
            });
        }
    });
}

function handleClick(){
    var slide_target = 0;
    if($(this).parent().hasClass('slider_controls')){
        slide_target = $(this).index();
        pos = slide_target;
        clearInterval(intv);
        intv = setInterval(handleClick,7000)
    } else {
        pos++;
        if (pos>=$('.slide').length) {
            pos=0
        }
        slide_target=pos;
    }

    $('.slideContainer').fadeOut('slow',function(){
        $(this).animate({
            'margin-left':-(slide_target * $('.slider_container').width())+'px'
        },'slow',function(){
            $(this).fadeIn();
        });
    });
}
