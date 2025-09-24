import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  while (true) {
    //hitting end point and getting data
    const { data } = await axios.request(
      {
        method: "GET",
        url: `${process.env.JUDGE0_API_URL}/submissions/batch`,
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY,
          "x-rapidapi-host": process.env.RAPID_API_HOST,
        },
      }
    );
    const results = data.submissions;
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;
    await sleep(1000);
  }
};

export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export async function submitBatch(submissions) {
  const results = [];
  for (const sub of submissions) {
    const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: sub.language,
      version: sub.version,
      files: [{ name: "Main", content: sub.source_code }],
      stdin: sub.stdin,
    });
    results.push({
      stdout: res.data.run.stdout,
      stderr: res.data.run.stderr,
      expected_output: sub.expected_output,
    });
  }
  return results;
}


// export const submitBatch = async (submissions) => {
//   const { data } = await axios.request(
//     {
//       method: "POST",
//       url: `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
     
//       headers: {
//         "x-rapidapi-key": process.env.RAPID_API_KEY,
//         "x-rapidapi-host": process.env.RAPID_API_HOST,
//       },
//       data: {
//         submissions,
//       },
//     }
//   );

//   return data;
// };
