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
      body: `{"operationName":"userContestRankingInfo","variables":{"username":"${req.params.user}"},"query":"query userContestRankingInfo($username: String!) {\
        userContestRanking(username: $username) {\
            attendedContestsCount\
            rating\
            globalRanking\
          }\
        userContestRankingHistory(username: $username) {\
          attended\
          rating\
          ranking\
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

router.get("/submission_calendar/:user", async (req, res) => {
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
      body: `{"operationName":"userProfileCalendar","variables":{"username":"${req.params.user}"},"query":"query userProfileCalendar($username: String!, $year: Int) {\
          matchedUser(username: $username) {\
            userCalendar(year: $year) {\
              activeYears\
              streak\
              totalActiveDays\
              submissionCalendar\
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

router.get("/skill_stats/:user", async (req, res) => {
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
      body: `{"operationName":"skillStats","variables":{"username":"${req.params.user}"},"query":"query skillStats($username: String!) {\
        matchedUser(username: $username) {\
          tagProblemCounts {\
            advanced {\
              tagName\
              problemsSolved\
            }\
            intermediate {\
              tagName\
              problemsSolved\
            }\
            fundamental {\
              tagName\
              problemsSolved\
            }\
          }\
        }\
      }\
      "}`,
      method: "POST",
      mode: "cors",
    });
    response = await response.json()
    res.send(response.data.matchedUser.tagProblemCounts)
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

const getOutput = async (id, prob, headers) => {
  try {
    const response = await axios.get(`https://leetcode.com/submissions/detail/${id}/check`, {
      headers: {
        'Referer': `https://leetcode.com/problems/${prob}/`,
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': headers.csrf_token,
        'Cookie': `csrftoken=${headers.csrf_token};LEETCODE_SESSION=${headers.session_id};`
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
      result = await getOutput(response.data.interpret_id, req.params.title, req.headers)
    } while (result.state !== "SUCCESS" || ct > 0);

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
      result = await getOutput(response.data.submission_id, req.params.title, req.headers)
    } while (result.state !== "SUCCESS" || ct > 0);

    res.send(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

export default router;