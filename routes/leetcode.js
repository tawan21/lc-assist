import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();
import axios from "axios";

router.get("/contest_stats/:user", async (req, res) => {
  try {
    let response = await fetch("https://leetcode.com/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ru;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
      },
      referrer: "https://leetcode.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"getContestRankingData","variables":{"username":"${req.params.user}"},"query":"query getContestRankingData($username: String!) {\
        userContestRanking(username: $username) {\
          attendedContestsCount\
          rating\
          globalRanking\
          }\
      }\
      "}`,
      method: "POST",
      mode: "cors",
    });
    response = await response.json()
    res.send(response.data)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/submissions/:user", async (req, res) => {
  try {
    let response = await fetch("https://leetcode.com/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ru;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
      },
      referrer: "https://leetcode.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"recentAcSubmissions","variables":{"username":"${req.params.user}", "limit": 15},"query":"query recentAcSubmissions($username: String!, $limit: Int!) {\
          recentAcSubmissionList(username: $username, limit: $limit) {\
          id\
          title\
          titleSlug\
          timestamp\
          }\
      }\
      "}`,
      method: "POST",
      mode: "cors",
    });
    response = await response.json()
    res.send(response.data)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/solved/:user", async (req, res) => {
  try {
    let response = await fetch("https://leetcode.com/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ru;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
      },
      referrer: "https://leetcode.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"userProblemsSolved","variables":{"username":"${req.params.user}"},"query":"query userProblemsSolved($username: String!) {\
          matchedUser(username: $username) {\
          submitStatsGlobal {\
          acSubmissionNum {\
          difficulty\
          count\
          }\
        }\
        }\
      }\
      "}`,
      method: "POST",
      mode: "cors",
    });
    response = await response.json()
    res.send(response.data)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/question/:title", async (req, res) => {
  try {
    let response = await fetch("https://leetcode.com/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ru;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
      },
      referrer: `https://leetcode.com/`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"questionData","variables":{"titleSlug":"${req.params.title}"},"query":"query questionData($titleSlug: String!) {\
        question(titleSlug: $titleSlug) {\
          questionId\
          questionFrontendId\
          questionTitle\
          translatedTitle\
          questionTitleSlug\
          content\
          translatedContent\
          difficulty\
          stats\
          similarQuestions\
          categoryTitle\
          exampleTestcases\
          enableTestMode\
          codeSnippets{\
            langSlug\
            code\
          }\
      }\
    }\
      "}`,
      method: "POST",
      mode: "cors",
    });
    response = await response.json()
    res.send(response.data)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/user/:cookie", async (req, res) => {
  try {
    let response = await fetch("https://leetcode.com/graphql", {
      headers: {
        accept: "*/*",
        "accept-language":
          "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,ru;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "cookie": `LEETCODE_SESSION=${req.params.cookie};`,
        pragma: "no-cache",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua":
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
      },
      referrer: `https://leetcode.com/`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"operationName":"globalData","variables":{},"query":"query globalData {\
          userStatus {\
            userId\
            isSignedIn\
            isMockUser\
            isPremium\
            isVerified\
            username\
            avatar\
            isAdmin\
            isSuperuser\
            permissions\
            isTranslator\
            activeSessionId\
            checkedInToday\
            notificationStatus {\
              lastModified\
              numUnread\
            }\
          }\
        }\
      "}`,
      method: "POST",
      mode: "cors",
    });
    response = await response.json()
    res.send(response.data)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get("/username/:username", async (req, res) => {
  try {
    const response = await axios.post(`https://leetcode.com/graphql`, JSON.stringify({
      "operationName": "userPublicProfile",
      "query": `query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          githubUrl
          linkedinUrl
          profile {
            userAvatar
            ranking
            realName
            aboutMe
            countryName
          }
        }
      }`,
      "variables": {
        "username": req.params.username
      }
    }), {
      headers: {
        'Referer': `https://leetcode.com/${req.params.username}/`,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      withCredentials: false
    });

    res.send(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

const getOutput = async (id, prob) => {
  try {
    const response = await axios.get(`https://leetcode.com/submissions/detail/${id}/check`, {
      headers: {
        'Referer': `https://leetcode.com/problems/${prob}/`,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': 'MGo78UjFByPCYHposdG8AamXrRuxNzWXIYvtOb862Uh1OWYNCyDLAfBFLyrEj8qC',
        'Cookie': `csrftoken=MGo78UjFByPCYHposdG8AamXrRuxNzWXIYvtOb862Uh1OWYNCyDLAfBFLyrEj8qC;LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50X3ZlcmlmaWVkX2VtYWlsIjpudWxsLCJhY2NvdW50X3VzZXIiOiI1aTJicSIsIl9hdXRoX3VzZXJfaWQiOiI5MjQwOTAyIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoiYWxsYXV0aC5hY2NvdW50LmF1dGhfYmFja2VuZHMuQXV0aGVudGljYXRpb25CYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiYzY1OWJiZjQxZTQ4OTIzYjIxMzBiNWZhM2FkYWY5OWM5NzcyMzU4YSIsImlkIjo5MjQwOTAyLCJlbWFpbCI6ImFub242OWZAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhbm9ubm9uYW5vbiIsInVzZXJfc2x1ZyI6ImFub25ub25hbm9uIiwiYXZhdGFyIjoiaHR0cHM6Ly9zMy11cy13ZXN0LTEuYW1hem9uYXdzLmNvbS9zMy1sYy11cGxvYWQvYXNzZXRzL2RlZmF1bHRfYXZhdGFyLmpwZyIsInJlZnJlc2hlZF9hdCI6MTY4MTAyOTk2MCwiaXAiOiIxMDMuNjYuMjA2LjMiLCJpZGVudGl0eSI6ImMzZmNkOWU1MmZkNzc1YzQzYzk1NTNhOTYxYmZjNTJjIiwic2Vzc2lvbl9pZCI6Mzc4MjA1NzN9.-hX5Ml5n_cB5Qae6yEWETr5B3CmfOeE4iEhD_JHfh9g;`
      },
      withCredentials: false
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

router.post("/interpret/:title", async (req, res) => {
  try {
    const response = await axios.post(`https://leetcode.com/problems/${req.params.title}/interpret_solution/`, req.body, {
      headers: {
        'Referer': `https://leetcode.com/problems/${req.params.title}/`,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': req.get("csrf_token"),
        'Cookie': `csrftoken=${req.get("csrf_token")};LEETCODE_SESSION=${req.get("session_id")};`
      },
      withCredentials: false
    });

    let result = null, ct = 5;

    do {
      --ct;
      result = await getOutput(response.data.interpret_id, req.params.title)
    } while (result.state === "PENDING" || ct > 0);

    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post("/submit/:title", async (req, res) => {
  try {
    const response = await axios.post(`https://leetcode.com/problems/${req.params.title}/submit/`, req.body, {
      headers: {
        'Referer': `https://leetcode.com/problems/${req.params.title}/submissions/`,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': req.get("csrf_token"),
        'Cookie': `csrftoken=${req.get("csrf_token")};LEETCODE_SESSION=${req.get("session_id")};`
      },
      withCredentials: false
    });

    let result = null, ct = 5;

    do {
      --ct;
      result = await getOutput(response.data.submission_id, req.params.title)
    } while (result.state !== "SUCCESS" || ct > 0);

    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

export default router;