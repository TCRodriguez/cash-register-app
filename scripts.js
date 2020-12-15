
function checkCashRegister(price, cash, cid) {

    let change = {
        status: null,
        change: null
    }

    let currency = [
        ["PENNY", .01],
        ["NICKEL", .05],
        ["DIME", .10],
        ["QUARTER", .25],
        ["ONE", 1],
        ["FIVE", 5],
        ["TEN", 10],
        ["TWENTY", 20]
    ];

    // 'cid' is 'cash in drawer'
    let cidArray = cid.slice(0)
    let cidArrayStripped = cid.slice(0)

    // Leaves only the denominations that we have any money in
    for(var i = 0; i < cidArrayStripped.length; i++){
        // console.log(cidArrayStripped[i][1]);
        if(cidArrayStripped[i][1] == 0){
            cidArrayStripped.splice(i)
        }
    }

    // Isolates only the denominations of the money we have in the drawer
    let currencyStripped = currency.slice(0);

    // Loop here to take all zero 0 denominations out of currencyStripped
    for(var i = 0; i < cidArray.length; i++){
        for(var j = 0; j < currencyStripped.length; j++){
            if(cidArray[i][0] == currencyStripped[j][0]){

                if(cidArray[i][1] == 0){

                    currencyStripped.splice(j, 1)
                }
            }
        }
    }

    let cashOnHand = 0;
    
    // Gets total cash in the register
    for(var i = 0; i < cid.length; i++){

        for(var j = 0; j < cid[i].length; j++){
            if(typeof cid[i][j] != "string"){
                cashOnHand += cid[i][j];
            }
        }

    }

    cashOnHand = Math.round(100 * cashOnHand) / 100;


    let currencyFound;
    let placeholder;

    // finalCurrency will hold all the 'references' to the data
    let finalCurrency = [];
    /* finalCurrencyFinal is a copy of finalCurrency, but one that we can manipulate without mutating
    data elsewhere (like in currencyFound, which is what we use to 'locate' the appropriate denomiantion
    for a given amount of change, i.e., giving back a $1 bill instead of four quarters or ten dimes, etc.) */
    let finalCurrencyFinal = [];
    
    let changeDue = cash - price;
    const changeDueReference = cash - price;
    let totalChangeBack = 0;

    // When we have enough change to give back to the customer
    if(changeDue < cashOnHand){
        
        while(changeDue > 0){

            /* Finds largest appropriate denomination to give back in change.
            For example, if changeDue is $84.00, that should be 4 $20 bills,
            not 8 $10 bills, as well as 4 $1 bills, not 16 ¢0.25.  */
            for(var i = 0; i < currencyStripped.length; i++){
                while(changeDue / currencyStripped[i][1] >= 1){
                    currencyFound = [];
    
                    currencyFound.push(currencyStripped[i]);
                    break;
                }
            }
    
            placeholder = currencyFound[0].slice()
    
            /* Pushes the largest denomination appropriate into an array
            of total change due back to the customer if the array doesn't already have it.
            If it does, it adds the appropriate amount to that denomination. */
            if(!finalCurrency.includes(currencyFound[0])){
                finalCurrency.push(currencyFound[0])
                finalCurrencyFinal.push(placeholder)
                for(var i = 0; i < cidArray.length; i++){
                    // console.log(finalCurrencyFinal[i])
                    if(cidArray[i][0] == placeholder[0]){
                        // console.log("yes")
                        cidArray[i][1] -= placeholder[1]
                    }
                }
                let [,subtractor] = currencyFound[0];
                // let subtractor = finalCurrencyFinal[finalCurrencyFinal.length - 1].slice(1)
                // let subtractor = currencyFound[0].slice(1)
    
                // console.log(subtractor);
        
                changeDue = changeDue - subtractor;
        
                changeDue = Math.round(changeDue * 100) / 100;

    
            } else {
                for(var i = 0; i < cidArrayStripped.length; i++){

                    if(cidArrayStripped[i][0] == placeholder[0]){
                        if(cidArrayStripped[i][1] > 0){
                            finalCurrencyFinal[finalCurrencyFinal.length - 1][1] += placeholder[1];
                            cidArrayStripped[i][1] -= placeholder[1];
                            if(cidArrayStripped[i][1] == 0){
                                for(var j = 0; j < currencyStripped.length; j++){
                                    if(currencyStripped[j][0] == placeholder[0]){
                                        currencyStripped.splice(j, 1)
                                    }
                                }
                            }
                        }
                    }
                }
                let [,subtractor] = currencyFound[0];
        
                changeDue = changeDue - subtractor;
        
                changeDue = Math.round(changeDue * 100) / 100;

            }
        }


        for(var i = 0; i < finalCurrencyFinal.length; i++){
            totalChangeBack += finalCurrencyFinal[i][1];
        }

        totalChangeBack = Math.round(totalChangeBack * 100) / 100;

        if(totalChangeBack < changeDueReference){
            change.status = "INSUFFICIENT_FUNDS"
            change.change = [];
        } else {
            change.status = "OPEN"
            change.change = finalCurrencyFinal;
        }


    } else if(changeDue == cashOnHand) {
        console.log("We got it EXACTLY!")
        
        while(changeDue > 0){

            /* Finds largest appropriate denomination to give back in change.
            For example, if changeDue is $84.00, that should be 4 $20 bills,
            not 8 $10 bills, as well as 4 $1 bills, not 16 ¢0.25.  */
            for(var i = 0; i < currencyStripped.length; i++){
                while(changeDue / currencyStripped[i][1] >= 1){
                    currencyFound = [];
                    currencyFound.push(currency[i]);
                    break;
                }
            }

            placeholder = currencyFound[0].slice()
    
            /* Pushes the largest denomination appropriate into an array
            of total change due back to the customer if the array doesn't already have it.
            If it does, it adds the appropriate amount to that denomination. */
            if(!finalCurrency.includes(currencyFound[0])){
                finalCurrency.push(currencyFound[0])
                finalCurrencyFinal.push(placeholder)
                for(var i = 0; i < cidArray.length; i++){
                    if(cidArray[i][0] == placeholder[0]){

                        cidArray[i][1] -= placeholder[1]
                    }
                }
                let [,subtractor] = currencyFound[0];
    
                changeDue = changeDue - subtractor;
        
                changeDue = Math.round(changeDue * 100) / 100;

    
            } else {
                for(var i = 0; i < cidArray.length; i++){
                    if(cidArray[i][0] == placeholder[0]){
                        if(cidArray[i][1] > 0){
                            finalCurrencyFinal[finalCurrencyFinal.length - 1][1] += placeholder[1];
                            cidArray[i][1] -= placeholder[1];
                            if(cidArray[i][1] == 0){
                                for(var j = 0; j < currency.length; j++){
                                    if(currency[j][0] == placeholder[0]){
                                        currency.splice(j, 1)
                                    }
                                }
                            }
                        }
                    }
                }
                let [,subtractor] = currencyFound[0];
        
                changeDue = changeDue - subtractor;
        
                changeDue = Math.round(changeDue * 100) / 100;

            }
        }

        for(var i = 0; i < finalCurrencyFinal.length; i++){
            finalCurrencyFinal[finalCurrencyFinal.length - 1][1] = Math.round(finalCurrencyFinal[finalCurrencyFinal.length - 1][1] * 100) / 100;
        }
        
        let finalCurrencyClosed = finalCurrencyFinal.slice(0)
        for(var j = 0; j < finalCurrencyFinal.length; j++){
            for(var k = 0; k < cidArray.length; k++){
                // console.log("tetretetetett")
                console.log(finalCurrencyFinal[j][0])
                console.log(cidArray[k][0])
                if(finalCurrencyFinal[j][0] !== cidArray[k][0]){
                    // console.log("pppppppppp")
                    finalCurrencyClosed.push(cidArray[k])
                }
            }
        }

        change.status = "CLOSED"
        change.change = finalCurrencyClosed;

    } else if(changeDue > cashOnHand){

        change.status = "INSUFFICIENT_FUNDS"
        change.change = [];
    }

    return change;
}
 



let hundredsOnHand = document.getElementById("hundreds");
let twentiesOnHand = document.getElementById("twenties");
let tensOnHand = document.getElementById("tens");
let fivesOnHand = document.getElementById("fives");
let onesOnHand = document.getElementById("ones");
let quartersOnHand = document.getElementById("quarters");
let dimesOnHand = document.getElementById("dimes");
let nickelsOnHand = document.getElementById("nickels");
let penniesOnHand = document.getElementById("pennies");


let hundredsDue = document.getElementById("hundreds-due");
let twentiesDue = document.getElementById("twenties-due");
let tensDue = document.getElementById("tens-due");
let fivesDue = document.getElementById("fives-due");
let onesDue = document.getElementById("ones-due");
let quartersDue = document.getElementById("quarters-due");
let dimesDue = document.getElementById("dimes-due");
let nickelsDue = document.getElementById("nickels-due");
let penniesDue = document.getElementById("pennies-due");





let itemPriceInput = document.getElementById("item-price");
let cashGivenInput = document.getElementById("cash-given");
let changeDueValue = document.getElementById("change-due-value");



let enterButton = document.getElementById("enter-button");
let closeButton = document.getElementById("close-button");
let cashRegisterDrawer = document.getElementById("cash-register-drawer-div");

// sound bytes for cash drawer animations
let cashRegisterOpenSound = new Howl({
    src: ['https://dl.dropbox.com/s/qyeccu38bm39mkx/201159__kiddpark__cash-register.mp3?']
});
let cashRegisterCloseSound = new Howl ({
    src: ['https://dl.dropbox.com/s/wb3645dl2dxhutp/79068__atha89__coho-shutting-cash-register.wav?']
})

let cashOnHandArray = [
    ["PENNY", 1.01], 
    ["NICKEL", 2.05], 
    ["DIME", 3.1], 
    ["QUARTER", 4.25], 
    ["ONE", 90], 
    ["FIVE", 55], 
    ["TEN", 20], 
    ["TWENTY", 60], 
    ["ONE HUNDRED", 100]
];

// Shows on screen the amounts we currently have by denomination
for(var i = 0; i < cashOnHandArray.length; i++){
    switch(cashOnHandArray[i][0]){
        case "ONE HUNDRED":
            hundredsOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "TWENTY":
            twentiesOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "TEN":
            tensOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "FIVE":
            fivesOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "ONE":
            onesOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "QUARTER":
            quartersOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "DIME":
            dimesOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "NICKEL":
            nickelsOnHand.textContent = cashOnHandArray[i][1];
            break;
        case "PENNY":
            penniesOnHand.textContent = cashOnHandArray[i][1];
            break;
    }
}




enterButton.addEventListener("click", function(e){
    changeDueValue.textContent = Math.round(100 * (cashGivenInput.value - itemPriceInput.value)) / 100;
    if(changeDueValue.textContent < 0){
        alert("Sorry, it doesn't look like you have enough to buy this!");
        changeDueValue.textContent = 0;
    }

    let transactionResults = checkCashRegister(itemPriceInput.value, cashGivenInput.value, cashOnHandArray)
    let transactionResultsArray = Array.from(transactionResults.change);


    // Shows on screen the change being given back to the customer broken down by denomination
    for(var i = 0; i < transactionResultsArray.length; i++ ){

        switch(transactionResultsArray[i][0]){
            case "ONE HUNDRED":
                hundredsDue.textContent = transactionResultsArray[i][1];
                break;
            case "TWENTY":
                twentiesDue.textContent = transactionResultsArray[i][1];
            case "TEN":
                tensDue.textContent = transactionResultsArray[i][1];
                break;
            case "FIVE":
                fivesDue.textContent = transactionResultsArray[i][1];
                break;
            case "ONE":
                onesDue.textContent = transactionResultsArray[i][1];
                break;
            case "QUARTER":
                quartersDue.textContent = transactionResultsArray[i][1];
                break;
            case "DIME":
                dimesDue.textContent = transactionResultsArray[i][1];
                break;
            case "NICKEL":
                nickelsDue.textContent = transactionResultsArray[i][1];
                break;
            case "PENNY":
                penniesOnHand.textContent = transactionResultsArray[i][1];
                break;
        }
    }

    cashRegisterOpenSound.play();

    e.preventDefault;

    cashRegisterDrawer.classList.remove("slide-closed-animation");

    cashRegisterDrawer.classList.remove("slide-open-animation");



    void cashRegisterDrawer.offsetWidth;

    cashRegisterDrawer.classList.add("slide-open-animation");
}, false);

closeButton.addEventListener("click", function(){
    if(cashRegisterDrawer.classList.contains("slide-open-animation")){
        cashRegisterCloseSound.play();
    }

    cashRegisterDrawer.classList.remove("slide-open-animation");

    // Reset all change due values to zero to prepare for the next transaction
    itemPriceInput.value = 0;
    cashGivenInput.value = 0;
    changeDueValue.textContent = 0;

    hundredsDue.textContent = 0;
    twentiesDue.textContent = 0;
    tensDue.textContent = 0;
    fivesDue.textContent = 0;
    onesDue.textContent = 0;
    quartersDue.textContent = 0;
    dimesDue.textContent = 0;
    nickelsDue.textContent = 0;
    penniesDue.textContent = 0;





    // cashRegisterDrawer.classList.add("slide-closed-animation");
});



// let testingThis = checkCashRegister(19.5, 20, [
//     ["PENNY", 0.01], 
//     ["NICKEL", 0], 
//     ["DIME", 0], 
//     ["QUARTER", 0], 
//     ["ONE", 1], 
//     ["FIVE", 0], 
//     ["TEN", 0], 
//     ["TWENTY", 0], 
//     ["ONE HUNDRED", 0]
// ]);

// let testingThisOut = checkCashRegister(3.25, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);

// alert(testingThisOut.change[0][1]);



// checkCashRegister(19.5, 20, [
//     ["PENNY", 0.5], 
//     ["NICKEL", 0], 
//     ["DIME", 0], 
//     ["QUARTER", 0], 
//     ["ONE", 0], 
//     ["FIVE", 0], 
//     ["TEN", 0], 
//     ["TWENTY", 0], 
//     ["ONE HUNDRED", 0]
// ]);



// checkCashRegister(3.26, 100, [
//     ["PENNY", 1.01], 
//     ["NICKEL", 2.05], 
//     ["DIME", 3.1], 
//     ["QUARTER", 4.25], 
//     ["ONE", 90], 
//     ["FIVE", 55], 
//     ["TEN", 20], 
//     ["TWENTY", 60], 
//     ["ONE HUNDRED", 100]
// ]);


// checkCashRegister(19.5, 20, [
//     ["PENNY", 1.01], 
//     ["NICKEL", 2.05], 
//     ["DIME", 3.1], 
//     ["QUARTER", 4.25], 
//     ["ONE", 90], 
//     ["FIVE", 55], 
//     ["TEN", 20], 
//     ["TWENTY", 60], 
//     ["ONE HUNDRED", 100]
// ]);


