import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { user } = await request.json()

  const response = await axios.post(`https://leetcode.com/graphql`, JSON.stringify({
    "operationName": "userProfileCalendar",
    "query": `query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
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