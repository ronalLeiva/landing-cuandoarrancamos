$(document).ready(function(){


    // Activate Carousel
    $("#myCarousel,#myCarousel1").carousel({
        pause:false
    });

    // Muestro Formulario
    $('.callToAct').click(function(event) {
        $('.app-formulario').fadeIn('slow');
    });

    //Efecto botonu subir
    $('.ir-arriba').click(function(){
        $('body, html').animate({
            scrollTop: '0px'
        }, 300);
    });

    $(window).scroll(function(){
        if( $(this).scrollTop() > 0 ){
            $('.ir-arriba').slideDown(300);
        } else {
            $('.ir-arriba').slideUp(300);
        }
    });

// Form contactenos

    // Variables globales
    var tipoAsunto = '';

    // Quito estilos cuando desee para dejar campos con fondo blanco
    function limpioEstilos(){
        $('[required]').each(function(){

            $(this).css('background','');
            $(this).css('color','');

            // Habilito el botÃ³n que asumo esta deshabilitado
            $('#btn-contacto').removeAttr('disabled');

        });
    }

    function comprueba(){
        // Selecciono todos los input que tienen required
        var cuento = 0;
        $('[required]').each(function(){
            if ( !$.trim( $(this).val() ) ){
                // Coloreo en rojo lo que esta mal
                $(this).css('background','#fbe9e9');
                // Voy contando cantidad de campos requeridos vacios
                cuento++;
            }else{

                // Coloreo en verde lo que esta bien
                $(this).css('background','#e8fdd7');
                $(this).css('color','darkgreen');
            }
        });

        // Devuelvo la cantidad de elementos requeridos encontrados vacios
        return cuento;
    }


    // Boton cerrar mensajes opacos
    $('span.exit').click(function(){
        $(this).parent().parent().hide('slow');
    });

    $('.opaco').click(function(){
       $(this).hide('slow');
    });


    // Ajax para estados
    $('#Pais').change(function(){

        var id = $('option:selected', this).attr('idPais');

        // Si selecciona Costa Rica o Mexico no me interesa pedir estado y ciudad
        if (id === 'CR' || id==='MX'){
            $('#OtroPais').remove();
            $('#Estado').remove();
            $('#Ciudad').remove();

        }else if(id === 'OT'){
            // Limpio lo que existia
            $('#OtroPais').remove();
            $('#Estado').remove();
            $('#Ciudad').remove();

            // Creo campo para que teclen el nombre del paÃ­s
            $('#Pais').after('\
                <input type="text" name="OtroPais" id="OtroPais" tabindex="6" placeholder="Nombre del paÃ­s" required autocomplete="off">\
            ').focus();
        }else{
            $('#OtroPais').remove();
            $('#Estado').remove();
            $('#Ciudad').remove();
            $('#Pais').after('\
                <select name="Estado" id="Estado" tabindex="6" disabled required>\
                    <option value="" selected="selected">Selecciona el departamento / región</option>\
                </select>\
                <select name="Ciudad" id="Ciudad" tabindex="7" disabled required>\
                    <option value="" selected="selected">Selecciona la ciudad</option>\
                </select>\
            ');
        }

        // Limpio el select y le agrego el mensaje de acciÃ³n
        $('#Estado').html('');
        $('#Estado').append('<option value="">Selecciona el departamento / región</option>');

        $.ajax({
            data:   'accion=traerEstado'+'&idpais='+id,
            url:    '/wp-content/themes/Masesa-2016/class/Ajax.class.php',
            type:   'POST',
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            beforeSend: function (xhr) {
                try{
                    //con esto compongo los acentos y agregue una linea al php header
                    xhr.overrideMimeType('text/html; charset=UTF-8');
                    //  $("#resultado").html("Procesando, espere por favor...").css("padding","3px").show();
                }catch(e){
                }
            },
            success:  function (response) {

                for(var i=0;i<response.length;i++){
                    $('#Estado').append('<option idEstado="'+response[i]['id_estado']+'" value="'+response[i]['estado']+'">'+response[i]['estado']+'</option>');
                }
                // Habilito el Select
                $('#Estado').removeAttr('disabled');
            }
        });
    });

    // Ajax para ciudades, me sirve para contacto y para los seleccionables de
    // distribuidores y talleres.

    $('#contacto,.seleccionables').on('change','#Estado',function(){

        var id = $('option:selected', this).attr('idEstado');

        $('#Ciudad').html('');
        $('#Ciudad').append('<option value="">Selecciona la ciudad</option>');

            $.ajax({
                data:   'accion=traerCiudad'+'&idmunicipio='+id,
                url:    '/wp-content/themes/Masesa-2016/class/Ajax.class.php',
                type:   'POST',
                dataType: 'json',
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                beforeSend: function (xhr) {
                    try{
                        //con esto compongo los acentos y agregue una linea al php header
                        xhr.overrideMimeType('text/html; charset=UTF-8');
                        //  $("#resultado").html("Procesando, espere por favor...").css("padding","3px").show();
                    }catch(e){
                    }
                },
                success:  function (response) {

                    for(var i=0;i<response.length;i++){
                        $('#Ciudad').append('<option idCiudad="'+response[i]['id_ciudad'] +'" value="'+response[i]['ciudad']+'">'+response[i]['ciudad']+'</option>');
                    }
                    // Habilito el Select
                    $('#Ciudad').removeAttr('disabled');
                }
            });

    });

    // Inteligencia sobre moto y pago

    // Imprimo listado de motos
    $('#Pago').before('\
        <select name="Motocicleta que te interesa" id="Moto" tabindex="9" required>\
            <option value="" selected="selected">Moto que te interesa</option>\
        </select>\
    ');

    $.ajax({
        data:   'accion=traerMotos',
        url:    '/wp-content/themes/Masesa-2016/class/Ajax.class.php',
        type:   'POST',
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        beforeSend: function (xhr) {
            try{
                //con esto compongo los acentos y agregue una linea al php header
                xhr.overrideMimeType('text/html; charset=UTF-8');
                //  $("#resultado").html("Procesando, espere por favor...").css("padding","3px").show();
            }catch(e){
            }
        },
        success:  function (response) {

            for(var i=0;i<response.length;i++){
                $('#Moto').append('<option value="'+response[i]['nombre']+'">'+response[i]['nombre']+'</option>');
            }
        }
    });

    // Boton enviar mensaje
    $('#btn-contacto').click(function(e){

        // Desabilito el funcionamiento del boton y lo dejo a merced mio ;)
        e.preventDefault();

        // Deshabilito el botÃ³n enviar
        $('#btn-contacto').attr("disabled","disabled");

        // Antes de hacer cualquier cosa compruebo que todos los campos se encuentren llenos
        var vacios = comprueba();

        // Si no encuentro campos vacios entonces continuo con el proceso
        if (vacios === 0){
            // Dependiendo del paÃ­s seleccionado puede venir Estado, Ciudad o hasta un campo
            // llamado OtroPais

            // Creo mi arreglo de datos dependiendo del asunto elegido

            var formData = {
                'Nombre'     :   $('input[name=Nombre]').val(),
                'Email'      :   $('input[name=Email]').val(),
                'Telefono'   :   $('input[name=Telefono]').val(),
                'Pais'       :   $('#Pais option:selected').val(),
                'Estado'     :   $('#Estado option:selected').val(),
                'Ciudad'     :   $('#Ciudad option:selected').val(),
                'Moto'       :   $('#Moto option:selected').val(),
                'Pago'       :   $('#Pago option:selected').val(),
                'Formulario' :   $('input[name=Formulario]').val(),
                'Navegador'  :   $.browser.name,
                'Navegador-ver': $.browser.version,
                'OS'         :   $.os.name
            };


            // Muestro pantalla opaca
            $('.opaco').show('slow');

            $.ajax({
                type     :'POST',
                url:    '/wp-content/themes/Masesa-2016/class/acciona.php',
                data     :formData,
                contentType: "application/x-www-form-urlencoded;charset=UTF-8",
                encode:true,
                beforeSend: function (xhr) {
                    try{
                        xhr.overrideMimeType('text/html; charset=UTF-8');
                    }catch(e){
                        // Nada
                    }
                },
                success:  function (){

                    // Oculto el loadeer
                    $('.loading').hide('slow');

                    // Borro el contenido de los campos
                    $('#contacto')[0].reset();

                    window.location.replace("http://masesa.com/cuandoarrancamos/gracias.html");

                    // Limpio los estilos para dejar el form con los fondos en $mensaje
                    limpioEstilos();

                    // Envio un disparador de evento a mi analytics
                    ga('send', 'event', 'Contacto web', 'Enviado', 'Mensaje de contacto', 0);


                },
                error:  function (){
                    // Imprimo mensaje de error

                    $mensaje = $('.respuesta');
                    //Limpio area
                    $mensaje.html('');
                    $mensaje.parent().removeClass('confirma');
                    $mensaje.parent().addClass('error');
                    $mensaje.append('Por favor intenta de nuevo, ha ocurrido un error y no hemos recibido su mensaje.');

                    // Habilito el botÃ³n por que hubo error
                    $('#btn-contacto').removeAttr('disabled');
                }
            });
        }else{

            // imprimo mensaje de error

            // Muestro pantalla ofuscada
            $('.opaco').show('slow');
            $('.loading').hide();
            $mensaje = $('.respuesta');

            // Limpio area de mensaje
            $mensaje.html('');
            $mensaje.parent().removeClass('confirma');
            $mensaje.parent().addClass('error');
            $mensaje.append('Por favor rellena los '+ vacios +' campos marcados con rojo ya que son obligatorios.');

            // Habilito el botÃ³n por que hubo error
            $('#btn-contacto').removeAttr('disabled');
        }
    });

    // Me sirve para traer los los distribuidores por ciudad

    
    $('#Distribuidores .seleccionables').on('change','#Ciudad',function(){

        var id = $('option:selected', this).attr('idCiudad');
        
        $.ajax({
            data:   'accion=traerSalas'+'&idciudad='+id,
            url:    '/wp-content/themes/Masesa-2016/class/Ajax.class.php',
            type:   'POST',
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            beforeSend: function (xhr) {
                try{
                    //con esto compongo los acentos y agregue una linea al php header
                    xhr.overrideMimeType('text/html; charset=UTF-8');
                    //  $("#resultado").html("Procesando, espere por favor...").css("padding","3px").show();
                }catch(e){
                }
            },
            success:  function (response) {
                $('#salida').html('');
                for(var i=0;i<response.length;i++){
                    $('#salida').append('\
                        <ul class="app-tab-agencias">\
                            <li class="app-agencia-info">\
                                <h3>DISTRIBUIDOR - ' + response[i]['nombre'] + '</h3>\
                                <p>\
                                    <strong>DirecciÃ³n: </strong>' + response[i]['direccion'] + '<br/><strong>TELS:  </strong>' + response[i]['tels'] + '<br/>\
                                </p>\
                                <div class="app-map-der">\
                                </div>\
                            </li>\
                        </ul>\
                    ');
                }
            }
        });
    });

    // Me sirve para traer los talleres por ciudad
    $('#Talleres-Autorizados .seleccionables').on('change','#Ciudad',function(){

        var id = $('option:selected', this).attr('idCiudad');
        
        $.ajax({
            data:   'accion=traerTalleres'+'&idciudad='+id,
            url:    '/wp-content/themes/Masesa-2016/class/Ajax.class.php',
            type:   'POST',
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded;charset=UTF-8",
            beforeSend: function (xhr) {
                try{
                    //con esto compongo los acentos y agregue una linea al php header
                    xhr.overrideMimeType('text/html; charset=UTF-8');
                    //  $("#resultado").html("Procesando, espere por favor...").css("padding","3px").show();
                }catch(e){
                }
            },
            success:  function (response) {
                $('#salida').html('');
                for(var i=0;i<response.length;i++){
                    $('#salida').append('\
                        <ul class="app-tab-agencias">\
                            <li class="app-agencia-info">\
                                <h3>TALLER - ' + response[i]['nombre'] + '</h3>\
                                <p>\
                                    <strong>DirecciÃ³n:</strong>' + response[i]['direccion'] + '<br/><strong>TELS: </strong>' + response[i]['tels'] + '<br/>\
                                </p>\
                                <div class="app-map-der">\
                                </div>\
                            </li>\
                        </ul>\
                    ');
                }
            }
        });
    });

    // Indicador para los acordeones en modo movile
    function toggleChevron(e) {
        $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    }
    $('#tabs-accordion').on('hidden.bs.collapse', toggleChevron);
    $('#tabs-accordion').on('shown.bs.collapse', toggleChevron);


// Media querys
    var mq = window.matchMedia ( "(min-width: 768px)");

    if (mq.matches){

        // Efecto menÃº para indicar en que pagina estamos
        function asignoMenu() {
            var path = window.location.pathname;
            path = path.replace(/\/$/, "");
            path = decodeURIComponent(path);

            $(".app-nav-menu > li > a").each(function () {
                var href = $(this).attr('href');

                if ( path.substring(0,href.length)+"/" === href) {
                    $(this).addClass('active');
                }

            });
        }

        // Buscador
        $( ".app-search" ).click(function() {
            $(this).addClass('orilla');

        });

        $( ".app-search" ).focusout(function(){
            $(this).removeClass('orilla');
        });

        /*******************************
         *   efecto cuadros marcas
        *******************************/
        var imgURL = '';

        $('.cuadro').hover(

            function(){

            // obtengo la url
            imgURL = $(this).children('img').attr('src');

            // modifico la url
            var posicion = imgURL.indexOf('-or.png');
            var nuevaUrl = imgURL.substring(0,posicion).concat('-bo.png');

            // cambio la url
            $(this).children('img').attr('src',nuevaUrl);


        }, function(){

            // cuando me muevo dejo la url original

            $(this).children('img').attr('src',imgURL);

        });

        // cuando es tablet activo la pestaÃ±a de GT
        $('.nav-tabs li:eq(0)').addClass('active');

        //console.time('loop');
        asignoMenu();
        //console.timeEnd('loop');
    }


});