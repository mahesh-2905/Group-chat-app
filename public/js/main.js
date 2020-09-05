$('document').ready(function(){
    var socket = io.connect();

    var nick_form = $('#NickForm');
    var chat_room = $('#chat-room');
    var welcome = $('#login');
    var title = "unknown" ;    
    chat_room.hide();

    nick_form.submit(function(e){
       e.preventDefault();
       var nick_val = $('#nickname').val();
       title = nick_val;
       if(nick_val == ''){
        $('#name_err').html('Please enter your awesome nick name.').css({
            "border":"2px solid rgba(255, 49, 49, 0.89)",
            "background":"rgba(238, 110, 110, 0.767)",
            "color":"rgb(255, 80, 49)",
            "padding-top":"7px",
            "padding-bottom":"7px",
            "padding-left":"10px",
            "padding-right":"10px",
            "border-radius":"6px",
            "margin-top":"5px",
            "margin-bottom":"5px"
        });
       }
       else{
        socket.emit('new-user',nick_val,function(callback){
            if(callback){
                document.title = title;
                $('#user_name').html(nick_val);
                chat_room.show();
                welcome.hide();
            }else{
              $('#name_err').html('Sorry, Username already taken!, try something else').css({
                  "border":"2px solid rgba(255, 49, 49, 0.89)",
                  "background":"rgba(238, 110, 110, 0.767)",
                  "color":"rgb(255, 80, 49)",
                  "padding-top":"7px",
                  "padding-bottom":"7px",
                  "padding-left":"10px",
                  "padding-right":"10px",
                  "border-radius":"6px",
                  "margin-top":"5px",
                  "margin-bottom":"5px"
              });
            }
         });
       }
      
    });
    socket.on('usernames',function(names){
        var html = '<ul class="list-group list-group-flush">';
        for( i=0 ; i<names.length ; i++){
            html += '<li class="list-group-item "><p class="pl-5 pr-5"><i class="icofont-user-alt-4 mr-2"></i>'+ names[i] +'</p></li>';
        }
        html += '</ul>';
        $('.online_users').html(html);
    });

    $('#user_message').submit(function(e){
        e.preventDefault();
        // console.log("submit");
        var msg = $('#message').val();
        if(msg == ''){

        }
        else{
            socket.emit('send_message',msg,function(data){

            });
        }
       
    });
    socket.on('message_sent',function(data){
        if(data.name === title){
            $('#chat_box').append('<p class="d-flex justify-content-end"><b>'+ data.name + ': </b>' + data.msg + '</p>' )
        }
        else{
            console.log("out");
            $('#chat_box').append('<p class="d-flex justify-content-start"><b>'+ data.name + ': </b>' + data.msg + '</p>' )
        }
    })
})