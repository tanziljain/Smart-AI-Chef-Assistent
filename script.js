document.addEventListener("DOMContentLoaded", function () {
    const elements = {
        startButton: document.getElementById("start-button"),
        navLinks: document.querySelectorAll(".nav-link"),
        pages: document.querySelectorAll(".page"),
        recipeForm: document.getElementById("recipe-form"),
        recipeOutput: document.getElementById("recipe-output"),
        savedRecipesList: document.querySelector(".saved-recipes-list"),
        loginModal: document.getElementById("login-modal"),
        loginForm: document.getElementById("loginForm"),
        signupForm: document.getElementById("signupForm"),
        showLogin: document.getElementById("show-login"),
        showSignup: document.getElementById("show-signup"),
        loginButton: document.getElementById("login-button"),
        logoutButton: document.getElementById("logout-button"),
        voiceAssistantButton: document.getElementById("voice-assistant-button"),
        chatbotInput: document.getElementById("chatbot-input"),
        chatbotOutput: document.getElementById("chatbot-output"),
        chatbotSubmit: document.getElementById("chatbot-submit"),
        badgeContainer: document.getElementById("badge-container")
    };

    // Initialize state
    let users = JSON.parse(localStorage.getItem('recipeGenUsers')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let savedRecipes = JSON.parse(localStorage.getItem(`userRecipes_${currentUser?.email}`)) || [];
    let userBadges = JSON.parse(localStorage.getItem("userBadges")) || [];

    function updateAuthUI() {
        if (currentUser) {
            elements.loginButton.classList.add('hidden');
            elements.userProfile.classList.remove('hidden');
            elements.usernameDisplay.textContent = currentUser.name;
        } else {
            elements.loginButton.classList.remove('hidden');
            elements.userProfile.classList.add('hidden');
        }
    }

    // Handle Start Button click
    elements.startButton.addEventListener("click", function () {
        showPage("recipe-page");
    });

    // Function to show a specific page and hide others
    function showPage(pageId) {
        elements.pages.forEach(page => {
            page.style.display = page.id === pageId ? "block" : "none";
        });
    }

    // Handle Chatbot Submit
    elements.chatbotSubmit.addEventListener("click", function () {
        const message = elements.chatbotInput.value;
        if (message) {
            handleChatbotMessage(message);
            elements.chatbotInput.value = ""; // Clear input field
        }
    });

    function handleChatbotMessage(message) {
        let response = "";
        if (message.includes("calories")) {
            response = "A healthy meal typically contains around 500-700 calories.";
        } else if (message.includes("suggest a meal")) {
            response = "How about a grilled chicken salad with mixed vegetables?";
        } else if (message.includes("what should I eat")) {
            response = "Try a balanced diet including lean proteins, healthy fats, and lots of veggies!";
        } else {
            response = "I'm here to help! Please ask me about your diet or meal preferences.";
        }
        displayChatbotResponse(response);
    }

    function displayChatbotResponse(response) {
        const responseElement = document.createElement("div");
        responseElement.classList.add("chatbot-message");
        responseElement.innerHTML = `<strong>DietBot:</strong> ${response}`;
        elements.chatbotOutput.appendChild(responseElement);
        elements.chatbotOutput.scrollTop = elements.chatbotOutput.scrollHeight;
    }

    // Handle Voice Assistant Button
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    let isListening = false;
    elements.voiceAssistantButton.addEventListener("click", function () {
        if (isListening) {
            stopVoiceAssistant();
        } else {
            startVoiceAssistant();
        }
    });

    function startVoiceAssistant() {
        recognition.start();
        isListening = true;
        elements.voiceAssistantButton.textContent = "Stop Listening";
    }

    function stopVoiceAssistant() {
        recognition.stop();
        isListening = false;
        elements.voiceAssistantButton.textContent = "Start Listening";
    }

    recognition.onresult = function (event) {
        const command = event.results[event.resultIndex][0].transcript.toLowerCase();
        if (command.includes("recipe")) {
            generateRecipeFromVoice(command);
        } else if (command.includes("sugar")) {
            showBloodSugarTracker();
        } else if (command.includes("logout")) {
            logoutUser();
        }
    };

    function generateRecipeFromVoice(command) {
        const ingredients = command.split("recipe")[1].trim();
        document.getElementById("ingredients").value = ingredients;
        document.getElementById("recipe-form").submit();
    }

    function showBloodSugarTracker() {
        showPage("dashboard");
    }

    function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        savedRecipes = [];
        updateAuthUI();
    }

    // Initialize Badge System
    function updateBadgeSystem() {
        elements.badgeContainer.innerHTML = "";
        userBadges.forEach(badge => {
            const badgeElement = document.createElement("div");
            badgeElement.classList.add("badge");
            badgeElement.textContent = badge;
            elements.badgeContainer.appendChild(badgeElement);
        });
    }

    function checkAndAwardBadge(action) {
        if (!userBadges.includes(action)) {
            userBadges.push(action);
            localStorage.setItem("userBadges", JSON.stringify(userBadges));
            updateBadgeSystem();
        }
    }

    // Call the badge system when generating a recipe
    document.getElementById("generate-recipe-button").addEventListener("click", function () {
        checkAndAwardBadge("Generated 5 Recipes");
    });

    // Initial setup
    updateAuthUI();
    updateBadgeSystem();
});
