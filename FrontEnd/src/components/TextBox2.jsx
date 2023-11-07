import React from 'react';
import '../css/Home.css';

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversation: [],
            userMessage: '',
        };
    }

    handleChange = (event) => {
        this.setState({ userMessage: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const prompt = this.state.userMessage;
        const response = await this.postChatMessage(prompt);
        this.updateConversation(prompt, response);
    };

    postChatMessage = async (prompt) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.VITE_BEARER_TOKEN,
            },
            body: JSON.stringify({
                "input": {
                    "prompt": "[INST] <<SYS>>You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.<</SYS>>" + prompt + "[/INST]",
                    "max_new_tokens": 500,
                    "temperature": 0.9,
                    "top_k": 50,
                    "top_p": 0.7,
                    "repetition_penalty": 1.2,
                    "batch_size": 8,
                    "stop": [
                        "</s>"
                    ]
                }
            })
        };

        try {
            const response = await fetch('https://api.runpod.ai/v2/tsddif1jle8o98/runsync', requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.output;
        } catch (error) {
            console.error('There was an error!', error);
            return "Sorry, there was an issue getting the response.";
        }
    };

    updateConversation = (prompt, responseText) => {
        const userMessage = { sender: 'user', text: prompt };
        const chatbotMessage = { sender: 'chatbot', text: responseText };
    
        this.setState(prevState => ({
            conversation: [...prevState.conversation, userMessage, chatbotMessage],
            userMessage: ''
        }));
    
        console.log("My input: ", userMessage);
        console.log("Model output: ", chatbotMessage);
    };
    
    

    render() {
        return (
            <div className="flex flex-col h-screen">
                <div className="overflow-auto p-4 flex-grow">
                    <div className="flex flex-col gap-2">
                        {this.state.conversation.map((message, index) => (
                            <div key={index} className={`max-w-3/4 ${
                                message.sender === 'chatbot' ? 'self-start bg-blue-100 rounded-l-none' : 'self-end bg-gray-300 rounded-r-none'
                            } rounded-md p-2`}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} className="p-4 bg-white border-t-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={this.state.userMessage}
                            onChange={this.handleChange}
                            placeholder="Ask me anything..."
                            className="flex-grow p-2 border rounded-md"
                        />
                        <button
                            type="submit"
                            className="p-2 bg-blue-500 text-white rounded-md"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}