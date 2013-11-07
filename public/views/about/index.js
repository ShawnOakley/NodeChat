/* global app:true, io:false */

var socket;

(function() {
  'use strict';

  var addChatMessage = function(data) {
    $('<div/>', { text: data }).appendTo('#chatBox');
    $("#chatBox").animate({ scrollTop: $('#chatBox')[0].scrollHeight}, 500);
  };

  socket = io.connect();
  socket.on('connect', function() {
    socket.emit('/about/#join');
    addChatMessage('you joined the chat room');
  });
  socket.on('/about/#newVisitor', function(visitor) {
    addChatMessage(visitor +': joined');
  });
  socket.on('/about/#incoming', function(visitor, message) {
    addChatMessage(visitor +': '+ message);
  });

  app = app || {};

  app.ChatForm = Backbone.View.extend({
    el: '#chatForm',
    template: _.template( $('#tmpl-chatForm').html() ),
    events: {
      'submit form': 'preventSubmit',
      'click .btn-chat': 'chat'
    },
    initialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html(this.template());
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    chat: function() {
      var newMessage = this.$el.find('[name="message"]').val();
      if (newMessage) {
        addChatMessage('me : '+ newMessage);
        socket.emit('/about/#send', newMessage);
        this.$el.find('[name="message"]').val('');
      }
    }
  });

  $(document).ready(function() {
    app.chatForm = new app.ChatForm();
  });
}());