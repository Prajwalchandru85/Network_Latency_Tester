const socket = new WebSocket("ws://localhost:8080");

const latencyDisplay = document.getElementById("latency");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatBox = document.getElementById("chatBox");

const latencyChartCtx = document.getElementById("latencyChart").getContext("2d");

// Chart.js setup
let latencyData = [];
let timeLabels = [];

const latencyChart = new Chart(latencyChartCtx, {
    type: "line",
    data: {
        labels: timeLabels,
        datasets: [{
            label: "Latency (ms)",
            data: latencyData,
            borderColor: "#00bfff",
            backgroundColor: "rgba(0, 191, 255, 0.2)",
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});

socket.onopen = () => {
    console.log("Connected to WebSocket server");
};

socket.onmessage = (event) => {
    const receivedTime = Date.now();
    const data = JSON.parse(event.data);

    if (data.sentTime) {
        const latency = receivedTime - data.sentTime;
        latencyDisplay.innerText = `Latency: ${latency} ms`;

        // Update latency graph
        if (timeLabels.length > 10) {
            timeLabels.shift();
            latencyData.shift();
        }
        timeLabels.push(new Date().toLocaleTimeString());
        latencyData.push(latency);
        latencyChart.update();

        // Display the message in the chat box
        chatBox.innerHTML += `<p class="server-message"><strong>Server:</strong> ${data.text} <em>(${latency} ms)</em></p>`;
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }
};

sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        const data = JSON.stringify({ text: message, sentTime: Date.now() });
        socket.send(data);

        // Display the sent message
        chatBox.innerHTML += `<p class="client-message"><strong>You:</strong> ${message}</p>`;
        chatBox.scrollTop = chatBox.scrollHeight;
        messageInput.value = "";
    }
});
