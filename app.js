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
        } ,
        budget : 0 ,
        percentage : -1  
    }

    // to calculate the total income and expense 
    function calculateTotal(type) {
        data.totals[type] = data.allItems[type].reduce(function(prev , current){
            return prev  + current.value ; 
        }, 0);
    }

    function calculateBudget() {
        // calculate total income & expense 
        calculateTotal("income");
        calculateTotal("expense");
        // calculate budget income - expense 
        data.budget =  data.totals.income -  data.totals.expense;
        //  calculate the percentage of income that we ? spent 

        data.percentage = data.totals.income > 0 ?  Math.round((data.totals.expense / data.totals.income)* 100) : -1;

    }

    function deleteItem(itemToDelete){
        var indexTODelete , indexToDel; 
        console.log(data.allItems[itemToDelete[0]]);
        indexToDel = data.allItems[itemToDelete[0]].findIndex(function(item){
                return item.id  === parseInt(itemToDelete[1] , 10);
        });
        if(indexToDel !== -1 ){
            data.allItems[itemToDelete[0]].splice(indexToDel , 1);
        }else{
            console.error("Unable to delete the item with id + " + itemToDelete[1]);

        }
     
    }   


    return {
        addItem :  function(type , description , value){
            var newItem , ID ,  curLength;
            // create new ID
            curLength = data.allItems[type].length ; 
            ID = curLength === 0 ?  0 :  data.allItems[type][curLength -1 ].id + 1 ;

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
        },
        calculateBudget:calculateBudget,
        getBudget : function(){
            return {
                budget : data.budget,
                totalIncome : data.totals.income , 
                totalExpense : data.totals.expense,
                percentage : data.percentage
            }
        } ,
        deleteItem : deleteItem
    }

}());


var UIController = (function(){
    // some code
    var DOMStrings = {
        iaddType : '.add__type',
        iaddDescr : '.add__description', 
        iaddValue  : '.add__value' ,
        aAddBtn  :'.add__btn' ,
        incomeContainer : ".income__list" , 
        expenseContainer : ".expenses__list" , 
        budgetIncome    :  ".budget__income--value" ,
        budgetExpense : ".budget__expenses--value" ,
        budget : ".budget__value" ,
        expPercentage : '.budget__expenses--percentage' ,
        container : '.container'

                        
    }
    function getIp(){
        return {
            type  : document.querySelector(DOMStrings.iaddType).value  ,//  will be either income or expense 
            description : document.querySelector(DOMStrings.iaddDescr).value ,
            value :  parseFloat(document.querySelector(DOMStrings.iaddValue).value  , 10)
           }
     
    }

    function addListItem(obj  , type){
         var html , element ;
     
        // create HTML string with the vlaue
        
        if(type === 'income'){

            element = DOMStrings.incomeContainer;
            html = `<div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">+ ${obj.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
        }else if(type === 'expense'){
            element = DOMStrings.expenseContainer;
            html =     `<div class="item clearfix" id="expense-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">- ${obj.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        }
        // insert the new HTML element 
        document.querySelector(element).insertAdjacentHTML("beforeend" , html);
    }

    function clearFields(){
        var fields , fieldsArr ; 
                // it returns the list not a array 
        fields = document.querySelectorAll(DOMStrings.iaddValue + "," + DOMStrings.iaddDescr);
    
        fieldsArr = Array.prototype.slice.call(fields);
    
        fieldsArr.forEach((element , index , array) => {
            element.value = "";
        });
        fields[0].focus();
    }

    function updateDOM(selector ,prefix , value , suffix){
        document.querySelector(selector).textContent = prefix + " "  + value + suffix;
    }
    function displayBudget(data) {
        updateDOM(DOMStrings.budgetIncome , "+" , data.totalIncome , "");
        updateDOM(DOMStrings.budgetExpense , "-" , data.totalExpense , "");
        updateDOM(DOMStrings.budget , "" , data.budget , "");
        if(data.percentage !== -1 ){
            updateDOM(DOMStrings.expPercentage , "" ,  data.percentage , "%" )
        }
    }
    return {
        getInput :  getIp ,
        DOMStrings : DOMStrings ,
        addListItem : addListItem ,
        clearFields : clearFields,
        displayBudget : displayBudget
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
                ctrlAddItem();
                
            }
        });

        document.querySelector(DOMStrings.container).addEventListener('click' ,  ctrlDeleteItem);
    }

    var init = function() {
        setupEventListner(); //  calling the setupEventListner at first place 
        uiCtrl.displayBudget({
            totalIncome : 0 ,
            totalExpense : 0 ,
            budget:0,
            percentage : 0

        })
    }

    function updateBudget() {
        var budget;
        // 1. Caclulate budget 
        budgetCtrl.calculateBudget();
        //2. return the budget 
        budget = budgetCtrl.getBudget();
        //3. display to UI 
        uiCtrl.displayBudget(budget);
    }
    var ctrlAddItem = function(){
        var input  , newItem ;    

        // 1. get the filled input 
        input = uiCtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type ,  input.description , input.value);
            
            budgetCtrl.testing();
            //3. add the item to UI 
            uiCtrl.addListItem(newItem , input.type);
            // 4.  clear the field 
            uiCtrl.clearFields();
            //4. Calculate the budget and display 
            updateBudget();        
        }
        
    }
    
    var ctrlDeleteItem = function(event ,  ){
        var itemId ,splitId  ;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
             // income-0 , income-1
            splitId =  itemId.split('-');
            // 1. delete item form data structre 
            budgetCtrl.deleteItem(splitId);
            budgetCtrl.testing();
            // 2 . delete item from the UI 

            //3. update and show the budget .

        }
    };

    return {
        init : init
    }
    
}(BudgetController , UIController));

controller.init(); 