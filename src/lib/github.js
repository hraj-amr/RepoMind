"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitHashes = exports.octokit = void 0;
var rest_1 = require("@octokit/rest");
exports.octokit = new rest_1.Octokit({
    auth: process.env.GITHUB_TOKEN,
});
var githubUrl = 'https://github.com/docker/genai-stack';
var getCommitHashes = function (githubUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var data, sortedCommits;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.octokit.rest.repos.listCommits({
                    owner: "docker",
                    repo: 'genai-stack'
                })];
            case 1:
                data = (_a.sent()).data;
                sortedCommits = data.sort(function (a, b) { return new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime(); });
                return [2 /*return*/, sortedCommits.slice(0, 15).map(function (commit) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                        return ({
                            commitHash: commit.sha,
                            commitMessage: (_a = commit.commit.message) !== null && _a !== void 0 ? _a : "",
                            commitAuthorName: (_d = (_c = (_b = commit.commit) === null || _b === void 0 ? void 0 : _b.author) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "",
                            commitAuthorAvatar: (_f = (_e = commit.author) === null || _e === void 0 ? void 0 : _e.avatar_url) !== null && _f !== void 0 ? _f : "",
                            commitDate: (_j = (_h = (_g = commit.commit) === null || _g === void 0 ? void 0 : _g.author) === null || _h === void 0 ? void 0 : _h.date) !== null && _j !== void 0 ? _j : ""
                        });
                    })];
        }
    });
}); };
exports.getCommitHashes = getCommitHashes;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _b = (_a = console).log;
                return [4 /*yield*/, (0, exports.getCommitHashes)(githubUrl)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error("An error occurred:", error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
// export const pollCommits = async(projectId: string) => {
//     const {project, githubUrl } = await fetchProjectGithubUrl(projectId)
//     const commitHashes = await getCommitHashes(githubUrl)
//     const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
//     const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
//         return summariseCommit(githubUrl, commit.commitHash)
//     }))
//     const summaries = summaryResponses.map((response) => {
//         if(response.status === 'fulfilled') {
//             return response.value as string
//         }
//         return ""
//     })
//     const commits = await db.commit.createMany({
//         data: summaries.map((summary, index) => {
//             const commit = unprocessedCommits[index];
//             return{
//                 projectId: projectId,
//                 commitHash: commit?.commitHash ?? "",
//                 commitMessage: commit?.commitMessage ?? "",
//                 commitAuthorName: commit?.commitAuthorName ?? "",
//                 commitAuthorAvatar: commit?.commitAuthorAvatar ?? "",
//                 commitDate: commit?.commitDate ? new Date(commit.commitDate) : new Date(),
//                 summary
//             }
//         })
//     })
//     return commits
// }
// async function summariseCommit(githubUrl: string, commitHash: string) {
//     const response = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
//         headers: {
//             Accept: 'application/vnd.github.v3.diff'
//         }
//     })
//     const data = response.data;
//     return await aiSummariseCommit(data) || ""
// }
// async function fetchProjectGithubUrl(projectId: string) {
//     const project = await db.project.findUnique({
//         where: {id: projectId},
//         select: {
//             githubUrl: true
//         }
//     })
//     if(!project?. githubUrl){
//         throw new Error("Project has no github url")
//     }
//     return {project, githubUrl: project?.githubUrl}
// }
// async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]){
//     const processedCommits = await db.commit.findMany({
//         where: { projectId }
//     })
//     const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommits) => processedCommits.commitHash === commit.commitHash))
//     return unprocessedCommits
// }
