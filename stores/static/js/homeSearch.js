/*
homeSearch.js
Authors: Lautaro Villalon
         Yarima Luciani

Contains ajax functions that use the Buscamed API rest to find medicines
*/

var user = "buscamedvzla"
var mail = "gmail"
var existsWeb1 = 0;
var existsWeb2 = 0;


function toggleTweets() {
  $('#tweetBox').toggle();

  var tweetMin = $('#tweetsToggle');

  if (tweetMin.hasClass("fa-minus")) {
    tweetMin.removeClass("fa-minus");
    tweetMin.addClass("fa-plus");
  }
  else if (tweetMin.hasClass("fa-plus")) {
    tweetMin.removeClass("fa-plus");
    tweetMin.addClass("fa-minus");
  }
}

function toggleWeb() {
  $('#webBox').toggle();

  var webMin = $('#webToggle');

  if (webMin.hasClass("fa-minus")) {
    webMin.removeClass("fa-minus");
    webMin.addClass("fa-plus");
  }
  else if (webMin.hasClass("fa-plus")) {
    webMin.removeClass("fa-plus");
    webMin.addClass("fa-minus");
  }
}


function startSearch() {
  var med = $('#searchBox').val();
  if (med == '') return;

  var resultsDiv = $('#results');

  $('#tweetBox').html("");
  $('#webBox').html("");
  $('#tweetLoading').show();
  $('#webLoading').show();
  existsWeb1 = 0;
  existsWeb2 = 0;

  if (!resultsDiv.is(':visible')) {
    resultsDiv.css('display', 'flex');
  }

  ajaxBuscamedTweets(med);

  ajaxBuscamedStores(med);
  ajaxBuscamedWeb(med);
}

function ajaxBuscamedTweets(med) {
  $.ajax({
          url: "http://buscamed.herokuapp.com/rest/tweets/?med="+med,
          type: "GET",

          contentType: 'application/json; charset=utf-8',
          success: function(data) {
            console.log(data);

            $('#tweetLoading').hide();

            if (data.length == 0) {
              $('#tweetBox').html("<p>No se consiguieron resultados</p><p>Si crees que esto es un error, contáctanos a <b>"+user+"@"+mail+".com</b></p>");
            }
            data.forEach( function(tweet) {
              console.log(tweet);

              var html = ajaxTwitter(tweet.link);
            });
          },
          error : function(jqXHR, textStatus, errorThrown) {
            $('#tweetBox').html("<p>Ha ocurrido un error</p><p>Por favor contáctanos a <b>"+user+"@"+mail+".com</b></p>");

          },

          timeout: 12000000,
      });
}

function ajaxTwitter(tweetUrl) {
  $.ajax({
          url: "https://publish.twitter.com/oembed?url="+tweetUrl,
          type: "GET",
          dataType: 'jsonp',
          contentType: 'application/json; charset=utf-8',

          success: function(data) {

            $('#tweetBox').append(data.html);
            return data.html;
          },
          error : function(jqXHR, textStatus, errorThrown) {

            $('#tweetBox').append("<p>No se puede acceder al Twitter embed API para este Tweet.</b></p>")
          },

          timeout: 1200000,
      });
}

function ajaxBuscamedWeb(med) {
  $.ajax({
          url: "http://buscamed.herokuapp.com/rest/web/?med="+med,
          type: "GET",

          contentType: 'application/json; charset=utf-8',
          success: function(data) {

            if (data.length == 0) {
              existsWeb1 = -1;
            }
            else {
              existsWeb1 = 1;
            }

            data.forEach( function(store) {
              var html = htmlForWeb(store);
              $('#webBox').append(html);
            });


            if (existsWeb1 < 0 && existsWeb2 < 0) {
              $('#webLoading').hide();
              $('#webBox').html("<p>No se consiguieron resultados</p><p>Si crees que esto es un error, contáctanos a <b>"+user+"@"+mail+".com</b></p>");
            }
            else if (existsWeb1 != 0 && existsWeb2 != 0) {
              $('#webLoading').hide();
            }
          },
          error : function(jqXHR, textStatus, errorThrown) {
            $('#webBox').html("<p>Ha ocurrido un error</p><p>Por favor contáctanos a <b>"+user+"@"+mail+".com</b></p>");
          },

          timeout: 12000000,
      });
}

function htmlForWeb(store) {
  var html = '<div class="card mb-3" style="margin: 10px; max-width: 100%;"><div class="card-header"><b>';

  html += store.farmacia + '</b></br>';
  html += store.sede + '</div><ul class="list-group list-group-flush">';

  store.productos.forEach( function(producto) {
    if (producto.disponibles != "Si") {
      html += '<li class="list-group-item">'+producto.nombre+': '+producto.disponibles.toString()+' disponibles.'+'</li>';
    }
    else {
      html += '<li class="list-group-item">'+producto.nombre+': Disponible.'+'</li>';
    }
  });

  html += '</ul></div>';

  return html;
}

function ajaxBuscamedStores(med) {
  $.ajax({
          url: "http://buscamed.herokuapp.com/rest/stores/?med="+med,
          type: "GET",

          contentType: 'application/json; charset=utf-8',
          success: function(data) {

            if (data.length == 0) {
              existsWeb2 = -1;
            } 
            else {
              existsWeb2 = 1;
            }

            data.forEach( function(store) {
              var html = htmlForStores(store);
              $('#webBox').append(html);
            });


            if (existsWeb1 < 0 && existsWeb2 < 0) {
              $('#webLoading').hide();
              $('#webBox').html("<p>No se consiguieron resultados</p><p>Si crees que esto es un error, contáctanos a <b>"+user+"@"+mail+".com</b></p>");
            }

            else if (existsWeb1 != 0 && existsWeb2 != 0) {
              $('#webLoading').hide();
            }
          },
          error : function(jqXHR, textStatus, errorThrown) {
          },

          timeout: 12000000,
      });
}

function htmlForStores(store) {
  var html = '<div class="card mb-3" style="margin: 10px; max-width: 100%;"><div class="card-header"><b>';

  html += store.tienda.nombre + '</b></br>';
  html += store.tienda.direccion + '</div><ul class="list-group list-group-flush">';


  html += '<li class="list-group-item">'+store.producto.medicina.nombre+' '+store.producto.presentacion+': '+store.disponibilidad.toString()+' disponibles.'+'</li>';

  html += '</ul><p class="card-text"><small class="text-muted">Actualizado el: '+store.fechaDeIngreso.split("T")[0]+'</small></p></div>';

  return html;
}