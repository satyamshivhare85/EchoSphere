import express from "express";
import { createStory, getStories, addReply } from "../controllers/story.controllers.js";

const StoryRouter = express.Router();

StoryRouter.post("/", createStory); // Create story
StoryRouter.get("/", getStories); // Get all stories
StoryRouter.post("/:storyId/reply", addReply); // Add reply to a story

export default StoryRouter;
