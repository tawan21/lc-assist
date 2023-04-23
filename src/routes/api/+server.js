import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { session } = await request.json()

  const response = await axios.post("https://leetcode.com/graphql", JSON.stringify({
    "operationName": "globalData", "query": `query globalData {
        userStatus {
          userId
          isSignedIn
          isMockUser
          isPremium
          isVerified
          username
          avatar
          isAdmin
          isSuperuser
          permissions
          isTranslator
          activeSessionId
          checkedInToday
          notificationStatus {
            lastModified
            numUnread
          }
        }
      }`
  }), {
    headers: {
      "cookie": `LEETCODE_SESSION=${session};`,
      "Referrer": `https://leetcode.com/`,
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    },
    withCredentials: false
  })

  return json(response.data);
}