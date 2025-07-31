import axios from 'axios';

// API Service Class
class GeminiService {
    axiosInstance: any;
    baseUrl: string;
    constructor() {
    this.baseUrl = 'http://localhost:8082/chat';
    this.axiosInstance = axios.create({
        baseURL: this.baseUrl,
        headers: {
        'Content-Type': 'application/json',
        },
    });
    }

    // Send message to API
    async sendMessage(message) {
    if (!message || message.length > 500) {
        throw new Error('Message must be non-empty and less than 500 characters.');
    }
    try {
        const response = await this.axiosInstance.post('/query', { message });
        return response.data;
    } catch (error) {
        throw new Error('Failed to communicate with the server. Please try again.');
    }
    }
}

export { GeminiService };