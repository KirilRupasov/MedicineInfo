$( document ).ready(function() {
    var counter = 65;
    var i = setInterval(function(){
        // do your thing
        $.ajax("https://www.lemonrock.com/allbands.php?_start="+String.fromCharCode(counter), {
            success: function(data) {
                var even = $(data).find('.mp3even');
                var odd = $(data).find('.mp3odd');

                $.each(even, function( i, l ) {
                    var h = $("a",l).attr('href');
                    $.ajax("https://www.lemonrock.com/"+h, {
                        success: function(data2) {
                            //var email = $('.contactdet tr:eq(4) td:eq(1)').innerHTML;
                            var email = $(data2).find('.contactdet')[0].rows[4].cells[1].innerHTML;
                            $('#emailLists').append(h + "," + email + "<br>");
                            window.scrollBy(0, 100);
                        },
                        error: function() {
                        }
                    });




                });

                $.each(odd, function( i, l ) {
                    var h = $("a",l).attr('href');
                    $.ajax("https://www.lemonrock.com/"+h, {
                        success: function(data2) {
                            //var email = $('.contactdet tr:eq(4) td:eq(1)').innerHTML;
                            var email = $(data2).find('.contactdet')[0].rows[4].cells[1].innerHTML;
                            $('#emailLists').append(h + "," + email + "<br>");
                            window.scrollBy(0, 100);
                        },
                        error: function() {
                        }
                    });

                });

                //var email = $(data).find('#email').val();
                //var bandName = $(data).find('#ModalLabel').text();
                //bandName = bandName.substr(18);




            },
            error: function() {
            }
        });
        counter++;
        if(counter === 91) {
            clearInterval(i);
        }
    }, 50000);

});