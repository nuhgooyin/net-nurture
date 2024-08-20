import { Router } from "express";
import { Contact } from "../models/contact.js";
import { authenticate } from "../middleware/authenticate.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config(); // Load environment variables

export const llmRouter = Router();

async function getSummary(contact) {
  const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

And here is another example:
- From UTSC
- In statistics program
- UTRAHacks was their first hackathon
- Interested in data science
- Likes to longboard

And here is another example:
- From UTM
- Studying computer science, and minoring in math
- Currently learning mainstream full-stack development (i.e. MERN stack)
- Interested in learning about more low-level development (i.e. Rust, C) with operating systems, and parallel programming
- Enjoys playing badminton, bouldering, and mountain-biking

Additional Notes:
1. No need to prefix each bullet point with "${contact.name}"
2. Do not assume ${contact.name}'s pronouns (I.e. it's safer to just say "they" instead).
3. Notice how the two provided examples do not prefix everything with "they"
4. If there isn't enough information about ${contact.name}, then no need to add any more bullet points. Just summarize whatever information is available.
5. The bullet points should be organized from newest to oldest (i.e. bullet points about recent messages should come first at the top). Note that the given conversation has newer messages first, and older ones last.
6. A slightly greater emphasis/focus should be placed on the most recent messages.
`;
  let generatedContent = await model.generateContent(prompt);

  generatedContent =
    generatedContent.response.candidates[0].content.parts[0].text;
  contact.summary = generatedContent;
  await contact.save();
}

//
// Summarizer - Generate a summaries for each contact using the rawSummary
// Precondition: The database has been populated using the gmail-router fetch already. (no other inputs are necessary).
// Returns: Contacts successfully updated in database.
//
llmRouter.post("/summarize", async (req, res) => {
  try {
    // Find all contacts whose summaries are not yet generated
    let contactsFound = await Contact.findAll({
      where: {
        summary: null,
        summaryRaw: { [Op.not]: null },
      },
    });

    if (contactsFound === null) {
      return res.json({ message: "No contacts to summarize." });
    }

    for (let i = 0; i < contactsFound.length; i++) {
      let contact = contactsFound[i];
      getSummary(contact);
    }

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
// Precondition: The summaryRaw needs to be filled first before being revised.
// Requirements: Must provide a contact ID (database primary key) in query params.
// Example: /api/llm/revise?contactId=3
// Returns: Revised summary of the contact.
//
llmRouter.patch("/revise", async (req, res) => {
  let contact = await Contact.findByPk(req.query.contactId);
  getSummary(contact);
});
