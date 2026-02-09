// Handle form submission
document.getElementById("supportForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;

    document.getElementById("formResponse").innerText =
        "Thank you, " + name + ". Your " + category + " request has been received.";
});

// Rule-based chatbot (reliable fallback)
function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.toLowerCase();
    const chat = document.getElementById("chatMessages");

    if (message === "") return;

    chat.innerHTML += "<p><b>You:</b> " + input.value + "</p>";

    let reply = "Thank you for reaching out. Our team will respond soon.";

    if (message.includes("emergency")) {
        reply = "If this is an emergency, please contact local emergency services immediately.";
    } else if (message.includes("mental")) {
        reply = "Mental health support is important. Please consider reaching out to a trusted person or professional.";
    } else if (message.includes("volunteer")) {
        reply = "Thank you for your interest in volunteering! Please fill out the form above.";
    } else if (message.includes("help")) {
        reply = "Please describe your concern using the support form.";
    }

    chat.innerHTML += "<p><b>CareBot:</b> " + reply + "</p>";
    input.value = "";
}
