 

 export const getSubscriptionPrice = (subscription)=>{

    let price = 0
    if(subscription == "beginner"){
    price = 70
    } 
    if(subscription == "advanced"){
    price = 120
    } 
    if(subscription == "professional"){
    price = 199
    } 
    return price
 }