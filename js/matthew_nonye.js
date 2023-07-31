// Variable Creation

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
instructionsDiv.textContent = "Click on a tile and answer each question that pops up";
instructionsDiv.style.color = "#fff";
instructionsDiv.className = "center";

// Score
let score = document.createElement("p");
body.appendChild(score);

let counter = 0;
score.textContent = "Score: $" + counter;
score.className = "center";

// Game Message Board
let message = document.createElement("p");
message.classList.add("center", "message");
message.style.backgroundColor = "#fff";
body.appendChild(message);

// Start Button Div
var buttonDiv1 = document.createElement("div");
body.appendChild(buttonDiv1);
buttonDiv1 .className = "center";

// Start Button
var startButton = document.createElement("button");
buttonDiv1.appendChild(startButton);
startButton.textContent = "Start Game";
startButton.className = "startBtn";

// Category Div
var categoryDiv = document.createElement("div");
categoryDiv.className = "categoryDiv";
body.appendChild(categoryDiv);

// Button Div
var buttonDiv2 = document.createElement("div");
body.appendChild(buttonDiv2);
buttonDiv2.className = "center";

// Reset Button
var resetButton = document.createElement("button");
buttonDiv2.appendChild(resetButton);
resetButton.textContent = "Reset Game";
resetButton.className = "resetBtn";
resetButton.style.display = "none"; //Hide the reset button until game has started

// End Button
var endButton= document.createElement("button");
buttonDiv2.appendChild(endButton);
endButton.textContent = "End Game";
endButton.className = "endBtn";
endButton.style.display = "none"; //Hide the end button until game has started


// End Variable Creation
// ------------------------------------------------------------------------------------------


// Constants

 // Constant http request method to be used for the api
 function using_Http(URL, Res) {
   var request = new XMLHttpRequest();

   request.open("GET", URL, true);

   request.onload = () => {
     Res(JSON.parse(request.responseText));
   };

   request.send();
 }

//  Constants End

 // ------------------------------------------------------------------------------------------

// Button Functionalities

 // Start Game onclick of "Start Game" button
startButton.addEventListener("click", function() {
  fetchBoard();
  startButton.style.display = "none"; // Hide the "Start Game" button after fetching the board
  resetButton.style.display = "block"; // Display the "Reset Game" button after game has started
  endButton.style.display = "block"; // Display the "Reset Game" button after game has started
});

// Reload Page on click of end button
endButton.addEventListener("click", function(){
  location.reload();
})

// Refetch the APi on click of the refresh button to get new random categories
resetButton.addEventListener("click", function(){
  
    resetBoard();

})

function resetBoard() {
  // Remove all categories from the DOM
  categoryDiv.innerHTML = "";

  // Reset the score counter
  counter = 0;
  score.textContent = "Score: $" + counter;

  // Reset the message board
  message.textContent = ""

  // Fetch a new board
  fetchBoard();
}

// End button functionalities


// ------------------------------------------------------------------------------------------

// Api Functionalities

// Function to fetch random categories and display questions
function fetchBoard() {
  getRandomCategories(5, (randomCategories) => {
    for (let i = 0; i < randomCategories.length; i++) {
      getCategoryQuestions(randomCategories[i].category.id, (questions) => {
        showCategoryQuestions(randomCategories[i].category, questions);
      });
    }
  });
}


 // Function to fetch questions for a specific category
 function getCategoryQuestions(categoryID, callback) {
   const questionsURL = `https://jservice.io/api/clues?category=${categoryID}`;
   using_Http(questionsURL, callback);
 }

 // Function to fetch random categories
 function getRandomCategories(count, callback) {
  const randomCategoryURL = `https://jservice.io/api/random?count=${count}`;
  using_Http(randomCategoryURL, callback);
}


 // Display questions for a category
 function showCategoryQuestions(category, questions) {
  
  // Filter out questions with null values
  const filteredQuestions = questions.filter((question) => question.value !== null);

  // Proceed to create elements for the remaining questions
  let categoryContainer = document.createElement("div");
  categoryContainer.className = "categoryContainer";
  categoryDiv.appendChild(categoryContainer);

  // Category Titles
  let categoryh2 = document.createElement("h2");
  categoryh2.id = category.id;
  categoryh2.textContent = category.title.toUpperCase();
  categoryh2.className = "categoryItem";
  categoryContainer.appendChild(categoryh2);

  // Create Tiles of Questions with 5 questions per category using math.min picking the smaller which is 5
  for (let i = 0; i < Math.min(filteredQuestions.length, 5); i++) {
    let valueDiv = document.createElement("div");
    valueDiv.className = "valueDiv";
    categoryContainer.appendChild(valueDiv);

    // Price value to be shown first
    let price = document.createElement("p");
    price.textContent = "$" + filteredQuestions[i].value;
    price.className = "priceItem";
    valueDiv.appendChild(price);

    // Questions to be hidden until price is clicked on
    let question = document.createElement("p");
    question.textContent = filteredQuestions[i].question;
    question.className = "questionItem";
    question.classList.add("hide");
    valueDiv.appendChild(question);

    // Onclick of price, hide price and display question for 3 seconds before you get to answer
    price.addEventListener("click", () => {
      question.classList.remove("hide");
      price.classList.add("hide");

      // Valodate the input given
      function inputAnswer() {
        handleAnswer(price.textContent, filteredQuestions[i].answer);
      }

      setTimeout(inputAnswer, 3000);
    });
  }
}

// End Api functionalities

// ------------------------------------------------------------------------------------------

// Game Functions

 // Function to handle answer input and display message afterwards
 function handleAnswer(valueText, correctAnswer) {
   let inputValue = prompt("Enter your answer: ");

   // I used .tolowercase so all answers inputed are forced to be lowercase to be compared with the correct answers which are also forced to be lowercase so the comaprison will not be case sensitive.
   if (inputValue !== null) {
     if (inputValue.toLowerCase() === correctAnswer.toLowerCase()) {
       message.textContent = "Great, '" + correctAnswer + "' is the correct answer"  ;
       message.style.color = "green";
       increaseScore(valueText);
     } else {
       message.textContent = "Oh No!, " + "'" + inputValue + "' is the wrong answer!"+ "\n" + "The correct answer is: '" + correctAnswer + "'";
       message.style.color = "red";
     }
   }
 }

 // Function to increase the score when an answer is correct
 function increaseScore(valueText) {
  let valueNumber = parseInt(valueText.replace("$", ""));
  counter += valueNumber;
  score.textContent = "Score: $" + counter;
}



// End Game functions

// ------------------------------------------------------------------------------------------




   
