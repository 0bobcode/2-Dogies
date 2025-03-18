// apiUrl = "https://opentdb.com/api.php?amount=10&category=18&type=boolean"

// function processResponse(response){
//     console.log("prossesing the response with a staus of" ,response.status)
//     if(response.ok){
//         return response.json()
//     }
//     else{
//         throw new Error("http error:", response.status)
//     }
// }

// function displayQuizData(data){
//     console.log(data)
// }

// function handleError(error){
//     console.error("error fetching data", error)
// }

// fetch(apiUrl)
//  .then(processResponse)
//  .then(displayQuizData)
//  .catch(handleError)

const categoriesList = document.getElementById("categories-list")

fetch("https://opentdb.com/api_category.php")
 .then(response=>response.json())
 .then(data=>{
    const categories = data.trivia_categories
    categories.forEach(category =>{
        const li = document.createElement("li")
        li.textContent = `${category.id}: ${category.name}`
        categoriesList.appendChild(li)
        
    })
 })
 

 .catch (error=> {
    console.error("error fetching categories:", error)
 })