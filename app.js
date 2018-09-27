'use-strict'
var BudgetController = (function(){
    //  some code 

    /**
     * function constructor to create expense object 
     * @param {*} id 
     * @param {*} description 
     * @param {*} value 
     */
    var Expense =  function(id , description  , value){
        this.id =  id ;
        this.description = description ;
        this.value =  value ;

    }
    /**
     * function Constructor to create inceome 
     * @param {*} id 
     * @param {*} description 
     * @param {*} value 
     */
    var Income =  function(id , description , value){
        this.id =  id ;
        this.description = description ;
        this.value =  value ;
    }

    var data = {
        allItems : {
            expense : [] ,
            income : [] 
        },
        totals : {
            expense:0,
            income:0
        }
    }

    return {
        addItem :  function(type , description , value){
            var newItem , ID ,  curLength;
            // create new ID
            curLength = data.allItems[type].length ; 
            ID = curLength === 0 ?  1 :  data.allItems[curLength -1 ].id + 1 ;

            //  created a new Item
            if(type === 'income'){
                newItem = new Income(ID, description , value);
            }else if(type === 'expense'){
                newItem = new Expense(ID , description , value);
            }
            //pushing into the container for later use
            data.allItems[type].push(newItem);
            //  return the new item 
            return newItem;
        },
        testing : function(){
            console.log(data);
        }
    }

}());


var UIController = (function(){
    // some code
    var DOMStrings = {
        iaddType : '.add__type',
        iaddDescr : '.add__description', 
        iaddValue  : '.add__value' ,
        aAddBtn  :'.add__btn'
    }

    function getIp(){
        return {
            type  : document.querySelector(DOMStrings.iaddType).value  ,//  will be either income or expense 
            description : document.querySelector(DOMStrings.iaddDescr).value ,
            value :  document.querySelector(DOMStrings.iaddValue).value 
           }
     
    }
    return {
        getInput :  getIp ,
        DOMStrings : DOMStrings
    }
}());

// app controller 
var controller = (function(budgetCtrl , uiCtrl){

    var setupEventListner =  function() {
        var DOMStrings =  uiCtrl.DOMStrings;
        document.querySelector(uiCtrl.DOMStrings.aAddBtn).addEventListener('click' , ctrlAddItem);
        //  keypress happen on document
        document.addEventListener('keypress' , function(evt){
            if(evt.keyCode === 13 || event.which === 13){
                console.log("Enter hit");
                ctrlAddItem();
                
            }
        });
    }

    var init = function() {
        console.log("Init Called ");
        setupEventListner(); //  calling the setupEventListner at first place 
    }
    var ctrlAddItem = function(){
        var input  , newItem ;    

        // 1. get the filled input 
          input = uiCtrl.getInput();
        // 2. add the item to the budget controller 
         newItem = budgetCtrl.addItem(input.type ,  input.description , input.value);
         console.log(newItem);
         budgetCtrl.testing();
        //3. add the item to UI 

        //4. calculate the budget 

        // 5. display the budget to the ui 
        console.log("I am executing ");
    }
    
    return {
        init : init
    }
    
}(BudgetController , UIController));

controller.init(); 