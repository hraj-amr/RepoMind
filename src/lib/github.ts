import { Octokit } from '@octokit/rest';
import { db } from '@/server/db';
import axios from 'axios';
import { aiSummariseCommit } from './gemini';

export const octokit = new Octokit({ 
    auth: process.env.GITHUB_TOKEN, 
});
const githubUrl = 'https://github.com/docker/genai-stack'

type Response = {
    commitMessage: string;
    commitHash: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const { data } = await octokit.rest.repos.listCommits({
        owner: "docker",
        repo: 'genai-stack'
    })
    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]

    return sortedCommits.slice(0,15).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name??"",
        commitAuthorAvatar: commit.author?.avatar_url??"",
        commitDate: commit.commit?.author?.date??""
    }))

}
(async () => {
    try {
        console.log(await getCommitHashes(githubUrl));
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();

export const pollCommits = async(projectId: string) => {
    const {project, githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommit(githubUrl, commit.commitHash)
    }))
    const summaries = summaryResponses.map((response) => {
        if(response.status === 'fulfilled') {
            return response.value as string
        }
        return ""
    })

    const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            const commit = unprocessedCommits[index];
            return{
                projectId: projectId,
                commitHash: commit?.commitHash ?? "",
                commitMessage: commit?.commitMessage ?? "",
                commitAuthorName: commit?.commitAuthorName ?? "",
                commitAuthorAvatar: commit?.commitAuthorAvatar ?? "",
                commitDate: commit?.commitDate ? new Date(commit.commitDate) : new Date(),
                summary
            }
        })
    })
    return commits
}

async function summariseCommit(githubUrl: string, commitHash: string) {
    const response = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    const data = response.data;
    return await aiSummariseCommit(data) || ""
}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: {id: projectId},
        select: { githubUrl: true }
    })
    if(!project?. githubUrl){
        throw new Error("Project has no github url")
    }
    return {project, githubUrl: project?.githubUrl}
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]){
    const processedCommits = await db.commit.findMany({
        where: { projectId }
    })
    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommits) => processedCommits.commitHash === commit.commitHash))
    return unprocessedCommits
}

