Requests = new Meteor.Collection("requests");
Responses = new Meteor.Collection("responses");
Maps = new Meteor.Collection("maps");

if (Meteor.isClient) {
    Meteor.subscribe("all-terms");
    
    Template.collect_request.prompt = function() {
        return _.sample([
            "Saki recently went sightseeing in Washington D.C. with some friends. They took lots of pictures and put them into a shared Dropbox folder."
                ]);
    };

    Template.collect_request.request = function() {
        return Requests.findOne(Session.get("request_id"));
    };
    
    Template.show_request.request = function() {
        return Requests.findOne(Session.get("request_id"));
    };

    Template.show_request.responses = function() {
        return Responses.find({"request_id":Session.get("request_id")});
    };

    Template.list_requests.num_requests = function() {
        return Requests.find().count();
    };

    Template.list_requests.requests = function() {
        return Requests.find();
    };

    Template.list_requests.events({
        'click button':function(){
            Meteor.Router.to("/request")
        }
    });
    
    Template.collect_request.events({
        "click .program .response": function(evt, template) {
            $(template.find('.program .response')).html("");
        },
        "click .natural .response": function(evt, template) {
            $(template.find('.natural .response')).html("");
        },
        "click button": function(evt, template) {
            Responses.insert({
                request_id: Session.get("request_id"), 
                program: $(template.find('.program .response')).html(),
                natural_lang: $(template.find('.natural .response')).html()
            });
            Meteor.Router.to("/");
        }
    });
    
    Template.request.events({
        "click button": function(evt, template) {
            Requests.insert({
                text: template.find('textarea').value,
                title: template.find('input').value
            });
            Meteor.Router.to('/');
        }
    });

    Meteor.Router.add({
        "/":"list_requests",
        "/collect/:id": function(id) {
            Session.set('request_id',id);
            return 'collect_request';
        },
        "/show/:id": function(id) {
            Session.set('request_id',id);
            return 'show_request';
        },
        "/request":"request"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.publish("all-maps", function() {
        return Maps.find();
    });
    Meteor.publish("all-requests", function() {
        return Requests.find();
    });
    Meteor.publish("all-responses", function() {
        return Responses.find();
    });
  });
}
