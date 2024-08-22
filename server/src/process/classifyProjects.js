// classifyProject.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getDependencies } = require('./getDependencies');
const apiKey = 'sk-proj-VWxtg1F0pfb07PTPjz4aT3BlbkFJraVGytbb9BIFQHZdeheD'; 

async function classifyProjectArea(dependencies) {
    const prompt = `Classify the project area based on the following dependencies into one of the following areas: Full stack development, cyber, data analytics, game development, algorithms:
    \n${dependencies.map(dep => `File: ${dep.file}\nContent: ${dep.content}`).join('\n\n')}`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: 'You are an assistant that classifies projects based on their dependencies into one of the following areas: Full stack development, cyber, data analytics, game development, algorithms.' },
                { role: 'user', content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const result = response.data.choices[0].message.content;
        // Extracting classifications from the result
        const classifications = result.match(/full stack development|cyber|data analytics|game development|algorithms/gi);
        return classifications || ['No classification found'];
    } catch (error) {
        console.error('Error classifying project area:', error.response ? error.response.data : error.message);
        return ['Error classifying project area'];
    }
}

async function main() {
    const studentUsername = 'JavierGiberg'; 

    try {
        const dependencies = await getDependencies(studentUsername);
        if (dependencies.length === 0) {
            console.log('No dependencies found for the projects.');
            return;
        }

        const classification = await classifyProjectArea(dependencies);
        console.log('Project classification:', classification);
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

if (require.main === module) {
    main().catch(error => console.error('Error in main function:', error));
}

module.exports = { classifyProjectArea };