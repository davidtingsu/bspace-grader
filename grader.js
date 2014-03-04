(function(){
    _isArray = function(){ return Object.prototype.toString.call(arguments[0]) === "[object Array]" }
    var $ = document.querySelectorAll.bind(document); //http://blog.adtile.me/2014/01/16/a-dive-into-plain-javascript
    Element.prototype.on = Element.prototype.addEventListener;
    var removeClass = function(el, cls){
        var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        el.className.replace(reg, "").replace(/(^\s*)|(\s*$)/,"");
    }
    function Table(){
        var _table =  document.createElement('table');
        _table.class = "pull-right"
        var _tableBody  = document.createElement("tbody");
        _table.appendChild(_tableBody);
        var _numRows = 0;
        var _numColumns = 0;
        return {
            reset : function(){ _tableBody.innerHTML = ''; },
            addRow : function(){
                var tr = document.createElement('tr');
                if ( arguments.length === 1 && _isArray(arguments[0]) ){
                    for( var i = 0; i < arguments[0].length; i++){
                        var td = document.createElement('td');
                        td.innerText = arguments[0][i];
                        tr.appendChild(td);
                    }
                    _tableBody.appendChild(tr);
                }
            },
            print : function(){
                $('.main')[0].appendChild(_table);
            }
        }
    }

    Table.prototype = new Table();
    Table.constructor = Table;

    var App = { }
    App.table = new Table();

    var dashboard = $('.dashboard')[0];
    var addRule = (function(style){ //http://stackoverflow.com/a/7330454/1123985
        var sheet = document.head.appendChild(style).sheet;
        return function(selector, css){
            var propText = Object.keys(css).map(function(p){
                return p+":"+css[p]
            }).join(";");
            sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
        }
    })(document.createElement("style"));
    function renderGrade(percent){
        if (! isNaN(percent) ){
            var grade;
            if ( percent < 1 && percent > 0.9){
                grade = 'A';
            } else if ( percent < 0.9  && percent > 0.8 ) {
                grade = 'B';
            } else if ( percent < 0.8  && percent > 0.7) {
                grade = 'C';
            } else if ( percent < 0.7  && percent > 0.6) {
                grade = 'D';
            } else if ( percent < 0.6) {
                grade = 'F';
            }
            var digit = parseInt((percent * 100)) % 10, intensifier='';
            if ( digit >= 8 ){
                intensifier = '+';
            } else if ( digit <= 3 ){
                intensifier = '-';
            }
            $('.grade')[0].className = "grade grade-" + grade.toLowerCase();

            addRule(".grade:after", {
                content: "'" + (grade + (grade !== 'F' ? intensifier + ' ' : ' ')) + (Math.round(100 * 100 * percent) / 100) + "%" + "'"
            });
        } else {
            $('.grade')[0].className = "grade";
            addRule('.grade:after', {
                content: "''",
            });

        }
    }


    App.table.print();
    dashboard.on('change',
                 function(e){
                     var span = document.createElement('span');
                     span.innerHTML =  e.target.value;
                     var string  = e.target.value, reg = /([0-9]+\.?[0-9]*)\/([0-9]+)/g, found;
                     var rows = e.target.value.split(/\n+/);
                     App.table.reset();
                     for ( var i = 0 ; i < rows.length; i++ ){
                         var row = rows[i].split(/\t+/);
                         App.table.addRow(row);
                     }
                     var  numerator = 0, denominator = 0;
                     while (found =  reg.exec(string)){
                         numerator += parseFloat(found[1]);
                         denominator += parseFloat(found[2]);
                     }
                     renderGrade(numerator/denominator);
                 }
    , false)
})()
