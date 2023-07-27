var body = document.body;
body.style.backgroundColor = "#3268a8";

// Logo Div
var logoDiv = document.createElement("div");
logoDiv.className = "center";
body.appendChild(logoDiv);

// logo image
var logoImg = document.createElement("img");
logoDiv.appendChild(logoImg);
logoImg.className = "img";
logoImg.src = "/assets/logo.png";


// Instructions
var instructionsDiv = document.createElement("p");
body.appendChild(instructionsDiv);
instructionsDiv.textContent = "Click on a tile and answer each question";
instructionsDiv.style.color = "#fff";
instructionsDiv.className = "center";

// Score
let score = document.createElement("p");
body.appendChild(score);

let counter = 0;
score.textContent = "Score: $" + counter;
score.className = "center";

// quiz message
let message = document.createElement("p");
message.classList.add("center", "message");
message.style.backgroundColor = "#fff";
body.appendChild(message);

// Button Div
var buttonDiv = document.createElement("div");
body.appendChild(buttonDiv);
buttonDiv.className = "center";


// Button
var resetButton = document.createElement("button");
buttonDiv.appendChild(resetButton);
resetButton.textContent = "Reset Board";
resetButton.className = "resetBtn";

resetButton.addEventListener("click", function(){
    location.reload();
})

// Category Div
var categoryDiv = document.createElement("div");
categoryDiv.className = "categoryDiv";
body.appendChild(categoryDiv);


 // Urls
 const categoryURL = "https://jservice.io/api/categories?count=5";

 // Constant request method to be used for the api
 function using_Http(URL, Res) {
   var request = new XMLHttpRequest();

   request.open("GET", URL, true);

   request.onload = () => {
     Res(JSON.parse(request.responseText));
   };

   request.send();
 }

 // Function to fetch questions for a specific category
 function getCategoryQuestions(categoryID, callback) {
   const questionsURL = `https://jservice.io/api/clues?category=${categoryID}`;
   using_Http(questionsURL, callback);
 }

 // Function to increase the score when an answer is correct
 function increaseScore(valueText) {
   let valueNumber = parseInt(valueText.replace("$", ""));
   counter += valueNumber;
   score.textContent = "Score: $" + counter;
 }

 // Function to handle answer input and display message
 function handleAnswer(valueText, correctAnswer) {
   let inputValue = prompt("Enter your answer: ");

   if (inputValue !== null) {
     // I used .tolowercase so all answers entered are made lowercase to be compared with the correct answers which are also made lowercase
     if (inputValue.toLowerCase() === correctAnswer.toLowerCase()) {
       message.textContent = "Correct answer:  " + correctAnswer ;
       message.style.color = "green";
       increaseScore(valueText);
     } else {
       message.textContent = "Wrong answer answer is: " + correctAnswer;
       message.style.color = "red";
     }
   }
 }

 // Function to fetch random categories
 function getRandomCategories(count, callback) {
   const randomCategoryURL = `https://jservice.io/api/random?count=${count}`;
   using_Http(randomCategoryURL, callback);
 }

 // Fetch random categories and display questions
 getRandomCategories(5, (randomCategories) => {
   for (let i = 0; i < randomCategories.length; i++) {
     getCategoryQuestions(randomCategories[i].category.id, (questions) => {
       showCategoryQuestions(randomCategories[i].category, questions);
     });
   }
 });

 // Display questions for a category
 function showCategoryQuestions(category, questions) {
   let categoryContainer = document.createElement("div");
   categoryContainer.className = "categoryContainer";
   categoryDiv.appendChild(categoryContainer);

   let categoryh2 = document.createElement("h2");
   categoryh2.id = category.id;
   categoryh2.textContent = category.title.toUpperCase();
   categoryh2.className = "categoryItem";
   categoryContainer.appendChild(categoryh2);

   for (let i = 0; i < Math.min(questions.length, 5); i++) {
     let valueDiv = document.createElement("div");
     valueDiv.className = "valueDiv";
     categoryContainer.appendChild(valueDiv);

     let value = document.createElement("p");
     value.textContent = "$" + questions[i].value;
     value.className = "priceItem";
     valueDiv.appendChild(value);

     let question = document.createElement("p");
     question.textContent = questions[i].question;
     question.className = "questionItem";
     question.classList.add("hide")
     valueDiv.appendChild(question);

     // Add click event listener to valueDiv
     valueDiv.addEventListener("click", () => {

        
        question.classList.remove("hide");
        value.classList.add("hide");
        
        function inputAnswer(){
            handleAnswer(value.textContent, questions[i].answer);
        }

        setTimeout(inputAnswer, 3000);
       
     });
   }
 }
   

