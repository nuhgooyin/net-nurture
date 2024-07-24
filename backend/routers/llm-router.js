import { Router } from "express";
import { Contact } from "../models/contact.js";
import { authenticate } from "../middleware/authenticate.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
export const llmRouter = Router();

//
// Summarizer - Generate a summaries for each contact using the rawSummary
// Precondition: The database has been populated using the gmail-router fetch already. (no other inputs are necessary).
// Returns: Contacts successfully updated in database.
//
llmRouter.post("/summarize", authenticate, async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Find all contacts whose summaries are not yet generated
    let contactsFound = await Contact.findAll({
      where: {
        summary: null,
      },
    });

    contactsFound.forEach(async (contact) => {
      let prompt =
        `given this conversation: ` +
        contact.summaryRaw.toString() +
        `provide a less than 100-word summary with a fixation on facts about ${contact.name} (I.e. what job they have, what they are concerned about, what school they went to, etc.) in the following bullet-point format:
  
  - <topic of conversation> (for example, "Discussing upcoming doctor's appointment for backpain")
  
  after this is a series of bullet points highlighting the main points of the conversation. here is one example of what this might look like:
  - Originally from California, moved to Canada for many years now
  - Has two daughters who are in elementary school
  - Canada is like a second home now
  - Likes literature, but dad told her to pursue a career that would pay the bills
  - Found out she liked economics after going to a friend's lecture
  - Went to UCSD for bachelors
  
  Here is another example:
  - Plays instruments casually (guitar, keyboard)
  - Always liked philosophy and wanted to pursue it
  - Enjoys going on walks to let the mind wander
  - Has been at UofT for a while now
  
  Additional Notes:
  1. No need to prefix each bullet point with "${contact.name}"
  2. Do not assume ${contact.name}'s pronouns (I.e. it's safer to just say "they" instead).
  3. Notice how the two provided examples do not prefix everything with "they"
  4. If there isn't enough information about ${contact.name}, then no need to add any more bullet points. Just summarize whatever information is available.
  `;
      let generatedContent = await model.generateContent(prompt);

      generatedContent =
        generatedContent.response.candidates[0].content.parts[0].text;
      contact.summary = generatedContent;
      await contact.save();
    });
    return res.json({ contacts: contactsFound });
  } catch (e) {
    console.log(e);
    if (e.name === "SequelizeForeignKeyConstraintError") {
      return res.status(422).json({ error: "Invalid foreign key." });
    } else if (e.name === "SequelizeValidationError") {
      return res.status(422).json({
        error: "Invalid input parameters.",
      });
    } else {
      return res
        .status(400)
        .json({ error: "Cannot update summaries in database." });
    }
  }
});

//
// Revise summary of a specific contact
// Requirements: Must provide a contact ID (database primary key), and additional message to revise the summary.
// Example request body: { contactID: 1, message: "I went to UCSD for economics and am planning on finishing a masters in data science there too." }
// Returns: Revised summary of the contact.
//
llmRouter.patch("/revise", async (req, res) => {});
