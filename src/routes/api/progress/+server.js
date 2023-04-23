import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { user } = await request.json()

  const response = await axios.post(`https://leetcode.com/graphql`, JSON.stringify({
    "operationName": "skillStats",
    "query": `query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }`,
    "variables": {
      "username": user
    }
  }), {
    headers: {
      'Referer': `https://leetcode.com/${user}/`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    withCredentials: false
  });

  return json(response.data);
}