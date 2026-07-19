import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../libs/judge0.js";
import { db } from "../libs/db.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions
  } = req.body;

  if (req.user.role != "ADMIN") {
    return res.status(403).json({ error: "you are not allowed to create a problem" });
  }

  try {
    // 1. Loop through every language's reference solution
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      
      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
      }

      // 2. Package test cases for CodeBox
      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      // 3. Send to CodeBox and wait for results
      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      // DEBUG: Print what CodeBox said about Test 1
      console.log("PYTHON RESULT:", JSON.stringify(results[0], null, 2));

      // 4. Check if test cases passed
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // Status ID 3 means "Accepted"
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // 5. If ALL tests passed for ALL languages, save to Postgres!
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions: referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({ 
      message: "Problem created and verified successfully!", 
      problem: newProblem 
    });

  } catch (error) {
    console.error("Error creating problem:", error);
    return res.status(500).json({ error: "Something went wrong while creating the problem" });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    return res.status(200).json({ success: true, problems });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching problems" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await db.problem.findUnique({ where: { id } });
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    return res.status(200).json({ success: true, problem });
  } catch (error) {
    return res.status(500).json({ error: "Error fetching problem" });
  }
};

export const updateProblem = async (req, res) => {}
export const deleteProblem = async (req, res) => {}
export const getAllProblemsSolvedByUser = async (req, res) => {}