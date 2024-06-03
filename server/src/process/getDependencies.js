const axios = require('axios');

// Replace with your GitHub token
const GITHUB_TOKEN = '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';
const HEADERS = { 'Authorization': `token ${GITHUB_TOKEN}` };

// Function to get repositories of a user
async function getStudentRepositories(username) {
    const url = `https://api.github.com/users/${username}/repos`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        return response.data;
    } catch (error) {
        console.error(`Error fetching repositories for ${username}:`, error.message);
        return [];
    }
}

// Function to get languages used in a repository
async function getLanguages(repoOwner, repoName) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/languages`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        return response.data;
    } catch (error) {
        console.error(`Error fetching languages for ${repoName}:`, error.message);
        return {};
    }
}

// Function to list files in a repository directory
async function listFiles(repoOwner, repoName, dirPath = '') {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${dirPath}`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        if (response.status === 200) {
            return response.data.map(file => file.path);
        }
    } catch (error) {
        console.error(`Error listing files in ${dirPath} for ${repoName}:`, error.message);
        return [];
    }
}

// Function to get the content of a file in a repository
async function getFileContent(repoOwner, repoName, filePath) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        if (response.status === 200) {
            const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return fileContent;
        }
    } catch (error) {
        console.error(`Error fetching file content for ${filePath} in ${repoName}:`, error.message);
        return null;
    }
}

// Function to determine the dependency file based on language
function determineDependencyFiles(languages) {
    const files = [];
    if (languages.JavaScript) files.push('package.json');
    if (languages.Python) files.push('requirements.txt');
    if (languages.Java) files.push('pom.xml', 'build.gradle');
    if (languages.Ruby) files.push('Gemfile');
    if (languages.PHP) files.push('composer.json');
    if (languages.Go) files.push('go.mod');
    if (languages['C#']) files.push('packages.config', '*.csproj'); // Add .csproj for .NET Core
    if (languages.C++) files.push('CMakeLists.txt');
    return files;
}

// Function to search for dependency files in repository
async function searchForDependencyFile(repoOwner, repoName, files) {
    const directories = ['', 'src', 'app', 'backend', 'frontend', 'lib', 'Assets', 'Packages']; // Common directories to search in
    for (const dir of directories) {
        for (const file of files) {
            const path = dir ? `${dir}/${file}` : file;
            const content = await getFileContent(repoOwner, repoName, path);
            if (content) {
                return { file, content };
            }
        }
    }
    return null;
}

// Main function to fetch repositories, languages, and file content
async function main(studentUsername) {
    const studentRepos = await getStudentRepositories(studentUsername);
    for (const repo of studentRepos) {
        const repoName = repo.name;

        // Get language statistics
        const languages = await getLanguages(studentUsername, repoName);
        console.log(`Repository: ${repoName} - Languages:`, languages);

        // List files in the root directory to debug structure
        const rootFiles = await listFiles(studentUsername, repoName);
        console.log(`Repository: ${repoName} - Root files:`, rootFiles);

        // Determine the appropriate dependency files
        const dependencyFiles = determineDependencyFiles(languages);
        if (dependencyFiles.length > 0) {
            // Search for the dependency files in common directories
            const result = await searchForDependencyFile(studentUsername, repoName, dependencyFiles);
            if (result) {
                const content = result.file.endsWith('.json') ? JSON.stringify(JSON.parse(result.content), null, 2) : result.content;
                console.log(`Repository: ${repoName} - ${result.file}:`, content);
            } else {
                console.log(`Repository: ${repoName} - No recognized dependency file found in common directories.`);
            }
        } else {
            console.log(`Repository: ${repoName} - No recognized dependency file found for the detected languages.`);
        }
    }
}

// Replace 'student_username' with the actual GitHub username
main('RazButbul');