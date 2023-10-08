export default class WebSocketClient {
    private webSocket: WebSocket | null = null;

    private sender: string = 'admin';

    private onMessageReceived: (message: never) => void; // Callback to handle incoming messages

    constructor(options: { onMessageReceived: (message: never) => void }, uuid: string) {
        this.onMessageReceived = options.onMessageReceived;

        // Get WebSocket URL based on the current host
        const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const { host } = window.location;
        const path = `/ws/chat/${uuid}/${this.sender}/`; // Replace with your actual WebSocket path

        const webSocketUrl = `${protocol}${host}${path}`;
        // Connect to WebSocket server
        this.connectWebSocket(webSocketUrl);
    }

    connectWebSocket(webSocketUrl: string) {
        this.webSocket = new WebSocket(webSocketUrl);

        this.webSocket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        this.webSocket.onmessage = (event) => {
            const message = JSON.parse(event.data) as object;
            // Handle incoming messages from the WebSocket server
            console.log('Message received:', message.message);
            this.handleMessage(message.message);
        };

        this.webSocket.onclose = (event) => {
            console.log('WebSocket connection closed.', event.code, event.reason);
        };

        this.webSocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleMessage(message: object) {
        // Handle incoming messages from the WebSocket server
        // Add logic to process the message data if needed

        // Assuming the message is in JSON format, parse it

        // Call the onMessageReceived callback with the parsed message
        if (this.onMessageReceived) {
            this.onMessageReceived(message);
        }
    }

    sendMessage(message: object) {
        // Send a message to the WebSocket server
        console.log(message);
        this.webSocket?.send(JSON.stringify({ message }));
    }

    closeConnection() {
        // Close WebSocket connection
        if (this.webSocket) {
            this.webSocket.close();
        }
    }
}
