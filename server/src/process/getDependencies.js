const axios = require('axios');

const GITHUB_TOKEN = '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';
const HEADERS = { 'Authorization': `token ${GITHUB_TOKEN}` };

const DEPENDENCY_CONFIG = {
    JavaScript: { files: ['package.json'], dirs: [''] },
    TypeScript: { files: ['package.json', 'tsconfig.json'], dirs: [''] },
    Python: { files: ['requirements.txt'], dirs: ['', 'src', 'app'] },
    Java: { files: ['pom.xml', 'build.gradle','.classpath'], dirs: ['', 'src'] },
    'C#': { files: ['packages.config', '*.csproj', 'manifest.json'], dirs: ['', 'src', 'Packages'] },
    C: { files: ['CMakeLists.txt'], dirs: [''] },
    'C++': { files: ['CMakeLists.txt'], dirs: [''] },
    Html: { files: ['package.json', 'index.html'], dirs: [''] },
    Css: { files: ['package.json', 'style.css'], dirs: [''] },  
    Ruby: { files: ['Gemfile'], dirs: [''] },
    Shell: { files: ['*.sh'], dirs: [''] },
};


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

async function getFileContent(repoOwner, repoName, filePath) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    try {
        const response = await axios.get(url, { headers: HEADERS });
        if (response.status === 200) {
            const fileContent = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return fileContent;
        }
    } catch (error) {
        throw new Error(`Error fetching file content for ${filePath} in ${repoName}: ${error.message}`);
    }
}

async function searchForDependencyFiles(repoOwner, repoName, languageConfig) {
    const dependencies = [];
    const { files, dirs } = languageConfig;

    const searchTasks = [];
    for (const dir of dirs) {
        for (const file of files) {
            const path = dir ? `${dir}/${file}` : file;
            searchTasks.push(
                getFileContent(repoOwner, repoName, path)
                    .then(content => {
                        dependencies.push({ file: path, content });
                    })
                    .catch(error => {
                        if (!error.message.includes('404')) {
                            console.error(`Error fetching file: ${path} in ${repoName} - ${error.message}`);
                        }
                    })
            );
        }
    }

    await Promise.allSettled(searchTasks);
    return dependencies;
}

function getMainLanguage(languages) {
    let mainLanguage = null;
    let maxBytes = 0;
    for (const [language, bytes] of Object.entries(languages)) {
        if (bytes > maxBytes) {
            mainLanguage = language;
            maxBytes = bytes;
        }
    }
    return mainLanguage;
}

async function getDependencies(studentUsername) {
    const studentRepos = await getStudentRepositories(studentUsername);
    const allDependencies = [];

    const repoTasks = studentRepos.map(async (repo) => {
        const repoName = repo.name;

        const languages = await getLanguages(studentUsername, repoName);
        console.log(`Repository: ${repoName} - Languages:`, languages);

        const mainLanguage = getMainLanguage(languages);
        if (!mainLanguage || !DEPENDENCY_CONFIG[mainLanguage]) {
            console.log(`Repository: ${repoName} - No recognized main language or no dependency configuration available.`);
            return;
        }

        const languageConfig = DEPENDENCY_CONFIG[mainLanguage];

        const dependencies = await searchForDependencyFiles(studentUsername, repoName, languageConfig);
        if (dependencies.length > 0) {
            allDependencies.push(...dependencies);
        } else {
            console.log(`Repository: ${repoName} - No recognized dependency file found in specified directories.`);
        }
    });

    await Promise.all(repoTasks);
    return allDependencies;
}

async function main() {
    const studentUsername = 'JavierGiberg'; // Replace with the actual GitHub username
    try {
        const dependencies = await getDependencies(studentUsername);
        console.log('Dependencies:', JSON.stringify(dependencies, null, 2));
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

if (require.main === module) {
    main().catch(error => console.error('Error in main function:', error));
}

module.exports = { getDependencies };