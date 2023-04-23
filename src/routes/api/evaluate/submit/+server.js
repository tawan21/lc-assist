import { json } from "@sveltejs/kit";
import axios from "axios";

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { data, headers, ques } = await request.json()

  const response = await axios.post(`https://leetcode.com/problems/${ques}/submit/`, data, {
    headers: {
      'Referer': `https://leetcode.com/problems/${ques}/`,
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': headers.lc,
      'Cookie': `csrftoken=${headers.lc};LEETCODE_SESSION=${headers.ls};`
    },
    withCredentials: false
  });

  return json(response.data)
}