var Chrono = function(id,IdActividadtracking){
    var target = {};
    var isRunning = false;
    var timer;    
    
      var time = {
        hour: document.querySelectorAll(id + " .chrono-hour")[0].innerHTML,
         minute: document.querySelectorAll(id + " .chrono-minute")[0].innerHTML,
         second: document.querySelectorAll(id + " .chrono-second")[0].innerHTML
    };
    

    
    function start(){
        timer = setInterval(function(){
            // seconds
            time.second++;
            if(time.second >= 60)
            {
                time.second = 0;
                time.minute++;
            }      

            // minutes
            if(time.minute >= 60)
            {
                time.minute = 0;
                time.hour++;
            } 
        

            var h = target.hour.innerHTML;
            var m = target.minute.innerHTML;
            var s = target.second.innerHTML;
            var h1 = h.lenght;
           target.hour.innerHTML = target.hour.innerHTML.lenght < 2 ? ( time.hour < 10 ? '0' + time.hour : time.hour) : time.hour;
           target.minute.innerHTML = target.minute.innerHTML.lenght <2 ? ( time.minute < 10 ? '0' + time.minute : time.minute) :  time.minute;
           target.second.innerHTML =  target.second.innerHTML.lenght < 2 ? (time.second < 10 ? '0' + time.second : time.second) :time.second ;
           
			localStorage.setItem('timer_' + id , (time.hour < 10 ? '0' + time.hour : time.hour) + ':' + (time.minute < 10 ? '0' + time.minute : time.minute) + ':' + (time.second < 10 ? '0' + time.second : time.second) );
            
            isRunning = true;
        }, 1000);

    }
    
    function stop()
    {
        isRunning = false;
        clearInterval(timer);
        GuardarActividadTracking(IdActividadtracking, time)
    }
    
    function init(id){
        target = {
            hour: document.querySelectorAll(id + " .chrono-hour")[0],
            minute: document.querySelectorAll(id + " .chrono-minute")[0],
            second: document.querySelectorAll(id + " .chrono-second")[0],
        };
        
        var _btnStart = document.querySelectorAll(id + " .chrono-start")[0];
        
        _btnStart.addEventListener('click', function(){
            if(!isRunning) {
                _btnStart.innerHTML = 'Detener';
                _btnStart.classList.remove('btn-success');
                _btnStart.classList.add('btn-danger');
                start();
            }
            else {
                _btnStart.innerHTML = 'Continuar';
                _btnStart.classList.add('btn-success');
                _btnStart.classList.remove('btn-danger');
                stop();
            }
        })
    }
    
   init(id);
};



var ChronoDefecto = function(id){
    var target = {};
    var isRunning = false;
    var timer;    

    function start(){


        timer = setInterval(function(){


            // seconds
            timerdefecto.second++;
            if(timerdefecto.second >= 60)
            {
                timerdefecto.second = 0;
                timerdefecto.minute++;
            }      

            // minutes
            if(timerdefecto.minute >= 60)
            {
                timerdefecto.minute = 0;
                timerdefecto.hour++;
            } 
        

            var h = target.hour.innerHTML;
            var m = target.minute.innerHTML;
            var s = target.second.innerHTML;
            var h1 = h.lenght;
           target.hour.innerHTML = target.hour.innerHTML.lenght < 2 ? ( timerdefecto.hour < 10 ? '0' + timerdefecto.hour : timerdefecto.hour) : timerdefecto.hour;
           target.minute.innerHTML = target.minute.innerHTML.lenght <2 ? ( timerdefecto.minute < 10 ? '0' + timerdefecto.minute : timerdefecto.minute) :  timerdefecto.minute;
           target.second.innerHTML =  target.second.innerHTML.lenght < 2 ? (timerdefecto.second < 10 ? '0' + timerdefecto.second : timerdefecto.second) :timerdefecto.second ;
            
            isRunning = true;
        }, 1000);
        $("#BtnGuardarDefecto").hide();
        event.preventDefault();
    }
    
    function stop()
    {
        isRunning = false;
        clearInterval(timer);
        $("#BtnGuardarDefecto").show();
        event.preventDefault();


    }
    
    function init(id){
        target = {
            hour: document.querySelectorAll("#chrono-defecto" + " .chrono-hour")[0],
            minute: document.querySelectorAll("#chrono-defecto"  + " .chrono-minute")[0],
            second: document.querySelectorAll("#chrono-defecto"  + " .chrono-second")[0],
        };
        
        var _btnStart = document.querySelectorAll("#chrono-defecto"  + " .chrono-start")[0];
        
        _btnStart.addEventListener('click', function(){
            if(!isRunning) {
                _btnStart.innerHTML = 'Detener';
                _btnStart.classList.remove('btn-success');
                _btnStart.classList.add('btn-danger');
                start();
            }
            else {
                _btnStart.innerHTML = 'Continuar';
                _btnStart.classList.add('btn-success');
                _btnStart.classList.remove('btn-danger');
                stop();
            }
        })

         event.preventDefault();
    }
    
   init(id);
return false;
};



