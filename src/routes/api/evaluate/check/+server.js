import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { headers, id, prob } = await request.json()

  const response = await axios.get(`https://leetcode.com/submissions/detail/${id}/check`, {
    headers: {
      'Referer': `https://leetcode.com/problems/${prob}/`,
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': headers.lc,
      'Cookie': `csrftoken=${headers.lc};LEETCODE_SESSION=${headers.ls};`
    },
    withCredentials: false
  });

  return json(response.data);
}