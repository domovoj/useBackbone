var Controller = Backbone.Router.extend({
    initialize: function(){
      console.log(arguments)  
    },
    routes: {
        "": "start", // Пустой hash-тэг
        "!/": "start", // Начальная страница
        "!/success": "success", // Блок удачи
        "!/error": "error" // Блок ошибки
    },
    start: function () {
        appState.set({state: "start"});
    },
    success: function () {
        appState.set({state: "success"});
    },
    error: function () {
        appState.set({state: "error"});
    }
});
var AppState = Backbone.Model.extend({
    defaults: {
        username: "",
        state: "start"
    }
});

var UserNameModel = Backbone.Model.extend({// Модель пользователя
    url: '/games/data',
    defaults: {
        "Name": ""
    }
});
var Family = Backbone.Collection.extend({// Коллекция пользователей
    model: UserNameModel,
    checkUser: function (username) { // Проверка пользователя
        var findResult = this.find(function (user) {
            return user.get("Name") == username
        });
        return findResult != null;
    }
});
var MyFamily = new Family([// Моя семья
    {Name: "Саша"},
    {Name: "Юля"},
    {Name: "Елизар"}
]);
var appState = new AppState();

var Block = Backbone.View.extend({
    el: "#block", // DOM элемент widget'а

    initialize: function () { // Подписка на событие модели
        this.model.on('change', this.render, this);
    },
    templates: {// Шаблоны на разное состояние
        "start": _.template($('#start').html()),
        "success": _.template($('#success').html()),
        "error": _.template($('#error').html())
    },
    events: {
        "click input:button": "check" // Обработчик клика на кнопке "Проверить"
    },
    check: function () {
        var username = this.$("input:text").val();
        var find = MyFamily.checkUser(username); // Проверка имени пользователя
        appState.set({// Сохранение имени пользователя и состояния
            "state": find ? "success" : "error",
            "username": username
        });
    },
    render: function () {
        var state = this.model.get("state");
        console.log(state+'2')
        $(this.el).html(this.templates[state](this.model.toJSON()));
        return this;
    }
});

var block = new Block({model: appState});
appState.trigger("change");

appState.on("change:state", function () { // подписка на смену состояния для контроллера
    var state = this.get("state");
    console.log(state+'1')
    if (state == "start")
        controller.navigate("!/", false); // false потому, что нам не надо 
    // вызывать обработчик у Router
    else
        controller.navigate("!/" + state, false);
});


var controller = new Controller({a: 2}); // Создаём контроллер {a: 2} - попадає в initialize

Backbone.history.start();  // Запускаем HTML5 History push 

controller.start();