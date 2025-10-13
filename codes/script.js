  const quotes = [
    //motivation, psychology
    "Until death, all defeat is psychological",
    "The only real test of intelligence is if you get what you want out of life",
    
    `Ask yourself: "How can I accomplish my 10-year plan in 6 months?" 
    
    You will probably fail, but you'll be far ahead if you accept it would take 10 years`,

    "Let the young man in his desperation go out and hunt. If he kills the elephant, his poverty ends; if the elephant kills him, his poverty ends.",
    "The way life goes on after people die is one of the most humbling and scary things in life.",
    
    `"How do men take care of their mental health if they don't talk to anyone about their struggles?"

    They believe that you can solve every problem by getting jacked and making more money`,

    

    
    // finance
    "You don't quit playing the game you enjoy because you got a high score",
    "You act too quickly when you are trying to grow capital, and you act too slowly when you are trying to protect capital",
    "Only way to not blow up in the long run is to basically constantly be thinking about blowing up",
    "You want the salesperson who can sell ice to Eskimos, not the one who can sell water in a desert",
    "Imagine having risk management in the riskiest asset class on planet earth",
    `The worst thing to come from this cycle was convincing thousands of young men at prime productivity age that "trenching" was a possible career path.`,
    
    `"How did we get so poor mom?"

    "Your Dad spent more time collecting knowledge than acting on it."`,

    "Don't fear the volatility, capitalize on it.",

    "If money is evil then crypto is hell. This is the most obnoxious group of money hungry, low IQ, high energy, jack rabbit, wannabe-big-time, small time, shit talking bothersome, irritating bunch of motherfuckers, ... I have ever had to endure for more than five minutes",

    
    
    // life tips
    `When I look back on my past and think how much time I wasted on nothing, how much time has been lost in futilities, errors, laziness, incapacity to live; how little I appreciated it, how many times I sinned against my heart and soul-then my heart bleeds. Life is a gift, life is happiness, every minute can be an eternity of happiness!`,
    `Lately when I meet new people, I ask them what their hobbies are instead of what they do for work, and let me tell you, the conversations have been absolutely top tier!`,
    `I asked my parents what kept them together all these years & my dad said "WE NEVER GAVE UP ON THE SAME DAY."`,
    "Instead of regretting that you can't wake up at age 18 again, pretend to yourself that you're 90 and you've woken up at age 40 again, and that you get to magically, wonderfully have the next 50 years again.",
    "If you need to be rude, aggressive to make your point or to have an argument then I know for a fact you're just a weak man and will never show respect or admiration towards you",
    
    `Imagine reading a book with no way to turn back the page. 
    
    How carefully would you read it?
    
    That's life`,

    `My dad just called me outta school because "it was a nice day"`,

    `My partner keep showing orange juice to our orange cat and saying, “this is what happens to bad orange kitties” and then drinking it menacingly`,

    `Being honest may not get you a lot of friends, but it'll always get you the right ones.`,


  ];
  
  const images = [
    { url: "https://s14.gifyu.com/images/bwqfZ.gif", clockPosition: "top" },
    { url: "https://i.giphy.com/11D0XkJInM2ssU.webp", clockPosition: "top" },
    { url: "https://c.tenor.com/rdavuU_zkdcAAAAd/tenor.gif", clockPosition: "top" },
    { url: "https://media4.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3ZnhkZHRrcWlwd3drenprOGR6cHR4OWF5N2tiMXBtbG9sMXpibG14NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/N5B19awm2YvwMwf8JE/giphy.webp", clockPosition: "top" },
    { url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWNpNXg3cjR4MnMzd2RlOHplY3Aza3c3c2Fjc2hzczIwZjE1dmN3ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aT3K8yqIURSamDTl6c/giphy.gif", clockPosition: "top" },
    { url: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTE0NmdqNGJidHluYTZlYnViNWRrOG9tbW1qcHB4d3o3azZybnF1aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qpNkCSUtOJrG8y8kHS/giphy.gif", clockPosition: "top" },
    
    { url: "https://s14.gifyu.com/images/bwqNi.gif", clockPosition: "center" },
    { url: "https://c.tenor.com/4XJK04-9ZdsAAAAd/tenor.gif", clockPosition: "center" },
    
    { url: "https://s14.gifyu.com/images/bwqNj.gif", clockPosition: "bottom" },
    { url: "https://c.tenor.com/nqMC-PZUsUwAAAAd/tenor.gif", clockPosition: "bottom" },
    { url: "https://i.giphy.com/rDFskmIkk7iKU5YcZK.webp", clockPosition: "bottom" },
    { url: "https://c.tenor.com/dFRmjNDK9TwAAAAd/tenor.gif", clockPosition: "bottom" },
    { url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG1xOG9hNzMzN2ZhZWhyZGxueTNmYWkxbjA2OGEyc3ZoMnhhdm96eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4lV5rnDf3rJZ8kKD7K/giphy.gif", clockPosition: "bottom" },
    { url: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMDdvc3oxMTdwOG02MnhhdnUxMHgxejBjangxdXFqazF0ZHh6ZWo3diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/x1SBCCQ5Rcj9kUbqgV/giphy.gif", clockPosition: "bottom" },
  ];
  
//#region quotes + images

  let shuffledQuotes = shuffleArray([...quotes]);
  let shuffledImages = shuffleArray([...images]);

  // Index trackers
  let quoteIndex = 0;
  let imageIndex = 0;

  showQuote();
  showImage();
  setInterval(showQuote, 300000); // show next item every 5 minutes
  setInterval(showImage, 600000*6); // show next item every 1 hours

  // Arrow click -> show next item in shuffled list
  document.getElementById("nextArrow").addEventListener("click", refreshContent);

  function showQuote() {
    const quoteElement = document.getElementById("quote");
    const currentQuote = shuffledQuotes[quoteIndex];
    quoteElement.innerText = currentQuote;
    quoteIndex = (quoteIndex + 1) % shuffledQuotes.length; // move next

    adjustLeftPanel();
  }

  function showImage() {
    const imageElement = document.getElementById("randomImage");
    const clockElement = document.getElementById("hanoi-clock");

    const currentImage = shuffledImages[imageIndex];
    
    const imageUrl = currentImage.url;
    const clockPosition = currentImage.clockPosition;

    imageElement.src = imageUrl;

    // Reset clock position classes
    clockElement.classList.remove("clock-top", "clock-center", "clock-bottom");
    clockElement.classList.add(`clock-${clockPosition}`);

    imageIndex = (imageIndex + 1) % shuffledImages.length; // move next
  }

  function adjustLeftPanel() {
    const leftPanel = document.getElementById('left');
    const quote = document.getElementById('quote');
    const quoteLength = quote.innerText.length;

    if(quoteLength > 220) {
      leftPanel.style.flex = "0 0 33%";
      quote.style.fontSize = "1.6rem";
    }
    else if (quoteLength > 160 || quote.innerText.includes("\n")) {
      leftPanel.style.flex = "0 0 33%";
      quote.style.fontSize = "2rem";
    }
    else if (quoteLength > 130) {
      leftPanel.style.flex = "0 0 28%";
      quote.style.fontSize = "2rem";
    }
    else {
      leftPanel.style.flex = "0 0 22%";
      quote.style.fontSize = "2rem";
    }
  }

  function refreshContent() {
      showQuote();
      showImage();
  }

  // Shuffle helper (Fisher–Yates)
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

//#endregion

//#region World clocks
  const places = [
    { name: "California", tz: "America/Los_Angeles" },
    { name: "New York", tz: "America/New_York" },
    { name: "London", tz: "Europe/London" },
    { name: "Berlin", tz: "Europe/Berlin" },
    { name: "Riyadh", tz: "Asia/Riyadh" },
    //{ name: "Hanoi", tz: "Asia/Ho_Chi_Minh" },
    { name: "Beijing", tz: "Asia/Shanghai" },
    { name: "Tokyo", tz: "Asia/Tokyo" },
    { name: "Sydney", tz: "Australia/Sydney" }
  ];
  

  updateClocks();
  updateHanoiClock();

  setInterval(updateClocks, 1000);
  setInterval(updateHanoiClock, 1000);

  function updateClocks() {
    const tbody = document.querySelector("#clocks tbody");
    tbody.innerHTML = "";
    places.forEach(place => {
      const tr = document.createElement("tr");
      const tdPlace = document.createElement("td");
      tdPlace.textContent = place.name;
      const tdTime = document.createElement("td");
      tdTime.textContent = new Date().toLocaleTimeString("en-US", {
        timeZone: place.tz,
        hour: "2-digit",
        minute: "2-digit"
      });
      tr.appendChild(tdPlace);
      tr.appendChild(tdTime);
      tbody.appendChild(tr);
    });
  }

  function updateHanoiClock() {
    const now = new Date();

    const options = {
      timeZone: "Asia/Bangkok",
      weekday: "short", // adds Mon, Tue, etc.
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    const formatted = new Intl.DateTimeFormat("en-GB", options).format(now);

    // formatted looks like: "Mon, 06 Oct 2025, 21:45"
    const [weekdayAndDate, time] = formatted.split(", ").length === 3
      ? [`${formatted.split(", ")[0]}, ${formatted.split(", ")[1]}`, formatted.split(", ")[2]]
      : [formatted, ""];

    document.getElementById("hanoi-clock").innerHTML = `
      <div>${time}</div>
      <div style="font-size: 1.2rem; opacity: 0.9;">${weekdayAndDate}</div>
    `;
  }
//#endregion

//#region Drag-to-resize functionality
  const container = document.getElementById("container");
  let isDragging = false;
  let currentDivider = null;
  
  document.querySelectorAll(".divider").forEach(divider => {
    divider.addEventListener("mousedown", e => {
      isDragging = true;
      currentDivider = divider;
      document.body.style.cursor = "col-resize";
    });
  });
  
  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
  
    const leftPanel = document.getElementById("left");
    const rightPanel = document.getElementById("right");
  
    if (currentDivider.id === "divider-left") {
      const newWidth = e.clientX;
      if (newWidth > 100 && newWidth < window.innerWidth - 200) {
        leftPanel.style.flex = "none";
        leftPanel.style.width = newWidth + "px";
      }
    } else if (currentDivider.id === "divider-right") {
      const containerRect = container.getBoundingClientRect();
      const newRightWidth = containerRect.right - e.clientX;
      if (newRightWidth > 100 && newRightWidth < window.innerWidth - 200) {
        rightPanel.style.flex = "none";
        rightPanel.style.width = newRightWidth + "px";
      }
    }
  });
  
  document.addEventListener("mouseup", () => {
    isDragging = false;
    currentDivider = null;
    document.body.style.cursor = "default";
  });
//#endregion