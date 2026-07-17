import{getJudge0LanguageId, submitBatch,pollBatchResults} from"../libs/judge0.js"
import {db} from"../libs/db.js"

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
  referenceSolution
} = req.body;
  if (req.user.role != "ADMIN") {
    return res.status(403).json({ error: "you are not allowed to create a problem" });
  }

  try {
    // Validate every language's reference solution against all testcases
    console.log(req.body);
    // console.log("referncesSolution:", refernceSolution);
    
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
     
      const submissionResults = await submitBatch(submissions);
      
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);
      
      console.log(results,"zzzzzzzzzzzzzzzzzzzz")
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    // All languages passed all testcases -> create problem once
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
        referenceSolutions: referenceSolution,
        userId: req.user.id,
      },
    });

    return res.status(201).json(newProblem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong while creating the problem" });
  }
};
export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (problems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No problems found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching problems"
    });
  }
};
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Error while fetching problem by id",
    });
  }
};
export const updateProblem = async (req, res) => {}
export const deleteProblem = async (req, res) => {}
export const getAllProblemsSolvedByUser = async (req, res) => {}