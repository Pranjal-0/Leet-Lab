// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// // FIX 1: "PYHTON" was missing an 'N'
// export const getJudge0LanguageId = (Language) => {
//     const languageMap = {
//         "PYTHON": 71,
//         "JAVA": 62,
//         "JAVASCRIPT": 63,
//     };

//     return languageMap[Language.toUpperCase()];
// }; 

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // export const pollBatchResults = async (tokens) => {
// //     while (true) {
// //         const { data } = await axios.get(`${process.env.JUDGE_API_URL}/submissions/batch`, { // FIX 2: Removed the double slash '//'
// //             params: {
// //                 tokens: tokens.join(","),
// //                 base64_encoded: false,
// //             }
// //         });
        
// //         const results = data.submissions;
// //         const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);

// //         if (isAllDone) return results;
// //         await sleep(1000);
// //     }
// // };

// export const pollBatchResults = async (tokens) => {
//     while (true) {
//         const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
//             params: {
//                 tokens: tokens.join(","),
//                 base64_encoded: false,
//             },
//             headers: {
//                 "X-Auth-Token": process.env.JUDGE_AUTH_TOKEN,
//             },
//         });

//         const results = data.submissions;
//         const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);
//         if (isAllDone) return results;
//         await sleep(1000);
//     }
// };

// // export const submitBatch = async (submissions) => {
// //     const { data } = await axios.post(`${process.env.JUDGE_API_URL}/submissions/batch?base64_encoded=false&wait=false`, {
// //         submissions
// //     });

// //     console.log("submissions results: ", data);

// //     return data;
// // };

// export const submitBatch = async (submissions) => {
//     const { data } = await axios.post(
//         `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false&wait=false`,
//         { submissions },
//         {
//             headers: {
//                 "X-Auth-Token": process.env.JUDGE_AUTH_TOKEN,
//             },
//         }
//     );
//     console.log("submissions results: ", data);
//     return data;
// };


import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getJudge0LanguageId = (Language) => {
    const languageMap = {   
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    };
    return languageMap[Language.toUpperCase()];
}; 

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// CodeBox requires this specific header with your dev-token
const codeBoxHeaders = {
    "X-Auth-Token": process.env.JUDGE_AUTH_TOKEN // This reads "dev-token" from your .env
};

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            },
            headers: codeBoxHeaders // Added password here
        });
        
        const results = data.submissions;
        const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);

        if (isAllDone) return results;
        await sleep(1000);
    }
};

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`, {
        submissions
    }, {
        headers: codeBoxHeaders // Added password here
    });

    return data;
};