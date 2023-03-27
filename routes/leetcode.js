import express from "express";
import { body, validationResult } from "express-validator";
const router = express.Router();

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

export default router;