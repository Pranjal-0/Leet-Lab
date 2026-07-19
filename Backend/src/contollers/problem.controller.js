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
    /* 
      ==========================================
      JUDGE0 LOOP IS TEMPORARILY REMOVED 
      TO PROVE POSTGRESQL DATABASE WORKS!
      ==========================================
    */
    
    // Save directly to Postgres using Prisma
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

    // If Prisma doesn't crash, it worked!
    return res.status(201).json({ 
      message: "Saved to database successfully!", 
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
      where: { id },
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