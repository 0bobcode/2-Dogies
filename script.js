//let apiUrl = "https://dog.ceo/api/breeds/image/random"
let apiUrl = "https://dog.ceo/api/breeds/list/all"

function processResponse(response){
        console.log("prossecing the response with a status of", response.status)
    if(response.ok){
        return response.json()
    }
    else{
        throw new Error("http error:", response.status)
    }
}

function displayDogs(data){
    console.log(data)
}

fetch(apiUrl)
 .then(processResponse)
 .then(displayDogs)