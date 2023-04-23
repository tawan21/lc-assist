import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { user } = await request.json()

  const response = await axios.post(`https://leetcode.com/graphql`, JSON.stringify({
    "operationName": "recentAcSubmissions",
    "query": `query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
      }
  }`,
    "variables": {
      "username": user,
      "limit": 15
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