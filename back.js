// BUDGET CONTROLLER
var budgetController = (function(){
 
    var Expense = function(id, description, value){
        
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var Income = function(id, description, value){
        
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
           sum += cur.value; 
        });
        data.totals[type] = sum;
    }

     var data = {
         
         allItems : {
             exp: [],
             inc: []
         },
         totals : {
             exp: [],
             inc: []
         },
         budget : 0,
         percentage : -1
     }
     
     return {
         addItem: function(type,des,val){
          
             var newItem, ID; 
             //Create New ID
             if(data.allItems[type].length > 0){
                 
              ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    
             }else {
                 ID = 0
             }
             
             
             //Create new Item Based on exp or inc.
             if(type === 'exp'){
                 newItem = new Expense(ID,des,val,);
             }else if(type === 'inc'){
                 newItem = new Income(ID,des,val);
             }
             
             //push the new element
             data.allItems[type].push(newItem);
             
             //Return the new element
             return newItem;
             
             },
         
          deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
         
          calculateBudget: function(){
              
              // Calculate the income and Expenses
              calculateTotal('exp');
              calculateTotal('inc');
              
              // Calculate the Budget = income - expenses
              if (data.totals.inc > 0){
                 data.budget = data.totals.inc - data.totals.exp;
              }else {
                  data.percentage = -1;
              }
              // calculate the percenetage of income that we spent
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
              
          },
         
         getBudget: function(){
             return {
                 budget: data.budget,
                 totalInc: data.totals.inc,
                 totalExp: data.totals.exp,
                 percentage: data.percentage
             };
             
         },
         
          test: function(){
                 console.log(data);
         }
     };

})();


// UI CONTROLLER
var UIController = (function(){
    
    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetlabel: '.budget__value',
        incomelabel: '.budget__income--value',
        expenseslabel: '.budget__expenses--value',
        percentagelabel: '.budget__expenses--percentage',
        conatiner: '.container'
        
    };
    
    return {
         getInput: function(){
           return{
              type: document.querySelector(DOMstrings.inputType).value,
              description: document.querySelector(DOMstrings.inputDescription).value,
              value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
           };
         },
        
       addListItem: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
        
        
        clearFields: function(){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current,index,array){
               current.value = "";
                
            });
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
                
           document.querySelector(DOMstrings.budgetlabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomelabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseslabel).textContent = obj.totalExp;
            
            
            if(obj.percentage > 0){
                 document.querySelector(DOMstrings.percentagelabel).textContent = obj.percentage + '%';    
            }else {
                document.querySelector(DOMstrings.percentagelabel).textContent = '--';
            }
        },
        
        getDOMstrings: function(){
        return DOMstrings;
      }
    };
    
    
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
     
    var setupEventListners = function (){
         
        var DOM = UICtrl.getDOMstrings;
        
         document.querySelector('.add__btn').addEventListener('click',ctrlAddItem );
         document.addEventListener('keypress', function(){
       
          if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
         } 
      });
     document.querySelector('.container').addEventListener('click',ctrlDeleteItem);
    
    };
     
    
    var updateBudget = function(){
       
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
        
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };
    
    var ctrlAddItem = function(){
        
        var input, newItem;
        
        // 1. Get the field input data
        input = UICtrl.getInput();
        console.log(input + 'input data by user');
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        // 2. Add the Item to Budget Controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the Item to the UI
        UICtrl.addListItem(newItem,input.type);
        
        // 4. Clear The Fields
        UICtrl.clearFields();
    
        // 5. Calculate and update the budget
        updateBudget();
        
        }
        
    }
    
     var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    
    return {
        init: function(){
            UICtrl.displayBudget( {
                 budget: 0,
                 totalInc: 0,
                 totalExp: 0,
                 percentage: -1
             }
          );
            setupEventListners();
            
        }
    };
    
})(budgetController,UIController);

controller.init();