const quotes = [
  "Practice DSA problems daily, and watch your skills grow!",
  "Solving one problem at a time makes you a better programmer.",
  "Consistency beats intensity when it comes to coding practice.",
  "Don’t stop until you’re proud of your solutions.",
  "Every bug you fix is a step forward in mastery."
];

document.addEventListener("DOMContentLoaded", function() {


   
    const searchButton = document.getElementById("find");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");

    const easyCircle = document.querySelector(".easy-progress");
    const mediumCircle = document.querySelector(".medium-progress");
    const hardCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardsContainer = document.querySelector(".stats-cards")
    
    // Quote Management
    const quoteElement = document.getElementById("dsa-quote");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = `“${randomQuote}”`;


     // Hide stats container before fetching
     statsContainer.style.display = "none"; // hide initially


   

    // return true or false based on regular expression
    function validateUsername(username) {
        if(username.trim() === "") {
            alert("Username should not be empty!");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Enter a valid username!");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {

        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Hang Tight!";
            searchButton.disabled = true;

  
            const response = await fetch(url);

            if(!response.ok) {
                throw new Error("Unable to fetch the user details");
            }
            
            const parsedData = await response.json();
            // searchButton.textContent = "Check It Out";
            console.log("Loaded Data: ",parsedData);

            // Hide stats container before fetching
            statsContainer.style.display = "block"; 
            console.log("Parsed Data Keys:", Object.keys(parsedData));

            displayUserData(parsedData);
            
        }
        catch(error) {
            statsContainer.innerHTML = `<p>No Data Found</p>`;
            statsContainer.style.setProperty("display", "block"); // show error

        }
        finally {
            searchButton.textContent = "Let’s Go!";
            searchButton.disabled = false;
        }
        
    }

    function updateProgress(solved, total, label, circle) {
         const progressDegree = (solved/total)*100;

         circle.style.setProperty("--progress-degree", `${progressDegree}%`);

         label.textContent = `${solved}/${total}`;
         label.style.fontSize = "25px";
    }

   function renderSubmissionCalendar(submissionCalendar) {
         const calendarContainer = document.querySelector(".calendar-heatmap");
         calendarContainer.innerHTML = "";

         if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
           calendarContainer.innerHTML = "<p>No submission data found</p>";
           return;
         }

         const timestamps = Object.keys(submissionCalendar).map(Number).sort((a, b) => a - b);
         const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

       // Create month blocks (all months 0-11)
       calendarContainer.innerHTML = Array.from({length: 12}, (_, month) => {
         // Days in this month from submissionCalendar
         const monthDays = timestamps.filter(ts => new Date(ts * 1000).getMonth() === month);

         if (monthDays.length === 0) {
           //  No submissions — red placeholder box
           return `
             <div class="month-block missing">
               <div class="month-label">${monthNames[month]}</div>
               <div class="empty-month"></div>
             </div>
           `;
         }
     
         // Month has submissions
         const boxes = monthDays.map(ts => {
           const count = submissionCalendar[ts];
           let color;
           if (count === 0) color = "#e42527"; // red for 0
           else if (count < 3) color = "#3b82f6";
           else if (count < 6) color = "#2563eb";
           else color = "#1d4ed8";
     
           const date = new Date(ts * 1000);
           return `<div class="day-box" title="${date.toDateString()} — ${count} submissions" style="background:${color}"></div>`;
         }).join("");
    
         return `
           <div class="month-block">
             <div class="month-label">${monthNames[month]}</div>
             <div class="month-days">${boxes}</div>
           </div>
         `;
        }).join("");
    }





    function displayUserData(parsedData) {
        
        const {
      totalQuestions,
      totalEasy,
      totalMedium,
      totalHard,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      acceptanceRate,
      ranking,
      contributionPoints,
      
    } = parsedData;

    // Update circular progress
    updateProgress(easySolved, totalEasy, easyLabel, easyCircle);
    updateProgress(mediumSolved, totalMedium, mediumLabel, mediumCircle);
    updateProgress(hardSolved, totalHard, hardLabel, hardCircle);

    // Render summary cards
    const cardData = [
      { label: "Total Solved", value: totalSolved },
      { label: "Total Questions", value: totalQuestions },
      { label: "Acceptance Rate", value: `${acceptanceRate}%` },
      { label: "Ranking", value: ranking },
      { label: "Contribution Points", value: contributionPoints }
    ];

    cardsContainer.innerHTML = cardData
      .map(
        (card) => `
        <div class="card">
          <h3>${card.label}</h3>
          <p>${card.value}</p>
        </div>
      `
      )
      .join("");

      renderSubmissionCalendar(parsedData.submissionCalendar);

  }

    // Listen for username
    searchButton.addEventListener("click", function() {
        const username = usernameInput.value;

        if(validateUsername(username)) {
            fetchUserDetails(username);
        }
        
    })

})