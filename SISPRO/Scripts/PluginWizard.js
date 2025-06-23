        // Start Smart Wizard
        var uiSmartWizard = function(){
            
            if($(".wizard").length > 0){
                
                //Check count of steps in each wizard
                $(".wizard > ul").each(function(){
                    $(this).addClass("steps_"+$(this).children("li").length);
                });//end
                
                // This par of code used for example
                if($("#wizard-validation").length > 0){
                    
                    var validator = $("#wizard-validation").validate({
                            rules: {
                                login: {
                                    required: true,
                                    minlength: 2,
                                    maxlength: 8
                                },
                                password: {
                                    required: true,
                                    minlength: 5,
                                    maxlength: 10
                                },
                                repassword: {
                                    required: true,
                                    minlength: 5,
                                    maxlength: 10,
                                    equalTo: "#password"
                                },
                                email: {
                                    required: true,
                                    email: true
                                },
                                name: {
                                    required: true,
                                    maxlength: 10
                                },
                                adress: {
                                    required: true
                                }
                            }
                        });
                        
                }// End of example
                
                $(".wizard").smartWizard({                        
                    // This part of code can be removed FROM

                    selected: 0,

                    enableAllSteps: true,
                    enableFinishButton: false,
                    labelNext: 'Siguiente', // label for Next button
                    labelPrevious: 'Anterior', // label for Previous button
                    labelFinish: '',

                    includeFinishButton: false,
                  /*  onLeaveStep: PasoSiguiente,*/
                    onShowStep: function(obj){                        
                        var wizard = obj.parents(".wizard");

                        //if (obj.hasClass("hide")){
                        //         obj.parents(".wizard").find(".actionBar .btn-primary").css("display","block");

                        //return true;
                        //}
                              
                        //if(wizard.hasClass("show-submit")){
                        
                            //var step_num = obj.attr('rel');
                            //var step_max = 2;

                            //if(step_num == step_max){                             
                            //    obj.parents(".wizard").find(".actionBar .btn-primary").css("display", "block");
                            //    return false;
                            //}    
                             return true;                     
                        //}
                                              
                    }//End
                });
            }            
            
        }// End Smart Wizard

        function PasoSiguiente(obj,context){
        

        if(context.fromStep== 1 && context.toStep == 2)
        {
                 if( $("a[href='#step-2']").hasClass('hide')){
                          
                                return false;
                          }
        }

        if(context.fromStep== 2 && context.toStep == 3){
        
         if( $("a[href='#step-3']").hasClass('hide')){
                          
                                return false;
                          }
        }

        return true;
       
        }