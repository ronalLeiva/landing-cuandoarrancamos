$(document).ready(function(){

    // Efecto

    window.sr = ScrollReveal();
    sr.reveal('.my-row');
    sr.reveal('.app-marcas');
    sr.reveal('.app-secciones');

    // Carrusel

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

            // Habilito el botón que asumo esta deshabilitado
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

            // Creo campo para que teclen el nombre del país
            $('#Pais').after('\
                <input type="text" name="OtroPais" id="OtroPais" tabindex="6" placeholder="Nombre del país" required autocomplete="off">\
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

        // Limpio el select y le agrego el mensaje de acción
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

    // Inteligencia sobre asunto
    $('#Asunto').change(function(){

        // Si ya existe creado el nodo lo elimino
        $('#Moto').remove();
        $('#Accesorio').remove();
        $('#Reclamo').remove();
        $('#Pago').remove();

        var asunto = $('#Asunto option:selected').val();

        // Si se selecciona moto nueva o moto usada
        if(asunto === 'Moto nueva' || asunto === 'Moto usada'){

            // Llevo control del tipo que se selecciona
            tipoAsunto = asunto;

            // Imprimo listado de motos
            $('#Asunto').after('\
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
            // Imprimo opción de pago
            $('#Moto').after('\
                <select name="Forma de Pago que te interesa" id="Pago" tabindex="10" required>\
                    <option value="" selected="selected">Forma de pago que te interesa</option>\
                    <option value="Crédito">Crédito</option>\
                    <option value="Contado">Contado</option>\
                </select>\
            ');

        };

        // Si se selecciona Accesorios
        if(asunto === 'Accesorio'){

            // Llevo control del tipo que se selecciona
            tipoAsunto = asunto;

            // Imprimo listado de accesorios
            $('#Asunto').after('\
                <select name="Accesorio" id="Accesorio" tabindex="9" required>\
                    <option value="">¿Qué tipo de accesorio te interesa?</option>\
                    <option value="Casco">Casco</option>\
                    <option value="Chumpa">Chumpa / Chaqueta</option>\
                    <option value="Guantes">Guantes</option>\
                    <option value="Ropa">Ropa</option>\
                    <option value="Candado">Candado</option>\
                    <option value="Otro">Otro</option>\
                </select>\
            ');
        }

        // Si se selecciona Reclamo
        if(asunto === 'Reclamo'){

            // Llevo control del tipo que se selecciona
            tipoAsunto = asunto;

            // Imprimo listado de accesorios
            $('#Asunto').after('\
                <select name="Reclamo" id="Reclamo" required>\
                    <option value="">Dirije el reclamo a:</option>\
                    <option value="Taller">Talleres</option>\
                    <option value="Ventas">Ventas</option>\
                    <option value="Garantía">Garantías</option>\
                    <option value="SAC">Servicio al cliente</option>\
                    <option value="Distribuidor">Distribuidores</option>\
                    <option value="Placas">Placas</option>\
                    <option value="Repuestos">Repuestos</option>\
                    <option value="Otros">Otros</option>\
                </select>\
            ');
        }
    });

    // Boton enviar mensaje
    $('#btn-contacto').click(function(e){

        // Desabilito el funcionamiento del boton y lo dejo a merced mio ;)
        e.preventDefault();

        // Deshabilito el botón enviar
        $('#btn-contacto').attr("disabled","disabled");

        // Antes de hacer cualquier cosa compruebo que todos los campos se encuentren llenos
        var vacios = comprueba();

        // Si no encuentro campos vacios entonces continuo con el proceso
        if (vacios === 0){
            // Dependiendo del país seleccionado puede venir Estado, Ciudad o hasta un campo
            // llamado OtroPais

            var paisSelec   = $('#Pais option:selected').val();
            var envioPais   = '';
            var envioEstado = undefined;
            var envioCiudad = undefined;

            if (paisSelec === 'Otro'){

                envioPais   = $('#OtroPais').val();

            }else{

                envioPais   = paisSelec;
                envioEstado = $('#Estado option:selected').val();
                envioCiudad = $('#Ciudad option:selected').val();

            }

            // Creo mi arreglo de datos dependiendo del asunto elegido

            if(tipoAsunto === 'Moto nueva' || tipoAsunto === 'Moto usada'){

                var formData = {
                    'Nombre'     :   $('input[name=Nombre]').val(),
                    'Apellido'   :   $('input[name=Apellido]').val(),
                    'Email'      :   $('input[name=Email]').val(),
                    'Telefono'   :   $('input[name=Telefono]').val(),
                    'Pais'       :   envioPais,
                    'Estado'     :   envioEstado,
                    'Ciudad'     :   envioCiudad,
                    'Asunto'     :   $('#Asunto option:selected').val(),
                    'Moto'       :   $('#Moto option:selected').val(),
                    'Pago'       :   $('#Pago option:selected').val(),
                    'Comentarios':   $('#Comentarios').val(),
                    'Formulario' :   $('input[name=Formulario]').val(),
                    'Navegador'  :   $.browser.name,
                    'Navegador-ver': $.browser.version,
                    'OS'         :   $.os.name
                };

            }else if (tipoAsunto === 'Accesorio'){

                var formData = {
                    'Nombre'     :   $('input[name=Nombre]').val(),
                    'Apellido'   :   $('input[name=Apellido]').val(),
                    'Email'      :   $('input[name=Email]').val(),
                    'Telefono'   :   $('input[name=Telefono]').val(),
                    'Pais'       :   envioPais,
                    'Estado'     :   envioEstado,
                    'Ciudad'     :   envioCiudad,
                    'Asunto'     :   $('#Asunto option:selected').val(),
                    'Accesorio'  :   $('#Accesorio option:selected').val(),
                    'Comentarios':   $('#Comentarios').val(),
                    'Formulario' :   $('input[name=Formulario]').val(),
                    'Navegador'  :   $.browser.name,
                    'Navegador-ver': $.browser.version,
                    'OS'         :   $.os.name
                };

            }else if (tipoAsunto === 'Reclamo'){

                var formData = {
                    'Nombre'     :   $('input[name=Nombre]').val(),
                    'Apellido'   :   $('input[name=Apellido]').val(),
                    'Email'      :   $('input[name=Email]').val(),
                    'Telefono'   :   $('input[name=Telefono]').val(),
                    'Pais'       :   envioPais,
                    'Estado'     :   envioEstado,
                    'Ciudad'     :   envioCiudad,
                    'Asunto'     :   $('#Asunto option:selected').val(),
                    'Reclamo'    :   $('#Reclamo option:selected').val(),
                    'Comentarios':   $('#Comentarios').val(),
                    'Formulario' :   $('input[name=Formulario]').val(),
                    'Navegador'  :   $.browser.name,
                    'Navegador-ver': $.browser.version,
                    'OS'         :   $.os.name
                };

            }else{

                var formData = {
                    'Nombre'     :   $('input[name=Nombre]').val(),
                    'Apellido'   :   $('input[name=Apellido]').val(),
                    'Email'      :   $('input[name=Email]').val(),
                    'Telefono'   :   $('input[name=Telefono]').val(),
                    'Pais'       :   envioPais,
                    'Estado'     :   envioEstado,
                    'Ciudad'     :   envioCiudad,
                    'Asunto'     :   $('#Asunto option:selected').val(),
                    'Comentarios':   $('#Comentarios').val(),
                    'Formulario' :   $('input[name=Formulario]').val(),
                    'Navegador'  :   $.browser.name,
                    'Navegador-ver': $.browser.version,
                    'OS'         :   $.os.name
                };

            }


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

                    // Imprimo mensaje de éxito
                    $mensaje = $('.respuesta');

                    // Limpio area de mensaje
                    $mensaje.html('');
                    $mensaje.parent().removeClass('error');
                    $mensaje.parent().addClass('confirma');
                    $mensaje.append('Hemos recibido tu mensaje.');

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

                    // Habilito el botón por que hubo error
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

            // Habilito el botón por que hubo error
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
                                    <strong>Dirección: </strong>' + response[i]['direccion'] + '<br/><strong>TELS:  </strong>' + response[i]['tels'] + '<br/>\
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
                                    <strong>Dirección:</strong>' + response[i]['direccion'] + '<br/><strong>TELS: </strong>' + response[i]['tels'] + '<br/>\
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

        // Efecto menú para indicar en que pagina estamos
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

        // cuando es tablet activo la pestaña de GT
        $('.nav-tabs li:eq(0)').addClass('active');

        //console.time('loop');
        asignoMenu();
        //console.timeEnd('loop');
    }


});