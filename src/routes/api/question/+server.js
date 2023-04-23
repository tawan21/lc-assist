import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { ques } = await request.json()

  const response = await axios.post(`https://leetcode.com/graphql`, JSON.stringify({
    "operationName": "questionData",
    "query": `query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        questionTitle
        translatedTitle
        questionTitleSlug
        content
        translatedContent
        difficulty
        stats
        similarQuestions
        categoryTitle
        exampleTestcases
        enableTestMode
        codeSnippets{
          langSlug
          code
        }
    }
  }`,
    "variables": {
      "titleSlug": ques
    }
  }), {
    headers: {
      'Referer': `https://leetcode.com/`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    withCredentials: false
  });

  return json(response.data);
}