'use-strict'
var BudgetController = (function(){
    //  some code 
}());


var UIController = (function(){
    // some code

    return {
        getInput :  function(){
           return {
            type  : document.querySelector('.add__type').value  ,//  will be either income or expense 
            description : document.querySelector('.add__description').value ,
            value :  document.querySelector('.add__value').value 
           }
     
        }
    }
}());

// app controller 
var controller = (function(budgetCtrl , uiCtrl){

    var ctrlAddItem = function(){
            var input = uiCtrl.getInput();
            console.log(input);
        // 1. get the filled input 

        // 2. add the item to the budget controller 

        //3. add the item to UI 

        //4. calculate the budget 

        // 5. display the budget to the ui 
        console.log("I am executing ");
    }
    document.querySelector('.add__btn').addEventListener('click' , ctrlAddItem);

    //  keypress happen on document
    document.addEventListener('keypress' , function(evt){
        if(evt.keyCode === 13 || event.which === 13){
            console.log("Enter hit");
            ctrlAddItem();
            
        }
    });

    
}(BudgetController , UIController));
