/* globals options, DayPicker, Day, Options $ */

$(function(){
  $.get('/days')
    .then(function(days){
      var map = new Map('map');
      var idx = 0;


      //function which renders options
      function renderOptions(){
        Options({
          id: '#options',
          day: days[idx],
          options: options,
          addItem: function(obj){
            //only one hotel please.
            if(obj.key === 'hotels' && days[idx].hotels.length === 1){
              return;
            }
            var item = options[obj.key].find(function(item){
              return item.id === obj.id;
            });

            $.post(`/days/${days[idx].id}/${obj.key}/${item.id}`)
            .then( createdItem => {
              days[idx][obj.key].push(createdItem);
              renderDayAndOptions();
            })

          }
        });
      }

      //function which renders our day  picker
      function renderDayPicker(){
        var addDay = function(){
          $.post('/days')
            .then(function(day){
                days.push({
                  id: day.id,
                  hotels: [],
                  restaurants: [],
                  activities: [],
                });
                idx = days.length - 1;
                renderDayPicker();
            });
        }

        var removeDay = function(){
          if(days.length === 1){
            return;
          }

          $.ajax({
            url: `/days/${idx}`,
            type: 'DELETE',
            success: function(){
              days = days.filter(function(day, _idx){
                return _idx !== idx;
              });
              idx = 0;
              renderDayPicker();
            }
          })

        }

        var selectDay = function(_idx){
          idx = _idx;
          renderDayPicker();
        }

        DayPicker({
          id: '#dayPicker',
          days: days,
          idx: idx,
          addDay,
          removeDay,
          selectDay
        });
        renderDayAndOptions();
      }

      function renderDayAndOptions(){
        map.setMarkers(days[idx]);
        renderDay();
        renderOptions();
      }

      //this function render day
      function renderDay(){
        var onRemoveItem = function(obj){
          days[idx][obj.key] = days[idx][obj.key].filter(function(item){
            return item.id !== obj.id;
          });

          $.ajax({
            url: `/days/${days[idx].id}/${obj.key}/${obj.id}`,
            type: 'DELETE',
            success: function(){
              renderDayAndOptions();

            }
          })
        }
        Day({
          id: '#day',
          day: days[idx],
          options,
          onRemoveItem
        });
      }

      renderDayPicker();

    })


});
